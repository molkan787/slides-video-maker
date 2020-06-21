class KineticStretchy{
    
    static get ELASTIC_EASING(){
        return 'easeOutElastic(1, 0.2)';
    }

    static get readyForNextOffset(){
        return ANIMATION_DURATION;
    }

    static getBgColors(slide){
        return slide.template == 'stretchy-1' ? ['#333333', '#111111'] : ['#111111', '#333333'];
    }
    
    static generateContentHTML(slide){
        const { content } = slide;
        return `
        <div class="block1">
            <h5 class="kc kc-0">${content[0] || ''}</h5>
            <h1 class="kc kc-1">${content[1] || ''}</h1>
            <h1 class="kc kc-2">${content[2] || ''}</h1>
        </div>
        `;
    }

    static createAnimation(elId, slide, outAnimation, delay){
        const bgColors = this.getBgColors(slide);
        document.getElementById(elId).classList.add(outAnimation ? 'out' : 'in');
        const sel = (componentIndex, fromRoot) => {
            return fromRoot ?
                `#${elId} ${componentIndex}` :
                `#${elId} .kc.kc-${componentIndex}`;
        };
        const t = amt => ANIMATION_DURATION * amt;
        return outAnimation ?
            this.createOutAnimation(sel, t, delay || 0) :
            this.createInAnimation(sel, t, delay || 0, bgColors);
    }

    static createInAnimation(sel, t, delay, bgColor){
        document.body.style.backgroundColor = bgColor[0];
        return anime.timeline({
            autoplay: false,
            delay: 0,
        })
        .add({
            duration: t(1),
            targets: sel('.block1', true),
            scaleY: [0, 1],
            opacity: [0, 1],
            easing: 'easeInOutExpo'
        })
        .add({
            duration: t(1),
            targets: 'body',
            backgroundColor: bgColor,
            easing: 'linear'
        }, 0)
    }

    static createOutAnimation(sel, t, delay){
        return anime.timeline({
            autoplay: false,
            delay: 0,
        })
        .add({
            duration: t(1),
            targets: sel('.block1', true),
            scaleY: [1, 0],
            opacity: [1, 0],
            easing: 'easeInOutExpo'
        })
    }

}

