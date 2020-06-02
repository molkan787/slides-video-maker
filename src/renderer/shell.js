import fontList from 'font-list';
import store from './store';

export default class Shell{

    static async load(){
        let fonts = await fontList.getFonts();
        fonts = fonts.map(f => f.replace(/"/g, ''));
        store.state.app.fontsList = fonts;
    }

}