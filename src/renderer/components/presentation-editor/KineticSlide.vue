<template>
    <div class="kinetic-slide-editor costra" :style="{zoom}">
        <div class="slide kinetic" :class="data.template" :editable="enableEditing">
            <div class="background"></div>
            <section class="content">
                <div class="block1">
                    <h5 :key="'k1' + kcKey" @focus="activated" @blur="flushChanges($event, 0)" :contenteditable="enableEditing" class="kc kc-0">{{ data.content[0] }}</h5>
                    <h1 :key="'k2' + kcKey" @focus="activated" @blur="flushChanges($event, 1)" :contenteditable="enableEditing" class="kc kc-1">{{ data.content[1] }}</h1>
                    <h5 :key="'k3' + kcKey" @focus="activated" @blur="flushChanges($event, 2)" :contenteditable="enableEditing" class="kc kc-2">{{ data.content[2] }}</h5>
                    <div class="kc kc-3"></div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        enableEditing: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            required: true,
        },
        zoom: {
            type: Number,
            default: 1
        }
    },
    data:() => ({
        kcKey: 0
    }),
    watch: {
        data(){
            this.kcKey++;
        }
    },
    methods: {
        flushChanges(event, index){
            this.$set(this.data.content, index, event.target.textContent);
        },
        activated(event){
            event.target.innerText = event.target.innerText.trim();
        }
    }
}
</script>

<style lang="scss" scoped>
.kinetic-slide-editor{
    width: 100%;
    height: 100%;
}
.content{
    zoom: 0.625;
}
.slide.kinetic{
    &.heavy-1{
        background-color: #FFAD00;
        .block1{
            width: 93%;
        }
        .kc{
            opacity: 1 !important;
            margin: 0 !important;
            text-align: center;
            width: 100%;
            line-height: 1;
        }
    }
    &.stretchy-1, &.stretchy-2{
        padding-top: 50px;
    }
    &.stretchy-1{
        background-color: #333;
    }
    &.stretchy-2{
        background-color: #111;
    }
    &.panes-1, &.panes-2, &.panes-3{
        background-color: white;
        .kc-0, .kc-2{
            margin: 0 !important;
        }
    }
}
</style>

<style>
.costra .slide{
    position: unset !important;
}
.costra .slide[editable=true] .kc{
    cursor: text;
}
.single-line{
    white-space: nowrap;
}
</style>