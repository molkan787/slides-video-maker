class KineticTemplate1{

    static get readyForNextOffset(){
        return ANIMATION_DURATION;
    }
    
    static generateContentHTML(slide){
        const { content } = slide;
        return `
        <div class="block1">
            <h5 class="kc kc-0">${content[0]}</h5>
            <h1 class="kc kc-1">${content[1]}</h1>
            <h5 class="kc kc-2">${content[2]}</h5>
            <div class="kc kc-3"></div>
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
            delay,
        })
        .add({
            duration: t(1.5),
            targets: sel(0),
            rotate: ['-80deg', 0],
            translateX: ['10%', 0],
            opacity: [0, 2],
            easing: 'easeOutElastic(1, 0.2)'
        })
        .add({
            duration: t(0.3),
            targets: sel(1),
            translateY: ['200%', 0],
            opacity: [0, 1],
        }, t(1))
        .add({
            duration: t(0.3),
            targets: sel(2),
            rotate: ['45deg', 0],
            translateX: ['10%', 0],
            opacity: [0, 1],
        }, t(1.1))
        .add({
            duration: t(0.7),
            targets: sel(3),
            width: [0, '100%'],
            easing: 'easeInOutExpo'
        }, t(1.4))
    }

    static createOutAnimation(sel, t, delay){
        return anime.timeline({
            autoplay: false,
            delay
        })
        .add({
            duration: t(0.6),
            targets: [sel(2), sel(1), sel(0)].join(','),
            delay: (el, index, total) => delay + (total - index - 1) * 100,
            translateX: [0, '100vw'],
            easing: 'easeInExpo'
        }, 0)
        .add({
            duration: t(0.5),
            targets: sel(3),
            width: ['100%', 0],
            marginLeft: [0, '100%'],
            easing: 'easeInExpo'
        }, 0)
        .add({
            targets: sel('.background', true),
            rotateX: [
                {value: 100, easing: 'easeInExpo', duration: t(1)},
                {value: 110, easing: 'easeOutElastic(6, 1)', duration: t(0.8)},
            ],
            easing: 'easeInExpo'
        }, t(0.2));
    }

}

