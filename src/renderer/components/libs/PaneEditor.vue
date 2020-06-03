<template>
    <div ref="rootpanel">
        <Moveable
            ref="moveable"
            class="moveable"
            v-bind="moveable"
            :keepRatio="keepRatio"
            @drag="handleDrag"
            @resize="handleResize">
            <span style="opacity: 0"></span>
        </Moveable>
    </div>
</template>

<script>
import Moveable from 'vue-moveable';
import Vue from 'vue';
export default {
    components: {
        Moveable
    },
    props: {
        item: {
            type: Object,
            default: null
        },
        keepRatio: {
            type: Boolean,
            default: false,
        }
    },
    data:() => ({
        moveable: {
            draggable: true,
            throttleDrag: 0,
            resizable: true,
            throttleResize: 1,
        },
        currentItem: {
            rect: {
                x: 50, y: 50,
                width: 100,
                height: 150
            }
        },
        lockUpdates: false
    }),
    watch: {
        item(item){
            this.setCurrentItem(item);
        }
    },
    methods: {
        setCurrentItem(item){
            if(item){
                this.showControls();
                this.setMoveableRect(item.rect);
                this.disableMoveableTemporaly();
            }else{
                this.hideControls();
            }
            this.currentItem = item;
        },
        setMoveableRect({x, y, width, height}){
            const moveable = this.$refs.moveable;
            const mel = moveable.$el;
            mel.style.transform = `matrix(1, 0, 0, 1, 0, 0) translate(${x}px, ${y}px)`;
            mel.style.width = width + 'px';
            mel.style.height = height + 'px';
            moveable.updateRect();
        },
        setMoveableSize(width, height){
            const moveable = this.$refs.moveable;
            const mel = moveable.$el;
            mel.style.width = width + 'px';
            mel.style.height = height + 'px';
            moveable.updateRect();
        },
        extractPosition(event){
            const { transform, translate } = event;
            const [ x, y ] = translate;
            const parts = transform.split(/[,)]/);
            const x2 = parseInt(parts[4]);
            const y2 = parseInt(parts[5]);
            return {
                x: x + x2,
                y: y + y2
            }
        },
        handleDrag(event) {
            if(this.lockUpdates){
                this.lockUpdates = false;
                return;
            }
            const { target, transform, translate } = event;
            target.style.transform = transform;
            const { x, y } = this.extractPosition(event);
            this.currentItem.rect.x = x;
            this.currentItem.rect.y = y;
        },
        handleResize(event) {
            const { target, width, height, delta, drag } = event;
            this.handleDrag(drag);
            delta[0] && (target.style.width = `${width}px`);
            delta[1] && (target.style.height = `${height}px`);
            this.currentItem.rect.width = width;
            this.currentItem.rect.height = height;
        },
        moveableDoubleClicked(e){
            this.$emit('dblclick', e);
        },
        disableMoveableTemporaly(){
            this.disableMoveable();
            setTimeout(() => {
                if(!this.currentItem.editing){
                    this.enableMoveable()
                }
            }, 200);
        },
        disableMoveable(){
            this.$refs.moveable.$el.style.pointerEvents = 'none';
            this.hideControlsDots();
        },
        enableMoveable(){
            this.$refs.moveable.$el.style.pointerEvents = 'unset';
            this.showControlsDots();
        },
        hideControls(){
            document.querySelector('.moveable-control-box').style.display = 'none';
            this.$refs.moveable.$el.style.display = 'none';
        },
        showControls(){
            document.querySelector('.moveable-control-box').style.display = 'block';
            this.$refs.moveable.$el.style.display = 'block';
            this.showControlsDots();
        },
        hideControlsDots(){
            const el = document.querySelector('.moveable-control-box');
            el.classList.add('hidden');
        },
        showControlsDots(){
            const el = document.querySelector('.moveable-control-box');
            el.classList.remove('hidden');
        }
    },
    mounted(){
        this.setCurrentItem(this.item);
        this.$refs.moveable.$el.addEventListener('dblclick', e => this.moveableDoubleClicked(e));
        window.addEventListener('resize', () => {
            this.$refs.moveable.updateTarget();
        })
    }
}
</script>

<style scoped>
div{
    height: 0;
}
</style>

<style lang="scss">
.moveable{
    position: relative;
    z-index: 1;
}
.rCSeieii1{
    z-index: 1 !important;
}
.moveable-control-box.hidden{
    .moveable-control{
        opacity: 0 !important;
    }
}
</style>