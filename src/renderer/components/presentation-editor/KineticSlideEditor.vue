<template>
    <div class="kinetic-slide-editor costra ">
        <div class="slide kinetic" :class="data.template">
            <div class="background"></div>
            <section class="content">
                <div class="block1">
                    <h5 @input="onInput($event, 0)" @blur="flushBuffer(0)" contenteditable class="kc kc-0">{{ data.content[0] }}</h5>
                    <h1 @input="onInput($event, 1)" @blur="flushBuffer(1)" contenteditable class="kc kc-1">{{ data.content[1] }}</h1>
                    <h5 @input="onInput($event, 2)" @blur="flushBuffer(2)" contenteditable class="kc kc-2">{{ data.content[2] }}</h5>
                    <div class="kc kc-3"></div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    data:() => ({
        data: {
            template: 'template-1',
            content: [
                'Thats the second slide',
                'It is so beatiful, right?',
                'Just another smaller text!'
            ]
        },
        buffer: []
    }),
    methods: {
        onInput(event, index){
            this.buffer[index] = event.target.innerText;
        },
        flushBuffer(index){
            const data = this.buffer[index];
            if(typeof data != 'undefined'){
                this.data.content[index] = data;
                delete this.buffer[index];
            }
        }
    },
    mounted(){
        console.log(this.data.content)
        console.log(this.buffer)
    }
}
</script>

<style scoped>
.kinetic-slide-editor{
    width: 100%;
    height: 100%;
    border: 1px solid #888;
}
.content{
    zoom: 0.7;
}
</style>

<style>
.costra .slide{
    position: unset !important;
}
.costra .slide .kc{
    cursor: text;
}
.single-line{
    white-space: nowrap;
}
</style>