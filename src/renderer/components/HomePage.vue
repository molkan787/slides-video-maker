<template>
    <div class="homePage">
        <v-app-bar dense color="primary" dark elevation="1" class="header">
            <v-toolbar-title>Slides Video Maker</v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-if="steps.current !== 'dashboard'">
                <v-btn class="publishButton" @click="back" light right elevation="0" >
                    Back
                </v-btn>
                <v-btn class="publishButton" @click="next" light right elevation="0" >
                    <v-icon v-if="step == 'timeline'">mdi-movie</v-icon>
                    {{ step == 'timeline' ? 'Publish' : 'Next' }}
                </v-btn>
            </template>
        </v-app-bar>
        <div class="editorParent">

            <Dashboard v-if="step == 'dashboard'" />
            <DesignSetting ref="designSetting" v-else-if="step == 'design-setting'" />
            <Editor v-else-if="step == 'editor'"
                :slides="project.slides" :type="project.type" :template="project.template" />
            <TimelineEditor v-else-if="step == 'timeline'" />

        </div>
    </div>
</template>

<script>
import Dashboard from './dashboard/Dashboard';
import DesignSetting from './design-setting/DesignSetting';
import Editor from './presentation-editor/Editor';
import TimelineEditor from './timeline-editor/TimelineEditor';
import { mapState } from 'vuex';
export default{
    components: {
        Editor,
        TimelineEditor,
        Dashboard,
        DesignSetting
    },
    computed: {
        ...mapState(['project', 'steps']),
        step(){
            return this.steps.current;
        }
    },
    data:() => ({

    }),
    methods: {
        back(){
            if(this.step == 'design-setting'){
                this.steps.current = 'dashboard';
            }else if(this.step == 'editor'){
                this.steps.current = 'design-setting';
            }else if(this.step == 'timeline'){
                this.steps.current = 'editor';
            }
        },
        next(){
            if(this.step == 'design-setting'){
                this.$refs.designSetting.submit();
            }else if(this.step == 'editor')
                this.steps.current = 'timeline';
            else if(this.step == 'timeline'){
                this.publish();
            }
        },
        publish(){
            const slides = this.project.slides.filter(slide => slide.checked);
            if(slides.length > 1){
                const project = this.prepareProject();
                window.publishPresentation(project.slides, project.options);
            }else{
                alert('Please use at least 2 slides before publishing');
            }
        },

        prepareProject(){
            const { slides, timeline, type, audioFilename } = this.project;
            const duration = timeline.duration;
            const _slides = slides.filter(slide => slide.checked);
            for(let i = 0; i < _slides.length; i++){
                const slide = _slides[i];
                const nextSlide = _slides[i + 1];
                const endtime = nextSlide ? nextSlide.starttime : duration;
                const slideDuration = endtime - slide.starttime;
                slide.duration = slideDuration;
            }
            return {
                slides: _slides,
                options: {
                    type,
                    duration,
                    audioFilename
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.homePage{
    height: 100%;
}
.header{
    button{
        margin-left: 10px;
    }
}
.editorParent{
    padding: 3px;
    height: calc(100% - 48px);
}
.publishButton{
    float: right;
}
</style>