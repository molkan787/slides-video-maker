import electron from 'electron';
import path from 'path';
const dialog = electron.remote.require('electron').dialog;

export async function promptSaveFile(filters) {
    const resp = await dialog.showSaveDialog({ filters })
    if (resp.canceled) return null
    return resp.filePath
}

export function loadCSSFile(url){
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}