<template>
    <v-card class="editor-root" elevation="0">
        <div class="leftSide">
            <v-card elevation="1" class="pa-2" v-if="type == 'classic'">
                <EditHeader :slide="currentSlide"
                    @addTextClick="addTextClick" @addImageClick="addImageClick"
                    :classicEditor="$refs.classicEditor" :type="type"/>
            </v-card>
            <v-card class="slideEditCard" :class="type">
                <div class="slideEditorWrapper">
                    <ClassicSlideEditor v-if="type == 'classic'" ref="classicEditor" :data="currentSlide" />
                    <KineticSlide v-else-if="type == 'kinetic'" :data="currentSlide" enableEditing/>
                </div>
            </v-card>
        </div>
        <div class="rightSide">
            <v-card style="height: 100%">
                <SlidesList :items="slides" v-model="currentSlide" :template="template" :type="type" />
            </v-card>
        </div>
    </v-card>
</template>

<script>
import Editor from '../../editor';
import EditHeader from './EditHeader';
import SlidesList from './SlidesList';
import KineticSlide from './KineticSlide';
import ClassicSlideEditor from './ClassicSlideEditor';
import EditControls from './EditControls';
export default {
    components: {
        EditHeader,
        SlidesList,
        KineticSlide,
        ClassicSlideEditor,
        EditControls
    },
    props: {
        type: {
            type: String,
            default: 'classic'
        },
        template: {
            type: Object,
            required: true
        },
        slides: {
            type: Array,
            required: true,
        }
    },
    data: () => ({
        currentSlide: { content: [] },
    }),
    methods: {
        addTextClick(){
            const newItem = this.template.createItem();
            this.currentSlide.content.push(newItem)
            this.$refs.classicEditor.setCurrentItem(newItem)
            this.$refs.classicEditor.updateCurrentItemSize()
        },
        async addImageClick(){
            const image = await Editor.promptImage();
            if(image == null) return;
            const { filename, size } = image;
            const rect = Editor.fitBoxInCanvas({
                width: 800,
                height: 450
            }, size, 800 / 1280);
            const newItem = {
                rect,
                content: {
                    type: 'image',
                    src: `file:///${filename}`
                }
            };
            this.currentSlide.content.push(newItem)
            this.$refs.classicEditor.setCurrentItem(newItem)
        },
        update(){
            this.currentSlide = this.slides[0];
        }
    },

    mounted(){
        this.update();
    }
}
</script>

<style lang="scss" scoped>
.editor-root{
    padding: 5px 0 5px 5px;
    height: 100%;
    background-color: transparent !important;
}
$rightWidth: 250px;
.leftSide, .rightSide{
    display: inline-block;
    float: left;
    height: 100%;
    background-color: transparent;
}
.leftSide{
    width: calc(100% - #{$rightWidth} - 15px);
    margin-right: 10px;
}
.rightSide{
    width: $rightWidth;
}
.slideEditCard{
    overflow: hidden;
    &.classic{
        margin-top: 10px;
        height: calc(100% - 66px);
    }
    &.kinetic{
        height: 100%;
    }
}
.slideEditorWrapper{
    position: relative;
    width: 800px;
    height: 450px;
    margin: auto;
    top: calc((100% - 450px) / 2);
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>