import electron from 'electron';
const dialog = electron.remote.require('electron').dialog;

export async function promptSaveFile(filters) {
    const resp = await dialog.showSaveDialog({ filters })
    if (resp.canceled) return null
    return resp.filePath
}