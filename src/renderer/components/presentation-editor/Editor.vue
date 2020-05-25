<template>
    <v-card class="editor-root" elevation="0">
        <div class="leftSide">
            <v-card elevation="1" class="pa-2">
                <EditHeader :item="currentSlide" :canDelete="slides.length > 1"
                    @deleteClick="deleteCurrentSlide"/>
            </v-card>
            <v-card class="slideEditCard pa-2">
                <SlideEdit :item="currentSlide" />
            </v-card>
        </div>
        <div class="rightSide">
            <v-card style="height: 100%">
                <SlidesList :items="slides" v-model="currentSlide" />
            </v-card>
        </div>
    </v-card>
</template>

<script>
import EditHeader from './EditHeader';
import SlidesList from './SlidesList';
import SlideEdit from './SlideEdit';
export default {
    components: {
        EditHeader,
        SlidesList,
        SlideEdit
    },
    props: {
        slides: {
            type: Array,
            required: true,
        }
    },
    data: () => ({
        currentSlide: {},
    }),
    methods: {
        deleteCurrentSlide(){
            const index = this.slides.indexOf(this.currentSlide);
            if(index >= 0){
                this.slides.splice(index, 1);
                this.selectNearestItem(index);
            }
        },
        selectNearestItem(currentIndex){
            const newIndex = currentIndex == 0 ? 0 : currentIndex - 1;
            this.currentSlide = this.slides[newIndex];
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
    margin-top: 10px;
    height: calc(100% - 66px);
}
</style>