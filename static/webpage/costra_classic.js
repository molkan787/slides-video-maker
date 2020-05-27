class CostraClassic extends CostraFactory{

    constructor(element, options){
        super(element, options);
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
        if(data.background){
            this.setupBackground(slideDiv, data.background);
        }
        this.element.appendChild(slideDiv);
        return id;
    }

    setupBackground(slideElement, background){
        const { type, color, src } = background;
        if(type == 'color'){
            slideElement.style.backgroundColor = color;
        }else if(type == 'image'){
            slideElement.style.backgroundImage = `url(${src})`;
        }
    }

    generateContentHTML(slideElement, data){
        const { content, rawContent } = data;
        if(rawContent){
            return `<section>${content}</section>`;
        }else{
            slideElement.classList.add('block');
            const itemsHTML = [];
            for(let item of content){
                itemsHTML.push(this.renderItemHTML(item)); 
            }
            return itemsHTML.join('');
        }
    }

    renderItemHTML(item){
        const { rect, content } = item;
        const { type, text, src, style } = content;
        const styleString = this.rectToStyleString(rect) + this.styleObjectToString(style);
        const contentHTML = type == 'text' ? this.escapeText(text) : `<img src="${src}"/>`;
        return `
            <div class="item" style="${styleString}">
                ${contentHTML}
            </div>
        `;
    }

    rectToStyleString(rect){
        let { x, y, width, height } = rect;
        x = Math.round(x * this.scale);
        y = Math.round(y * this.scale);
        width = Math.round(width * this.scale);
        height = Math.round(height * this.scale);
        return `left:${x}px;top:${y}px;width:${width}px;height:${height}px;`;
    }

    styleObjectToString(style){
        if(typeof style !== 'object') return '';
        let result = '';
        for(let prop in style){
            result += `${prop}:${style[prop]};`;
        }
        return result;
    }

    escapeText(text){
        return text.replace(/&/g, "&amp;")
                   .replace(/>/g, "&gt;")
                   .replace(/</g, "&lt;")
                   .replace(/"/g, "&quot;");
    }

    // ==============================================================

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