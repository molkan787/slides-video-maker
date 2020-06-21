<template>
    <div class="homePage">
        <v-app-bar dense dark elevation="1" class="header">
            <v-toolbar-title class="header-title">{{ project.type == 'classic' ? 'Classic' : 'Kinetic' }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-if="steps.current !== 'dashboard'">
                <v-btn class="mybutton" @click="back" light right elevation="0" >
                    Back
                </v-btn>
                <v-btn class="mybutton primary-button" @click="next" light right elevation="0" >
                    <v-icon v-if="step == 'timeline'">mdi-movie</v-icon>
                    {{ step == 'timeline' ? 'Publish' : 'Next' }}
                </v-btn>
            </template>
        </v-app-bar>
        <div class="navigation">
            <NavigationDrawer :current="step" :available="availableMenuItems"
                @itemClick="navigationItemClick" />
        </div>
        <div class="editorParent">

            <TextInput v-if="textInputStep" ref="textInput"/>
            <Dashboard v-else-if="step == 'dashboard'" />
            <DesignSetting ref="designSetting" v-else-if="step == 'design-setting'" />
            <Editor v-else-if="step == 'editor'"
                :slides="project.slides" :type="project.type" :template="project.template" />
            <TimelineEditor v-else-if="step == 'timeline'" />

        </div>
        <ProjectNameDialog ref="nameDialog"/>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProjectFactory from '../project-factory';
import ProjectsManager from '../projects-manager';
import NavigationDrawer from './NavigationDrawer';
import Dashboard from './dashboard/Dashboard';
import DesignSetting from './design-setting/DesignSetting';
import TextInput from './text-input/TextInput';
import Editor from './presentation-editor/Editor';
import TimelineEditor from './timeline-editor/TimelineEditor';
import ProjectNameDialog from './dashboard/ProjectNameDialog';
export default{
    components: {
        NavigationDrawer,
        Editor,
        TimelineEditor,
        Dashboard,
        DesignSetting,
        TextInput,
        ProjectNameDialog
    },
    computed: {
        ...mapState(['project', 'steps', 'app']),
        step(){
            return this.steps.current;
        },
        availableMenuItems(){
            const s = this.step;
            if(s == 'dashboard') return [0];
            else if(s == 'design-setting') return [0, 1];
            else if(s == 'editor' || s == 'timeline') return [0, 2, 3];
        },
    },
    data:() => ({
        textInputStep: false,
        template: null,
        saveBtnLoading: false,
    }),
    methods: {
        ...mapActions(['setProject']),
        async beforeDashboard(name){
            if(name == 'dashboard' && this.steps.current != 'design-setting' && this.project.name != null){
                if(await confirm('Do you want to save current presentation before closing it?', 'Wait!')){
                    if(this.project.name){
                        await ProjectsManager.saveCurrentProject();
                    }else{
                        const name = await this.$refs.nameDialog.prompt();
                        if(name){
                            this.project.name = name;
                            await ProjectsManager.saveCurrentProject();
                        }
                    }
                }
                this.project.name = null;
            }
        },
        async navigationItemClick(name){
            await this.beforeDashboard(name);
            this.steps.current = name;
        },
        async back(){
            if(this.textInputStep){
                if(!this.$refs.textInput.back()){
                    this.textInputStep = false;
                }
                return;
            }
            let name = '';
            if(this.step == 'design-setting'){
                name = 'dashboard';
            }else if(this.step == 'editor'){
                // name = 'design-setting';
                name = 'dashboard';
            }else if(this.step == 'timeline'){
                name = 'editor';
            }

            await this.beforeDashboard(name);
            this.steps.current = name;
        },
        next(){
            if(this.textInputStep){
                if(!this.$refs.textInput.next()){
                    this.createProject(this.template);
                    this.textInputStep = false;
                }
                return;
            }

            if(this.step == 'design-setting'){
                const template = this.$refs.designSetting.getTemplate();
                if(template){
                    this.submitTemplate(template);
                }
            }else if(this.step == 'editor')
                this.steps.current = 'timeline';
            else if(this.step == 'timeline'){
                this.publish();
            }
        },
        submitTemplate(template){
            if(this.app.rawInputRequested){
                this.template = template;
                this.textInputStep = true;
            }else{
                this.createProject(template);
            }
        },
        createProject(template){
            const rawSlides = this.app.rawInputRequested ? this.app.rawSlides : null;
            const project = ProjectFactory.create(this.project.type, template, rawSlides);
            this.setProject(project);
            this.steps.current = 'editor';
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
    background-color: #FEFCFE !important;
    .header-title{
        margin-left: 220px;
        color: #0e1e4c;
        font-weight: bold;
    }
    button{
        margin-left: 10px;
    }
}
$navigation-width: 220px;
$appbar-height: 48px;
.editorParent{
    position: absolute;
    top: $appbar-height;
    left: $navigation-width;
    width: calc(100% - #{$navigation-width});
    height: calc(100% - #{$appbar-height});
    padding: 10px;
}
.navigation{
    position: absolute;
    height: 100%;
    width: $navigation-width;
    top: 0;
    left: 0;
}
.mybutton{
    float: right;
}
</style>