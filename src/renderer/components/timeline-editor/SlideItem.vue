<template>
    <div class="root" @click="rootClick">
        <div class="slideWrapper">
            <ClassicSlide v-if="type == 'classic'" :data="item" :zoom="0.21"/>
            <KineticSlide v-if="type == 'kinetic'" :data="item" :zoom="0.21"/>
        </div>
        <div class="control">
            <label>{{ name }}</label>
            <v-checkbox v-model="item.checked" :readonly="readonly" @change="checkedChanged"
                color="primary" style="float: right;margin-top: -2px;margin-right: -11px;" label=""/>
            <span v-show="item.checked" class="primary color">{{ item.starttime | time }}</span>
        </div>
    </div>
</template>

<script>
import ClassicSlide from '../presentation-editor/ClassicSlide';
import KineticSlide from '../presentation-editor/KineticSlide';
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
        name: String,
        item: {
            type: Object,
            required: true,
        },
        active: Boolean,
        readonly: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        rootClick(e){
            if(this.readonly) return;
            if(e.target.classList.contains('root') && !this.item.checked){
                this.$set(this.item, 'checked', true);
            this.$emit('checkedChanged', true);
            }
        },
        checkedChanged(checked){
            this.$emit('checkedChanged', checked);
        }
    }
}
</script>

<style lang="scss" scoped>
div.root{
    display: inline-block;
    box-sizing: border-box;
    width: 178px;
    height: 130px;
    padding: 5px;
    margin-bottom: -1px;
    overflow: hidden;
    border: 1px solid rgb(214, 214, 214);
    cursor: pointer;
    transition: background-color 0.5s, opacity 0.5s, border-color 0.5s;
    // &:hover{
    //     background-color: rgb(208, 224, 255);
    //     opacity: 1;
    // }
}
.active{
    border-color: rgb(192, 192, 192);
    background-color: rgb(231, 239, 255);
}
.slideWrapper{
    width: 100%;
    height: 94.5px;
    pointer-events: none;
}
.control{
    span{
        font-weight: bold;
        font-size: 12px;
        color: white;
        padding: 0 3px;
        border-radius: 2px;
        float: right;
        margin-top: 5px;
    }
    label{
        font-weight: bold;
        font-size: 14px;
        color: #545454;
        line-height: 1.9;
    }
}
</style>