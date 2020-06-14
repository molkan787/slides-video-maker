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
                const { duration, type, size, scale, audioFilename, outputFilename } = options;
                const webpage = this.webpage = new WebPage();
                progress.setStatus('starting');
                await webpage.create(type, slides, { size, scale });
                await sleep(500);
                await this.prepareFolder(this.tmpDirPath);
                await this.rimraf(path.join(this.tmpDirPath, '*'));
                progress.setStatus('rendering_transitions');
                const inputs = await this.buildTimeline(progress, type, slides);
                console.log('Timeline inputs:', inputs);
                await this.buildOutput(progress, inputs, audioFilename, outputFilename, duration / 1000);
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
            // if(i == 0) continue; // DEBUG
            const transition = await this.renderTransition(slides, i);
            const { outputDir, framesCount, durationFactor, reduced } = transition;
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

            const isLastSlide = i == slides.length - 1;
            // Slide 
            const lastframe = `frame${framesCount - 1}.png`;
            const options = ['-loop 1'];
            if(!reduced || isLastSlide) inputs.push({
                filename: path.join(outputDir, lastframe),
                options: options
            });
            if(kinetic){
                if(isLastSlide){
                    let duration = slide.duration - (tduration / 2);
                    options.push(`-t ${duration / 1000}`);
                }
                if(i > 0){
                    let duration = slides[i - 1].duration - (tduration / 2);
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

    async buildOutput(progress, inputs, audioFilename, outputFilename, duration){
        const videoOutFile = audioFilename ? path.join(this.tmpDirPath, 'tmp_video.mp4') : outputFilename;
        progress.setStatus('rendering_video');
        await this.prepareFfmpeg();
        await sleep(100);
        await this.renderVideo(inputs, videoOutFile, duration);
        if(audioFilename){
            progress.setStatus('adding_audio');
            await this.mergeVideoAndAudio(videoOutFile, audioFilename, outputFilename, duration);
        }
    }

    mergeVideoAndAudio(videoFilename, audioFilename, outputFilename, duration){
        return new Promise((resolve, reject) => {
            const ffmpeg = new ffmpegCommand();
            ffmpeg.input(videoFilename)
            .input(audioFilename)
            .outputOptions([
                '-c:v copy',
                '-c:a aac',
                '-t ' + duration,
            ])
            .output(outputFilename)
            .on('error', reject).on('end', resolve)
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .run();
        });
    }

    renderVideo(inputs, outputFilename, duration){
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
                '-t ' + duration
            ])
            .on('error', reject).on('end', resolve)
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .mergeToFile(outputFilename, path.join(this.tmpDirPath, 'fftmp'));
        })
    }
    
    async renderTransition(slides, index){
        let reduced = false;
        const slide1 = slides[index - 1];
        const slide2 = slides[index];
        const duration1 = (slide1 && slide1.duration) || Infinity;
        const duration2 = (slide2 && slide2.duration) || Infinity;
        const outputDir = path.join(this.tmpDirPath, `transition${index}`);
        let durationFactor = await this.webpage.setSlides(slide1, slide2);
        console.log('durationFactor:', durationFactor);
        const tduration = durationFactor * 1000;
        if(duration1 < tduration || duration2 < tduration ){
            const lowest = Math.min(duration1, duration2);
            durationFactor = lowest / 1000;
            reduced = true;
            console.log('Adjusted durationFactor:', durationFactor);
        }
        await sleep(200);
        const framesCount = Math.round(durationFactor * this.fps);
        await this.recordFrames(outputDir, framesCount);
        return {
            outputDir,
            framesCount,
            durationFactor,
            reduced
        }
    }

    async recordFrames(outputDir, framesCount){
        await this.prepareFolder(outputDir);
        console.time('recordFrames');

        // Resolve an issue with large image as background (Originally does not show on the first frame)
        await this.webpage.capturePage();

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

    async prepareFfmpeg(){
        const files = await FileExtractor.extractIfNotExist([
            isMacOS ? 'ffmpeg' : 'ffmpeg.exe',
            isMacOS ? 'ffprobe' : 'ffprobe.exe',
        ]);
        for(let file of files){
            fs.chmodSync(file, '755');
        }
        return files;
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