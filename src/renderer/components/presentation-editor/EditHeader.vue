<template>
    <div>
        <v-select :items="animations" v-model="slide.animation" value="fade" class="myinput medium"
            label="Slide Transition" outlined dense hide-details background-color="white" menu-props="auto"
            :disabled="type !== 'classic'" :style="{ opacity: type == 'classic' ? 1 : 0 }"/>
        <template v-if="type == 'classic'">

            <v-btn :disabled="!classicEditor.currentItem" @click="deleteItemClick" class="mybtn ml-2 white--text" fab small color="primary" elevation="0" title="Delete selected item">
                <v-icon dark>mdi-delete</v-icon>
            </v-btn>
            <v-btn @click="$emit('addTextClick')" class="mybtn ml-2" fab dark small color="primary" elevation="0" title="Add text">
                <v-icon dark>mdi-text</v-icon>
            </v-btn>
            <v-btn @click="$emit('addImageClick')" class="mybtn ml-2" fab dark small color="primary" elevation="0" title="Add image">
                <v-icon dark>mdi-image</v-icon>
            </v-btn>

            <div v-if="isTextItem" class="vertical-bar-divider mybtn ml-2"></div>
            
            <TextStylerControl v-if="isTextItem" @sizeChangingStyleChange="updateItemSize" :data="itemStyle" class="TextStylerControl" />
            
            <template v-if="isTextItem">
                <v-autocomplete @input="updateItemSize" :items="app.fontsList" v-model="itemStyle['font-family']" class="myinput m2 medium" placeholder="Font Name"
                 outlined filled dense hide-details background-color="grey lighten-5" no-data-text="Font not found" menu-props="auto"/>

                <v-select @input="updateItemSize" :items="fontSizes" v-model="itemStyle['font-size']" class="myinput m2 small"
                 outlined filled dense hide-details background-color="grey lighten-5" placeholder="42" menu-props="auto" />
            </template>
            
        </template>

    </div>
</template>

<script>
import { mapState } from 'vuex';
import TextStylerControl from '../libs/TextStylerControl';
export default {
    components: {
        TextStylerControl
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        slide: {
            type: Object,
            required: true,
        },
        canDelete: {
            type: Boolean,
            default: false,
        },
        classicEditor: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        ...mapState(['app']),
        item(){
            return this.classicEditor && this.classicEditor.currentItem;
        },
        isTextItem(){
            return this.item && this.item.content.type == 'text';
        },
        itemStyle(){
            return (this.item && this.item.content.style) || {};
        }
    },
    data:() => ({
        animations: [
            { value: 'fade', text: 'Fade'},
            { value: 'zoom', text: 'Zoom'},
            { value: 'slide', text: 'Slide'},
        ],
        fontSizes: []
    }),
    methods: {
        updateItemSize(){
            this.classicEditor.updateCurrentItemSize();
        },
        deleteItemClick(){
            this.classicEditor.deleteCurrentItem();
        }
    },
    created(){
        const sizes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 32, 36, 42, 48, 52, 58, 64, 70, 74, 80, 86, 90, 100, 110, 120, 130, 140, 150, 175, 200, 250, 300];
        this.fontSizes = sizes.map(s => ({
            value: (s / 1.6) + 'px',
            text: s
        }))
    }
}
</script>

<style lang="scss" scoped>
.leftTitle{
    font-size: 20px;
    margin-right: 10px;
}
.myinput{
    width: 180px;
    display: inline-block;
    &.medium{
        width: 130px;
    }
    &.small{
        width: 100px;
    }
    &.m2{
        display: flex;
        float: right;
        margin-right: 4px;
    }
}
.mybtn{
    float: right;
}
.TextStylerControl{
    float: right;
}
.vertical-bar-divider{
    display: inline-block;
    box-sizing: border-box;
    width: 2px;
    height: 28px;
    padding: 10px 0px;
    background-color: #ddd;
    transform: translateY(6px);
}
</style>