import { ipcMain } from 'electron';
import { PresentationRenderer } from './presentation-renderer';

const LISTEN_CHANNEL = 'render-presentation';
const PROGRESS_UPDATE_CHANNEL = 'render-presentation-progress';
const STATUS_UPDATE_CHANNEL = 'render-presentation-status';

export class RendererDelegate{

    constructor(){
        ipcMain.on(LISTEN_CHANNEL, (event, arg) => {
            console.log('Received render-presentation request')
            this.handleRenderRequest(event, arg);
        });
    }

    async handleRenderRequest(event, arg){
        try {
            const progress = this.render(arg);
            progress.on('statusChanged', ({ code }) => {
                event.reply(STATUS_UPDATE_CHANNEL, {
                    status: code
                });
            })
            progress.on('changed', ({ success, failure }) => {
                event.reply(PROGRESS_UPDATE_CHANNEL, {
                    success,
                    failure
                });
            })
        } catch (error) {
            console.error(error);
            event.reply(PROGRESS_UPDATE_CHANNEL, {
                status: 'error'
            });
        }
    }

    render(rawData){
        const data = JSON.parse(rawData);
        const { slides, options } = data;
        const renderer = new PresentationRenderer();
        const progress = renderer.render(slides, options);
        return progress;
    }

}