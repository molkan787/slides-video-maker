import { ipcRenderer } from 'electron';
import Progress from '../libs/Progress';

const REQUEST_CHANNEL = 'render-presentation';
const PROGRESS_UPDATE_CHANNEL = 'render-presentation-progress';
const STATUS_UPDATE_CHANNEL = 'render-presentation-status';

export class RendererService{
    constructor(){
        this.progress = new Progress(0);
        ipcRenderer.on(STATUS_UPDATE_CHANNEL, (event, arg) => {
            this.handleStatusUpdate(event, arg);
        });
        ipcRenderer.on(PROGRESS_UPDATE_CHANNEL, (event, arg) => {
            this.handleProgressUpdate(event, arg);
        });
    }

    handleStatusUpdate(event, data){
        const { status } = data;
        if(status == 'completed' || status == 'error'){
            this.progress.finish(status);
        }else{
            this.progress.setStatus(status);
        }
    }

    handleProgressUpdate(event, data){
        const { success, failure } = data;
        this.progress.report(success, failure);
    }

    render(data){
        this.progress = new Progress(data.slides.length);
        ipcRenderer.send(REQUEST_CHANNEL, JSON.stringify(data));
        return this.progress;
    }
}