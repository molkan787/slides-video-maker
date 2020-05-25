const element = document.getElementById('costra');
const costra = new Costra('kinetic', element);

function setSlides(slide1, slide2){
    return costra.setSlides(
        JSON.parse(slide1),
        JSON.parse(slide2)
    );
}

function seek(stage){
    costra.seek(stage);
}

async function test(){
    for(let i = 0; i <= 50; i++){
        costra.seek(i / 50);
        await sleep(20);
    }
}

function sleep(time){
    return new Promise(r => setTimeout(r, time));
}