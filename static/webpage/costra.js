const ANIMATION_DURATION = 1000;
class Costra{

    constructor(type, element){
        this.factory = this.createFactory(type, element);
        this.element = element;
        this.element.classList.add('costra');
        this.animation1 = null;
        this.animation2 = null;
    }

    seek(stage){
        // const time = stage * ANIMATION_DURATION; 
        this.animation1.seek(stage * this.animation1.duration);
        this.animation2.seek(stage * this.animation2.duration);
    }

    setSlides(slide1, slide2){
        this.element.innerHTML = '';
        this.animation2 = this.createSlide(slide2, false, 1000);
        this.animation1 = this.createSlide(slide1, true);
        const totalDuration = Math.max(this.animation1.duration, this.animation2.duration);
        const factor = totalDuration / ANIMATION_DURATION;
        return factor;
    }

    createSlide(data, outAnimation, delay){
        return this.factory.createSlide(data, outAnimation, delay);
    }

    // ==================================================

    createFactory(type, element){
        if(type == 'classic'){
            return new CostraClassic(element);
        }else if(type == 'kinetic'){
            return new CostraKinetic(element);
        }else{
            throw new Error(`invalid factory type "${type}"`);
        }
    }

}