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
            <Editor :slides="slides_classic" type="classic" :template="template" />
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
        template: {
            templates: [
                'template-1',
                'template-2'
            ],
            createNewSlide(positionIndex){
                return {
                    content: [
                        // 'Title',
                        // 'Some bigger text!',
                        // 'The end'
                    ],
                    background: {
                        type: 'color',
                        color: '#1ED760'
                    },
                    template: this.templates[positionIndex % this.templates.length],
                    animation: 'fade',
                    duration: 4000,
                }
            }
        },
        slides_classic: [
            {
                content: [
                    {
                        rect: {
                            x: 50, y: 50,
                            width: 300,
                            height: 50
                        },
                        content: {
                            type: 'text',
                            text: 'Thats and escaped',
                            style: {
                                'color': 'white',
                                'text-align': 'center',
                                'text-decoration': 'underline'
                            }
                        }
                    },
                    {
                        rect: {
                            x: 200, y: 90,
                            width: 100,
                            height: 180
                        },
                        content: {
                            type: 'image',
                            src: 'file:///D:\\\\Projects\\\\Electron\\\\slides-video-maker\\\\static\\\\images\\\\p2.png'
                        }
                    }
                ],
                background: {
                    type: 'image',
                    // color: '#5099ff'
                    src: 'file:///C:\\\\Users\\\\Dahmane\\\\Pictures\\\\magic_bg.jpg'
                },
                animation: 'zoom',
                template: 'template-2',
                duration: 4000,
            }, {
                content: [],
                background: {
                    type: 'color',
                    color: '#1ED760'
                },
                animation: 'zoom',
                duration: 4000,
            },
        ],
        slides_kinetic: [
            {
                content: [
                    'SOME TITLE',
                    'It is so beatiful, right?',
                    'JUST ANOTHER!'
                ],
                template: 'template-1',
                animation: 'slide',
                duration: 2000,
            }
        ]
    }),
    methods: {
        publish(){
            if(this.slides_classic.length > 1){
                window.publishPresentation(this.slides_classic, 'classic');
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