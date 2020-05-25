class CostraAnimations{

    static fade(out){
        return {
            easing: out ? 'easeOutExpo' : 'easeInExpo',
            opacity: this._opacity(out),
        }
    }

    static slide(out){
        return {
            translateX: out ? [0, '-50%'] : ['50%', 0],
            opacity: this._opacity(out),
            easing: out ? 'easeOutExpo' : 'easeInExpo'
        }
    }

    static zoom(out){
        return {
            scale: out ? [1, 12] : [12, 1],
            opacity: this._opacity(out),
            easing: out ? 'easeInOutExpo' : 'easeOutExpo'
        }
    }

    static _opacity(out){
        return  out ? [1, 0] : [0, 1];
    }

}