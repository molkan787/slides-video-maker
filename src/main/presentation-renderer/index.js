import { app } from 'electron';
import { Progress } from '../libs/Progress';
import FileExtractor from '../file-extractor';
const ffmpegCommand = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { WebPage } = require('./webpage');
const { sleep } = require('./utils');

const isMacOS = process.platform == 'darwin';

const appDataDir = app.getPath('userData');
const ffmpegPath = path.join(appDataDir, isMacOS ? 'ffmpeg' : 'ffmpeg.exe');

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
                const { type, size, audioFilename, outputFilename } = options;
                const webpage = this.webpage = new WebPage();
                progress.setStatus('starting');
                await webpage.create(type, slides, size);
                await sleep(500);
                await this.prepareFolder(this.tmpDirPath);
                await this.rimraf(path.join(this.tmpDirPath, '*'));
                progress.setStatus('rendering_transitions');
                const inputs = await this.buildTimeline(progress, type, slides);
                console.log('Timeline inputs:', inputs);
                await this.buildOutput(progress, inputs, audioFilename, outputFilename);
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

    async buildTimeline(progress, type, slides){
        const kinetic = type == 'kinetic';
        const offset = kinetic ? 0 : 1;
        const inputs = [];
        let previous_tduration = 0;
        let previous_options = [];
        for(let i = offset; i < slides.length; i++){
            if(progress.isFinished) break;
            const slide = slides[i];
            const transition = await this.renderTransition(slides, i);
            const { outputDir, framesCount, durationFactor } = transition;
            const tduration = durationFactor * 1000;
            // Initial sequence
            if(!kinetic && i == 1){
                const duration = slides[0].duration - (tduration / 2);
                inputs.push({
                    filename: path.join(outputDir, 'frame0.png'),
                    options: ['-loop 1', `-t ${duration / 1000}`]
                });
            }
            
            // Slides transition
            inputs.push({
                filename: path.join(outputDir, 'frame%d.png'),
                options: ['-r ' + this.fps]
            });

            // Slide 
            const lastframe = `frame${framesCount - 1}.png`;
            const options = ['-loop 1'];
            inputs.push({
                filename: path.join(outputDir, lastframe),
                options: options
            });
            if(kinetic){
                let duration = slide.duration - (tduration / 2);
                if(i == slides.length - 1){
                    options.push(`-t ${duration / 1000}`);
                }
                if(i > 0){
                    duration -= i == 1 ? previous_tduration : (previous_tduration / 2);
                    previous_options.push(`-t ${duration / 1000}`);
                }
            }else{
                const take_full_time = i > 0 && i < slides.length - 1;
                const duration = slide.duration - (take_full_time ? tduration : tduration / 2);
                options.push(`-t ${duration / 1000}`);
            }
            previous_options = options;
            previous_tduration = tduration;
            progress.report(1, 0);
        }
        return inputs;
    }

    async buildOutput(progress, inputs, audioFilename, outputFilename){
        const videoOutFile = audioFilename ? path.join(this.tmpDirPath, 'tmp_video.mp4') : outputFilename;
        progress.setStatus('rendering_video');
        await this.prepareFfmpeg();
        await sleep(100);
        await this.renderVideo(inputs, videoOutFile);
        if(audioFilename){
            progress.setStatus('adding_audio');
            await this.mergeVideoAndAudio(videoOutFile, audioFilename, outputFilename);
        }
    }

    mergeVideoAndAudio(videoFilename, audioFilename, outputFilename){
        return new Promise((resolve, reject) => {
            const ffmpeg = new ffmpegCommand();
            ffmpeg.input(videoFilename)
            .input(audioFilename)
            .outputOptions([
                '-c:v copy',
                '-c:a aac',
                '-shortest'
            ])
            .output(outputFilename)
            .on('error', reject).on('end', resolve)
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .run();
        });
    }

    renderVideo(inputs, outputFilename){
        return new Promise((resolve, reject) => {
            const ffmpeg = new ffmpegCommand();

            for(let input of inputs){
                const { filename, options } = input;
                ffmpeg.input(filename).inputOptions(options);
            }

            ffmpeg.videoCodec('libx264')
            .outputOptions([
                '-crf 1',
                '-pix_fmt yuv420p',
                '-r ' + this.fps,
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
            framesCount,
            durationFactor
        }
    }

    async recordFrames(outputDir, framesCount){
        await this.prepareFolder(outputDir);
        console.time('recordFrames');
        for(let i = 0; i < framesCount; i++){
            const stage = i / (framesCount - 1);
            const filename = path.join(outputDir, `frame${i}.png`);
            await this.webpage.seekTransition(stage);
            await sleep(30);
            const image = await this.webpage.capturePage();
            await this.writeFile(filename, image.toPNG());
        }
        console.timeEnd('recordFrames');
        return framesCount;
    }

    prepareFfmpeg(){
        return FileExtractor.extractIfNotExist([
            isMacOS ? 'ffmpeg' : 'ffmpeg.exe',
            isMacOS ? 'ffprobe' : 'ffprobe.exe',
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