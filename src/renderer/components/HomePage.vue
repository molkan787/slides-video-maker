<template>
    <div class="homePage">
        <v-app-bar dense color="blue" dark elevation="1">
            <v-toolbar-title>Slides Video Maker</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="publishButton" light right @click="publish">
                <v-icon>mdi-movie</v-icon>
                Publish
            </v-btn>
        </v-app-bar>
        <div class="editorParent">
            <Editor :slides="slides" />
        </div>
    </div>
</template>

<script>
import Editor from './presentation-editor/Editor';
export default{
    components: {
        Editor
    },
    data:() => ({
        slides: [
            {
                content: 'New Slide',
                animation: 'fade',
                duration: 5000,
            },
            {
                content: 'And thats the second slide\nNow go away!',
                animation: 'fade',
                duration: 5000,
            },
            {
                content: "Well, Thats the end, Don't worry will come back! Bye for now",
                animation: 'slide',
                duration: 5000,
            }
        ]
    }),
    methods: {
        publish(){
            if(this.slides.length > 1){
                window.publishPresentation(this.slides);
            }else{
                alert('Please create at least 2 slides before publishing');
            }
        }
    },

    created(){
    }
}
</script>

<style scoped>
.homePage{
    height: 100%;
}
.editorParent{
    padding: 3px;
    height: calc(100% - 48px);
}
.publishButton{
    float: right;
}
</style>