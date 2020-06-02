<template>
    <div class="root">
        <div @click="scrollContent(-223)" v-ripple class="left button elevation-4">
            <v-icon>mdi-skip-previous</v-icon>
        </div>
        <div ref="contentParent" class="contentParent">
            <div class="contentWrapper">
                <SlideItem ref="items" v-for="(item, index) in items" :key="index"
                    :item="item" :type="type" :readonly="index == 0"
                    :name="'Slide ' + (index + 1)" @checkedChanged="itemCheckedChanged(index, item)" />
            </div>
        </div>
        <div @click="scrollContent(223)" v-ripple class="right button elevation-4">
            <v-icon>mdi-skip-next</v-icon>
        </div>
    </div>
</template>

<script>
import SlideItem from './SlideItem';
export default {
    components: {
        SlideItem
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        value: Object,
    },
    watch: {
        value(){
            this.pvalue = this.value;
        }
    },
    data:() => ({
        pvalue: null,
    }),
    methods: {
        scrollContent(by){
            const el = this.$refs.contentParent;
            el.scrollLeft += by;
        },
        itemCheckedChanged(index, item){
            const checked = item.checked;
            if(checked) this.adjustScroll(index);
            this.$emit('itemCheckedChanged', index, item);
        },
        adjustScroll(index){
            const parent = this.$refs.contentParent;
            const el = this.$refs.items[index].$el;
            const left = el.offsetLeft + (223 * 2) - parent.scrollLeft;
            const dist = left - parent.clientWidth;
            if(dist > 0){
                parent.scrollLeft += dist;
            }
        }
    },
    mounted(){
        this.pvalue = this.value;
    }
}
</script>

<style lang="scss" scoped>
.root{
    width: 100%;
    height: 140px;
    overflow: hidden;
}
.contentParent{
    display: inline-block;
    width: calc(100% - 100px);
    height: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    padding: 5px;
    box-sizing: border-box;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
        display: none;
    }
    .contentWrapper{
        height: 100%;
        width: fit-content;
        display: inline-flex;
    }
}
.button{
    position: relative;
    display: table;
    height: 100%;
    width: 50px;
    cursor: pointer;
    &.left{
        float: left;
    }
    &.right{
        float: right;
    }
    i{
        display: table-cell;
        text-align: center;
        font-size: 36px;
    }
}
</style>
