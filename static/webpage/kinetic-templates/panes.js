class KineticPanes{
    
    static get ELASTIC_EASING(){
        return 'easeOutElastic(1, 0.2)';
    }

    static get readyForNextOffset(){
        return ANIMATION_DURATION;
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
            delay: t(0.3),
        })
        .add({
            duration: t(1),
            targets: sel(1),
            height: [0, '96px'],
            opacity: [0, 20],
            easing: 'easeInOutExpo'
        })
        .add({
            duration: t(1),
            targets: sel(0),
            translateY: ['80px', 0],
            opacity: [0, 1],
            // easing: 'easeInOutExpo'
        }, t(1.1))
        .add({
            duration: t(1),
            targets: sel(2),
            translateY: ['-80px', 0],
            opacity: [0, 1],
            // easing: 'easeInOutExpo'
        }, t(1.1))
    }

    static createOutAnimation(sel, t, delay){
        return anime.timeline({
            autoplay: false,
            delay: 0,
        })
        .add({
            duration: t(1),
            targets: sel(1),
            height: ['96px', 0],
            opacity: [1, 0],
            easing: 'easeInOutExpo'
        })
        .add({
            duration: t(1),
            targets: sel(0),
            translateY: [0, '80px'],
            opacity: [1, -1],
            easing: 'easeInOutExpo'
        }, 0)
        .add({
            duration: t(1),
            targets: sel(2),
            translateY: [0, '-80px'],
            opacity: [1, -1],
            easing: 'easeInOutExpo'
        }, 0)
        .add({
            duration: t(1.4),
            targets: sel(3),
            easing: 'linear',
        })
    }

}

