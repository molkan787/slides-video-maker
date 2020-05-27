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
        slideDiv.className = `slide ${this.namesapce}`;
        const id = this.genId();
        slideDiv.id = id;
        slideDiv.innerHTML = this.generateContentHTML(slideDiv, data);
        this.element.appendChild(slideDiv);
        return id;
    }

    generateContentHTML(slideElement, data){
        const { content, customContent } = data;
        if(customContent){
            slideElement.classList.add('block');
            return content;
        }else{
            return `<section>${content}</section>`;
        }
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