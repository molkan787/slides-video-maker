import electron from 'electron';
import fontList from 'font-list';
import store from './store';

export default class Shell{

    static async load(){
        let fonts = await fontList.getFonts();
        fonts = fonts.map(f => f.replace(/"/g, ''));
        store.state.app.fontsList = fonts;
    }

    static openExternal(url){
        return electron.shell.openExternal(url)
    }

    static setProjectType(type){
        store.state.project.type = type;
    }

}