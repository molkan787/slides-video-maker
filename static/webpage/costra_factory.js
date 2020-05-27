class CostraFactory{

    constructor(element, options){
        this.namesapce = '';
        this.element = element;
        this.idPointer = 1;
        const { scale } = options;
        this.scale = scale || 1;
    }

    genId(){
        return `costra-${this.namesapce}-${this.idPointer++}`;
    }

}