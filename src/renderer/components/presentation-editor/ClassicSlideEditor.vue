<template>
    <div class="classic-editor">
        <PaneEditor ref="editor" :item="currentItem" />
        <div class="items-container" @click="itemsContainerClick">
            <div v-for="(item, index) in items" :key="index" class="item"
            :style="rectToStyle(item.rect)" @click="setCurrentItem(item)"></div>
        </div>
    </div>
</template>

<script>
import PaneEditor from '../libs/PaneEditor';
export default {
    components: {
        PaneEditor
    },
    props: {
        items: {
            type: Array,
            required: true,
        }
    },
    data:() => ({
        currentItem: null,
    }),
    methods: {
        setCurrentItem(item){
            this.currentItem = item;
        },
        rectToStyle(rect){
            const { x, y, width, height } = rect;
            return ` top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px`;
        },
        itemsContainerClick(e){
            if(e.target.classList.contains('items-container')){
                this.setCurrentItem(null);
            }
        }
    },
    mounted(){
        console.log(this.$refs.editor)
    }
}
</script>

<style scoped>
.classic-editor{
    width: 100%;
    height: 100%;
    border: 1px solid #888;
}
.items-container{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.item{
    position: absolute;
    background-color: seagreen;
    box-shadow: 0 0 5px #888;
}
</style>