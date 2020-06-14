<template>
    <div class="root-element" @click="$emit('click')" :class="{active}" v-ripple>
        <div class="content-wrapper">
            <slot></slot>
        </div>
        <div class="name">
            {{ name || 'Template' }}
        </div>
        <ColorButton v-model="colors[0]" v-if="colorSlotsCount > 0" />
        <ColorButton v-model="colors[1]"  v-if="colorSlotsCount == 2"  class="lower" />
    </div>
</template>

<script>
import ColorButton from '../helpers/ColorButton';
export default {
    components: {
        ColorButton
    },
    props: {
        name: String,
        active: Boolean,
        colorSlotsCount: {
            type: Number,
            default: 0,
        },
        colors: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="scss" scoped>
.root-element{
    float: left;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: 200px;
    height: 150px;
    padding: 5px;
    border-radius: 3px;
    background-color: rgb(240, 240, 240);
    transition: background-color 0.5s;
    margin: 0 10px 10px 0;
    &.active{
        background-color: #636363;
        .name{
            color: white;
        }
    }
}
.content-wrapper{
    width: 100%;
    height: 112px;
    border-radius: 4px;
    overflow: hidden;
}
.name{
    width: 100%;
    padding-top: 4px;
    font-size: 18px;
    color: rgb(48, 48, 48);
    text-align: center;
}
.color-button{
    position: absolute;
    left: 10px;
    top: 10px;
    &.lower{
        top: 87px;
    }
}
</style>