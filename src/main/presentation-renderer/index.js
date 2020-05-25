import { app } from 'electron';
import { Progress } from '../libs/Progress';
import FileExtractor from '../file-extractor';
const ffmpegCommand = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { WebPage } = require('./webpage');
const { sleep } = require('./utils');

const appDataDir = app.getPath('userData');
const ffmpegPath = path.join(appDataDir, 'ffmpeg.exe');

ffmpegCommand.setFfmpegPath(ffmpegPath);
console.log('app data dir:', appDataDir);

export class PresentationRenderer{

    constructor(){
        this.tmpDirPath = path.join(app.getPath('temp'), 'SVM');
        FileExtractor.setBaseFolderPath(appDataDir);
        console.log('Temp dir:', this.tmpDirPath);
        this.fps = 60;
    }

    render(slides, options){
        const progress = new Progress(slides.length);
        (async () => {
            try {
                const { size, outputFilename } = options;
                const webpage = this.webpage = new WebPage();
                progress.setStatus('starting');
                await webpage.create(slides, size);
                await sleep(500);
                await this.prepareFolder(this.tmpDirPath);
                await this.rimraf(path.join(this.tmpDirPath, '*'));
                progress.setStatus('rendering_transitions');
                const transitions = [];
                for(let i = 1; i < slides.length; i++){
                    const transition = await this.renderTransition(slides, i);
                    transitions.push(transition);
                    progress.report(1, 0);
                }
                progress.setStatus('rendering_video');
                await this.prepareFfmpeg();
                await sleep(100);
                await this.renderVideo(transitions, outputFilename);
                progress.finish('completed');
                webpage.destroy();
                this.rimraf(path.join(this.tmpDirPath, '*'))
            } catch (error) {
                console.log('Error in PresentationRenderer.render()');
                console.error(error);
                progress.finish('error');
            }
        })();
        return progress;
    }

    renderVideo(transitions, outputFilename){
        return new Promise((resolve, reject) => {
            const ffmpeg = new ffmpegCommand();
            ffmpeg
            .input(path.join(transitions[0].outputDir, 'frame0.png'))
            .inputOptions(['-loop 1', '-t 3'])
            
            for(let transition of transitions){
                ffmpeg.input(path.join(transition.outputDir, 'frame%d.png'))
                ffmpeg.inputOptions(['-r ' + this.fps])
                const lastframe = `frame${transition.framesCount - 1}.png`
                ffmpeg.input(path.join(transition.outputDir, lastframe))
                ffmpeg.inputOptions(['-loop 1', '-t 3'])
            }

            ffmpeg.videoCodec('libx264')
            .outputOptions([
                '-crf 1',
                '-pix_fmt yuv420p',
                '-r ' + this.fps
            ])
            .on('error', reject).on('end', resolve)
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .mergeToFile(outputFilename, path.join(this.tmpDirPath, 'fftmp'));
        })
    }
    
    async renderTransition(slides, index){
        const slide1 = slides[index - 1];
        const slide2 = slides[index];
        const outputDir = path.join(this.tmpDirPath, `transition${index}`);
        const durationFactor = await this.webpage.setSlides(slide1, slide2);
        console.log('durationFactor:', durationFactor);
        await sleep(200);
        const framesCount = Math.ceil(durationFactor * this.fps);
        await this.recordFrames(outputDir, framesCount);
        return {
            outputDir,
            framesCount
        }
    }

    async recordFrames(outputDir, framesCount){
        await this.prepareFolder(outputDir);
        console.time('recordFrames');
        for(let i = 0; i < framesCount; i++){
            const stage = i / (framesCount - 1);
            const filename = path.join(outputDir, `frame${i}.png`);
            await this.webpage.seekTransition(stage);
            const image = await this.webpage.capturePage();
            await this.writeFile(filename, image.toPNG());
        }
        console.timeEnd('recordFrames');
        return framesCount;
    }

    prepareFfmpeg(){
        return FileExtractor.extractIfNotExist([
            'ffmpeg.exe',
            'ffprobe.exe'
        ])
    }

    writeFile(filename, data){
        return new Promise((resolve, reject) => {
            fs.writeFile(filename, data, err => {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    prepareFolder(path) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, function(err) {
                if (err) {
                    if (err.code == 'EEXIST') resolve(); // ignore the error if the folder already exists
                    else reject(err); // something else went wrong
                } else resolve(); // successfully created folder
            });
        })
    }

    rimraf(path){
        return new Promise((resolve, reject) => {
            rimraf(path, err => {
                err ? reject(err) : resolve();
            });
        })
    }

}