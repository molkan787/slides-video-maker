const ANIMATION_DURATION = 1000;
class Costra{

    constructor(type, element, options){
        this.factory = this.createFactory(type, element, options);
        this.element = element;
        this.element.classList.add('costra');
        this.animation1 = null;
        this.animation2 = null;
    }

    seek(stage){
        this.animation1.seek(stage * this.animation1.duration);
        this.animation2.seek(stage * this.animation2.duration);
    }

    async setSlides(slide1, slide2){
        const skipFirst = !slide1;
        this.element.innerHTML = '';
        this.animation2 = this.createSlide(slide2, false, skipFirst ? 700 : 1400);
        this.animation1 = skipFirst ? anime({duration: 0}) : this.createSlide(slide1, !skipFirst);
        const totalDuration = Math.max(this.animation1.duration, this.animation2.duration);
        const factor = totalDuration / ANIMATION_DURATION;
        await this.allImagesLoaded();
        return factor;
    }

    createSlide(data, outAnimation, delay){
        return this.factory.createSlide(data, outAnimation, delay);
    }

    // ==================================================

    createFactory(type, element, options){
        if(type == 'classic'){
            return new CostraClassic(element, options);
        }else if(type == 'kinetic'){
            return new CostraKinetic(element, options);
        }else{
            throw new Error(`invalid factory type "${type}"`);
        }
    }

    allImagesLoaded(){
        const imgs = document.querySelectorAll('img');
        const promises = [];
        for(let img of imgs){
            promises.push(this.imageLoad(img));
        }
        for(let img of this.factory.imageElements){
            promises.push(this.imageLoad(img));
        }
        console.log(promises);
        return Promise.all(promises);
    }

    imageLoad(img){
        return new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', reject);
        })
    }

}
