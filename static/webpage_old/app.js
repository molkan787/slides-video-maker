const slidesContainer = document.getElementById('slides')

function buildPresentation(slidesString){
    const slides = JSON.parse(slidesString);
    for(let slide of slides){
        buildSlide(slide);
    }
    initReveal();
    return true;
}

function buildSlide(data){
    const slide = document.createElement('section');
    slide.setAttribute('data-transition', data.animation || 'fade');
    slide.innerText = data.text;
    slidesContainer.appendChild(slide);
}

function slide(index){
    Reveal.slide(index);
}

function initReveal(){
    Reveal.initialize({
        controls: false,
        progress: false
    })
}