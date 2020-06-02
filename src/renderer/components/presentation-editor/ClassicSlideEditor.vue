<template>
    <div class="classic-editor">
        <PaneEditor ref="editor" :item="currentItem"
            @dblclick="itemDoubleClicked(currentItem, $event)" />
        <ClassicSlide ref="classicSLide" :data="data"
            @itemsContainerClick="itemsContainerClick"
            @itemClick="setCurrentItem"
            @itemDoubleClick="itemDoubleClicked"
            @itemTextChange="updateCurrentItemSize" />
    </div>
</template>

<script>
import PaneEditor from '../libs/PaneEditor';
import ClassicSlide from './ClassicSlide';
export default {
    components: {
        PaneEditor,
        ClassicSlide
    },
    props: {
        value: null,
        data: {
            type: Object,
            required: true
        }
    },
    watch: {
        data: {
            deep: false,
            handler(){
                this.setCurrentItem(null);
            }
        },
        currentItem(item, old_item){
            this.previousItem = old_item;
        }
    },
    computed: {
        keepRatio(){
            const it = this.currentItem;
            return (it && it.content && it.content.type) == 'image';
        }
    },
    data:() => ({
        currentItem: null,
        previousItem: null,
    }),
    methods: {
        updateCurrentItemSize(){
            const { text, style } = this.currentItem.content;
            const { width, height } = calcTextSize(text || ' ', style);
            this.currentItem.rect.width = width;
            this.currentItem.rect.height = height;
            this.forceItemUpdate();
        },
        forceItemUpdate(){
            const currentItem = this.currentItem;
            this.currentItem = null;
            this.$nextTick().then(() => this.currentItem = currentItem);
        },

        setCurrentItem(item){
            this.currentItem = item;
            this.$emit('input', item);
        },
        rectToStyle(rect){
            const { x, y, width, height } = rect;
            return ` top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px`;
        },
        itemsContainerClick(e){
            if(e.target.classList.contains('items-container')){
                this.setCurrentItem(null);
            }
        },
        itemDoubleClicked(item){
            if(item.content.type !== 'text') return;
            this.$refs.editor.disableMoveable();
            const index = this.data.content.indexOf(item);
            const slide = this.$refs.classicSLide;
            const el = slide.$refs.items[index].children[0];
            this.$set(item, 'editing', true);
            setTimeout(() => {
                el.focus();
                el.click();
            }, 100)
        },
        deleteCurrentItem(){
            const items = this.data.content
            const index = items.indexOf(this.currentItem);
            items.splice(index, 1);
            this.setCurrentItem(null);
        }
    }
}
</script>

<style lang="scss" scoped>
.classic-editor{
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
</style>