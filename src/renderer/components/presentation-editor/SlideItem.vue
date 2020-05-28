<template>
    <div class="root" v-ripple :class="{ active }" @click="$emit('click', item)">
        <div class="slideWrapper">
            <ClassicSlide v-if="type == 'classic'" :data="item" :zoom="0.26375"/>
            <KineticSlide v-if="type == 'kinetic'" :data="item" :zoom="0.26375"/>
        </div>
    </div>
</template>

<script>
import ClassicSlide from './ClassicSlide';
import KineticSlide from './KineticSlide';
export default {
    components: {
        ClassicSlide,
        KineticSlide
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        item: {
            type: Object,
            required: true,
        },
        active: Boolean,
    }
}
</script>

<style lang="scss" scoped>
div.root{
    box-sizing: border-box;
    width: 100%;
    height: 125.5px;
    padding: 5px;
    margin-bottom: -1px;
    overflow: hidden;
    border: 1px solid rgb(214, 214, 214);
    cursor: pointer;
    transition: background-color 0.5s, opacity 0.5s, border-color 0.5s;
    &:hover{
        background-color: rgb(208, 224, 255);
        opacity: 1;
    }
}
.active{
    border-color: rgb(192, 192, 192);
    background-color: rgb(231, 239, 255);
}
.slideWrapper{
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>