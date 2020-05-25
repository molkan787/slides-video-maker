class CostraFactory{

    constructor(element){
        this.namesapce = '';
        this.element = element;
        this.idPointer = 1;
    }

    genId(){
        return `costra-${this.namesapce}-${this.idPointer++}`;
    }

}