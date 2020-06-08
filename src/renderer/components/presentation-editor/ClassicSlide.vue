<template>
    <div class="items-container" :style="rootStyle" @click="itemsContainerClick">
        <div v-for="(item, index) in data.content" :key="index" class="item" ref="items"
            :style="rectToStyle(item.rect)" @click="itemClick(item)"
            @dblclick="itemDoubleClick(item)"
            >
            <template v-if="item.content.type == 'text'">
                <textarea @input="$emit('itemTextChange')" :style="item.content.style" v-model="item.content.text"
                @blur="item.editing = false"
                onblur="let val = this.value; this.value = ''; this.value = val;"
                :disabled="!item.editing" autofocus
                ></textarea>
            </template>
            <template v-else-if="item.content.type == 'image'">
                <img :src="item.content.src"/>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: null,
        data: {
            type: Object,
            required: true
        },
        zoom: {
            type: Number,
            default: 1
        }
    },
    computed: {
        rootStyle(){
            const { background } = this.data;
            const zoomStyle = `zoom:${this.zoom};`;
            if(background){
                const { type, color, src, css } = background;
                if(type == 'color'){
                    return `${zoomStyle}background-color:${color};`;
                }else if(type == 'image'){
                    return `${zoomStyle}background-image: url(${src});`;
                }else if(type == 'css'){
                    return `${zoomStyle}background:${css};`;
                }
            }
            return zoomStyle;
        }
    },
    methods: {
        itemsContainerClick(event){
            this.$emit('itemsContainerClick', event);
        },
        itemClick(item){
            this.$emit('itemClick', item);
        },
        itemDoubleClick(item){
            this.$emit('itemDoubleClick', item);
        },
        rectToStyle(rect){
            const { x, y, width, height } = rect;
            return ` top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px`;
        },
    }
}
</script>


<style lang="scss" scoped>
.items-container{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
.item{
    position: absolute;
    // overflow: hidden;
    font-size: 26.5px;
    
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
        // outline-color: #28a4d4;
        // outline-width: 4px;
        outline: none;
        overflow: hidden;
        line-height: normal;
        white-space: pre;
        &:disabled{
            user-select: none;
            pointer-events: none;
        }
    }
}
</style>