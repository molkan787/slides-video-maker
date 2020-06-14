class KineticHeavy1{
    
    static get ELASTIC_EASING(){
        return 'easeOutElastic(1, 0.2)';
    }

    static get readyForNextOffset(){
        return ANIMATION_DURATION;
    }
    
    static generateContentHTML(slide){
        const { content } = slide;
        document.body.classList.add('kinetic_heavy_body_style');
        return `
        <div class="block1">
            <h5 class="kc kc-0">${content[0]}</h5>
            <h1 class="kc kc-1">${content[1]}</h1>
        </div>
        `;
    }

    static createAnimation(elId, slide, outAnimation, delay){
        const sel = (componentIndex, fromRoot) => {
            return fromRoot ?
                `#${elId} ${componentIndex}` :
                `#${elId} .kc.kc-${componentIndex}`;
        };
        const t = amt => ANIMATION_DURATION * amt;
        return outAnimation ?
            this.createOutAnimation(sel, t, delay || 0) :
            this.createInAnimation(sel, t, delay || 0);
    }

    static createInAnimation(sel, t, delay){
        return anime.timeline({
            autoplay: false,
            delay: 0,
        })
        .add({
            duration: t(0.2),
            targets: sel(1),
            scale: [0.7, 1],
            opacity: [0, 1],
            easing: 'linear'
        })
        .add({
            duration: t(1),
            targets: sel(1),
            marginTop: ['-200px', 0],
            easing: this.ELASTIC_EASING
        }, t(0.4))
        .add({
            duration: t(1),
            targets: sel(0),
            marginTop: ['-200px', 0],
            opacity: [0, 1],
            easing: this.ELASTIC_EASING
        }, t(1))
    }

    static createOutAnimation(sel, t, delay){
        return anime.timeline({
            autoplay: false,
            delay: 250,
        })
        .add({
            duration: t(0.5),
            targets: sel(0),
            opacity: [1, 0],
            marginTop: [0, '100px'],
            scaleY: [1, 0.5],
            // easing: 'easeOutExpo'
        })
        .add({
            duration: t(0.5),
            targets: sel(1),
            opacity: [1, 0],
            marginTop: [0, '100px'],
            scaleY: [1, 0.5],
            // easing: 'easeOutExpo'
        }, t(0.3))
    }

}

