const { ipcRenderer } = require('electron');
let costra;

const REQUEST_CHANNEL = 'set-slides';
const REPLY_CHANNEL = 'set-slides-reply';

ipcRenderer.on(REQUEST_CHANNEL, async (event, slide1, slide2) => {
    try {
        const resp = await costra.setSlides(slide1, slide2);
        event.sender.send(REPLY_CHANNEL, null, resp);
    } catch (error) {
        event.sender.send(REPLY_CHANNEL, error.toString());
    }
});

function setup(type, optionsJSON){
    const options = JSON.parse(optionsJSON);
    const element = document.getElementById('costra');
    costra = new Costra(type, element, options);
}

// function setSlides(slide1, slide2){
//     return costra.setSlides(
//         slide1 ? JSON.parse(slide1) : null,
//         JSON.parse(slide2)
//     );
// }

function seek(stage){
    costra.seek(stage);
}

async function test(){
    for(let i = 0; i <= 100; i++){
        costra.seek(i / 100);
        await sleep(20);
    }
}

function sleep(time){
    return new Promise(r => setTimeout(r, time));
}