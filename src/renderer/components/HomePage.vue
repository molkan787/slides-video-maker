<template>
    <div class="homePage">
        <v-app-bar dense color="primary" dark elevation="1">
            <v-toolbar-title>Slides Video Maker</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="publishButton" @click="publish" light right elevation="0" >
                <v-icon>mdi-movie</v-icon>
                Publish
            </v-btn>
        </v-app-bar>
        <div class="editorParent">

            <!-- <Editor :slides="slides_classic" type="classic" :template="template" /> -->
            <TimelineEditor v-if="step == 'timeline'" />

        </div>
    </div>
</template>

<script>
import Editor from './presentation-editor/Editor';
import TimelineEditor from './timeline-editor/TimelineEditor';
import { mapState } from 'vuex';
export default{
    components: {
        Editor,
        TimelineEditor
    },
    computed: mapState(['project']),
    data:() => ({
        step: 'timeline',
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
                    type: 'color',
                    color: '#1ED760'
                },
                animation: 'zoom',
                template: 'template-2',
                duration: 4000,
            }, {
                content: [
                    {
                        rect: {
                            x: 300, y: 200,
                            width: 200,
                            height: 50
                        },
                        content: {
                            type: 'text',
                            text: 'New slide',
                            style: {
                                'color': 'white',
                                'text-align': 'center',
                            }
                        }
                    },
                ],
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
        const slide = this.slides_classic[1];
        for(let i = 0; i < 2; i++){
            const clone = JSON.parse(JSON.stringify(slide));
            clone.content[0].content.text = 'Slide ' + (i + 2);
            this.slides_classic.push(clone);
        }
        const p = this.project;
        p.type = 'classic';
        p.template = this.template;
        p.slides = this.slides_classic;

        window.test = () => {
            if(this.step == 'timeline'){
                this.step = 'foo';
            }else{
                this.step = 'timeline';
            }
        }
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