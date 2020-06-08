const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { sleep } = require('./utils');

const SHOW_WIN = false;
const REQUEST_CHANNEL = 'set-slides';
const REPLY_CHANNEL = 'set-slides-reply';

export class WebPage{

    constructor(){
        this.window = null;
        this.slides = null;
    }

    async create(type, slides, options){
        this.slides = slides;
        const { size } = options;
        const { width, height } = size;
        const win = this.window = new BrowserWindow({
            width,
            height,
            show: SHOW_WIN,
            useContentSize: true,
            enableLargerThanScreen: true,
            webPreferences: {
                offscreen: !SHOW_WIN,
                nodeIntegration: true,
            },
        });
        win.setSize(width, height);
        if(SHOW_WIN) win.openDevTools();
        win.loadFile(path.join(__static, 'webpage', 'index.html'));
        await this.didFinishLoad(win);
        await sleep(100);
        const optionsJSON = JSON.stringify(options);
        await this.exec(`setup('${type}', '${optionsJSON}')`);
        await sleep(50);
    }

    setSlides(slide1, slide2){
        return new Promise((resolve, reject) => {
            this.window.webContents.send(REQUEST_CHANNEL, slide1, slide2);
            ipcMain.once(REPLY_CHANNEL, (e, error, data) => {
                console.log('Got IPC reply:', error, data);
                if(error) reject(new Error(error));
                else resolve(data);
            })
        })

        // const slide1String = slide1 ? JSON.stringify(slide1).replace(/'/g, "\\'").replace(/\\n/g, '\\\\n') : ''; 
        // console.log(slide1String);
        // const slide2String = JSON.stringify(slide2).replace(/'/g, "\\'").replace(/\\n/g, '\\\\n');
        // return this.exec(`setSlides('${ebs(slide1String)}', '${ebs(slide2String)}')`);
    }

    seekTransition(stage){
        let _stage = parseFloat(stage);
        if(_stage > 1) _stage = 1;
        return this.exec(`seek(${_stage})`);
    }

    capturePage(){
        return this.window.capturePage();
    }

    didFinishLoad(window){
        return new Promise(resolve => {
            window.webContents.on('did-finish-load', resolve);
        })
    }

    exec(script){
        return this.window.webContents.executeJavaScript(script);
    }

    destroy(){
        this.window.destroy();
        this.window = null;
    }
}

function ebs(str){
    return str.replace(/\\/g, '\\\\');
}