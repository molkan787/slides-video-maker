import electron from 'electron';
import path from 'path';
const dialog = electron.remote.require('electron').dialog;

export async function promptSaveFile(filters) {
    const resp = await dialog.showSaveDialog({ filters })
    if (resp.canceled) return null
    return resp.filePath
}

export async function promptFile(filters) {
    const resp = await dialog.showOpenDialog({ filters })
    if (resp.canceled) return null

    return resp.filePaths[0]
}

export function loadCSSFile(url){
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

window.calcTextSize = calcTextSize;
export function calcTextSize(text, style, options){
    const { maxWidth } = options || {};
    const el = prepareTextCalcElement();
    let styleString = styleObjectToString(style);
    styleString += 'width:fit-content;height:auto;visibility:hidden;line-height: normal;white-space: pre-wrap;';
    if(maxWidth) styleString += `max-width:${maxWidth}px`;
    el.setAttribute('style', styleString);
    // Append 'space' char if the text ends with a line-break, otherwise it will be ignored
    if(text.charAt(text.length - 1) == '\n'){
        text = text + ' ';
    }
    el.innerText = text;
    const { width, height } = el.getClientRects()[0];
    return { width, height };
}

let textSizeCalcElement = null;
function prepareTextCalcElement(){
    if(textSizeCalcElement) return textSizeCalcElement;
    const id = 'helper_text_calc_el';
    let el = document.createElement('div');
    el.id = id;
    document.body.appendChild(el);
    textSizeCalcElement = el;
    return el;
}

function styleObjectToString(style){
    let result = '';
    for(let prop in style){
        result += `${prop}:${style[prop]};`;
    }
    return result;
}