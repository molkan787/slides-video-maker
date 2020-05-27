<template>
    <div class="classic-editor">
        <PaneEditor ref="editor" :item="currentItem" @dblclick="itemDoubleClicked(currentItem, $event)" />
        <div class="items-container" @click="itemsContainerClick">
            <div v-for="(item, index) in items" :key="index" class="item" ref="items"
                :style="rectToStyle(item.rect)" @click="setCurrentItem(item)"
                @dblclick="itemDoubleClicked(item, $event)"
                >
                <template v-if="item.content.type == 'text'">
                    <textarea :style="item.content.style" v-model="item.content.text"
                    @blur="item.editing = false"
                    :disabled="!item.editing" autofocus
                    ></textarea>
                    <!-- <span :style="item.content.style">{{ item.content.text }}</span> -->
                </template>
                <template v-else-if="item.content.type == 'image'">
                    <img :src="item.content.src"/>
                </template>
            </div>
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
        },
        itemDoubleClicked(item, event){
            if(item.content.type !== 'text') return;
            this.$refs.editor.disableMoveable();
            const index = this.items.indexOf(item);
            const el = this.$refs.items[index].children[0];
            this.$set(item, 'editing', true);
            setTimeout(() => {
                el.focus();
                el.click();
            }, 100)
        }
    },
    mounted(){
        console.log(this)
    }
}
</script>

<style lang="scss" scoped>
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
    overflow: hidden;
    
    &[contenteditable=true]{
        cursor: text;
    }

    img{
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    textarea{
        display: block;
        width: 100%;
        height: 100%;
        resize: none;
        outline: none;
        overflow: hidden;
    }
}
</style>