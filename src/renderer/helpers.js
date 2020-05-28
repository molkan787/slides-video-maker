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