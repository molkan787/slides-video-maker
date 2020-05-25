const { BrowserWindow } = require('electron');
const path = require('path');
const { sleep } = require('./utils');

const SHOW_WIN = false;

export class WebPage{

    constructor(){
        this.window = null;
        this.slides = null;
        this.currentSlideIndex = 0;
    }

    async create(slides, size){
        this.slides = slides;
        const { width, height } = size;
        const win = this.window = new BrowserWindow({
            width,
            height,
            show: SHOW_WIN,
            useContentSize: true,
            webPreferences: {
                offscreen: !SHOW_WIN,
            },
        });
        // win.openDevTools();
        win.loadFile(path.join(__static, 'webpage', 'index.html'));
        await this.didFinishLoad(win);
        await sleep(100);
    }

    setSlides(slide1, slide2){
        const slide1String = JSON.stringify(slide1).replace(/'/g, "\\'").replace(/\\n/g, '\\\\n'); 
        const slide2String = JSON.stringify(slide2).replace(/'/g, "\\'").replace(/\\n/g, '\\\\n'); 
        return this.exec(`setSlides('${slide1String}', '${slide2String}')`);
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
