export function horizontalDrag(el, min, max){
    const controller = {
        el,
        min: typeof min == 'number' ? min : -Infinity,
        max: typeof max == 'number' ? max : Infinity,
        moving: false,
        left: 0,
        clientX: 0,
        onchange: null,
        eventsHandlers: null,
        init(){
            this.eventsHandlers = {
                'mousemove': e => this.mousemove(e),
                'mouseup': e => this.stopmoveing(),
                'mouseleave': e => this.stopmoveing(),
            }
        },
        attachEventsHandlers(){
            for(let event in this.eventsHandlers){
                window.addEventListener(event, this.eventsHandlers[event]);
            }
        },
        detachEventsHandlers(){
            for(let event in this.eventsHandlers){
                window.removeEventListener(event, this.eventsHandlers[event]);
            }
        },
        start(left){
            this.moving = true;
            this.clientX = event.clientX;
            this.left = left;
            this.attachEventsHandlers();
        },
        mousedown(e){
            this.moving = true;
            this.clientX = e.clientX;
            this.left = parseFloat(this.el.style.left || 0);
            this.attachEventsHandlers();
        },
        mousemove(e){
            if(this.moving){
                const delta = e.clientX - this.clientX;
                const newLeft = this.constain(this.left + delta);
                if(typeof this.onchange == 'function'){
                    this.onchange(newLeft);
                }
            }
        },
        stopmoveing(){
            if(this.moving){
                this.moving = false;
                this.detachEventsHandlers();
            }
        },
        constain(value){
            if(value < this.min) return this.min
            else if(value > this.max) return this.max
            else return value;
        }
    }
    el.addEventListener('mousedown', e => controller.mousedown(e));
    controller.init();
    return controller;
}