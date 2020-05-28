class CostraFactory{

    constructor(element, options){
        this.namesapce = '';
        this.element = element;
        this.idPointer = 1;
        this.imageElements = [];

        const { scale } = options;
        this.scale = scale || 1;
    }

    genId(){
        return `costra-${this.namesapce}-${this.idPointer++}`;
    }

    loadImage(url){
        return new Promise((resolve, reject) => {
            const el = document.createElement('img');
            // this.imageElements.push(el);
            el.addEventListener('load', () => {
                resolve();
                el.remove();
            });
            el.addEventListener('error', () => {
                reject();
                el.remove();
            });
            el.src = url;
        })
    }

}