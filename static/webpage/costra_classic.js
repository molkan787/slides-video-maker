class CostraClassic extends CostraFactory{

    constructor(element){
        super(element);
        this.namesapce = 'classic';
    }

    createSlide(data, outAnimation){
        const el_id = this.createElement(data);
        return this.createAnimation(el_id, data, outAnimation);
    }

    createElement(data){
        const slideDiv = document.createElement('div');
        const contentSection = document.createElement('section');
        slideDiv.className = 'slide';
        slideDiv.appendChild(contentSection);
        const id = this.genId();
        slideDiv.id = id;
        contentSection.innerHTML = data.content;
        this.element.appendChild(slideDiv);
        return id;
    }

    createAnimation(elId, slide, out){
        const { animation } = slide;
        return anime({
            autoplay: false,
            targets: '#' + elId,
            duration: ANIMATION_DURATION,
            ...this.getAnimationValues(animation || 'fade', out)
        });
    }

    getAnimationValues(name, out){
        if(typeof CostraAnimations[name] == 'function'){
            return CostraAnimations[name](out);
        }else{
            throw new Error(`Animation "${name}" not found.`);
        }
    }

}