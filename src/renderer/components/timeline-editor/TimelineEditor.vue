<template>
    <div class="timeline-editor v-card">
        <SlidesList :type="project.type" :items="project.slides" @itemCheckedChanged="itemCheckedChanged" />

        <div class="middle-card pa-2 player">
            <div class="canvas">
                <div class="tools">
                    <v-btn elevation="0" @click="removeAllMarkers">Remove all markers</v-btn>
                    <br>
                    <v-btn elevation="0" @click="autoDuration" class="mt-1">Auto duration</v-btn>
                </div>
                <div ref="playerSlideWrapper" class="playerSlideWrapper v-card" :style="{width: playerSlide.width + 'px'}">
                    <template v-if="currentSlide">
                        <ClassicSlide v-if="project.type == 'classic'" :data="currentSlide" :zoom="playerSlide.zoom"/>
                        <KineticSlide v-else-if="project.type == 'kinetic'" :data="currentSlide" :zoom="playerSlide.zoom"/>
                    </template>
                </div>
            </div>
            <div class="controls">
                <span>
                    {{ currentTime | time }}
                    <label style="color: #6f6f6f;"> / {{ timeline.duration | time }}</label>
                </span>
                <v-btn color="grey" dark elevation="0" @click="switchPlayState">
                    <v-icon>{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                    {{ playing ? 'Pause' : 'Play' }}
                </v-btn>
                <v-btn color="grey" class="duration" dark elevation="0" @click="changeDuration">
                    <v-icon>mdi-timer</v-icon> Duration
                </v-btn>
            </div>
        </div>
        <div class="pa-2 bottom-card" elevation="2">
            <div class="bottom left">
                <div class="track-controll">Slides</div>
                <div class="track-controll">
                    <template v-if="audio">
                        <v-icon @click="removeAudioClick" title="Remove Audio Track">mdi-delete</v-icon>
                        Audio
                    </template>
                    <template v-else>
                        <v-btn @click="addAudio" :loading="addAudioBtnLoading" small elevation="0">Add Audio</v-btn>
                    </template>
                </div>
            </div>
            <div class="bottom right">
                <Timeline v-model="currentTime" @input="seekAudio" :duration="timeline.duration" :tracks="tracks" :playing="playing" />
            </div>
        </div>
        <DurationSelector ref="durationSelector" />
    </div>
</template>

<script>
import path from 'path';
import AccurateTimer from '../../libs/AccurateTimer';
import Editor from '../../editor';
import SlidesList from './SlidesList';
import Timeline from './Timeline';
import { mapState } from 'vuex';
import ClassicSlide from '../presentation-editor/ClassicSlide';
import KineticSlide from '../presentation-editor/KineticSlide';
import DurationSelector from './DurationSelector';
const SLIDE_MIN_DIFF = 100;
export default {
    components: {
        SlidesList,
        Timeline,
        ClassicSlide,
        KineticSlide,
        DurationSelector
    },
    computed: {
        ...mapState({
            project: state => state.project,
            timeline: state => state.project.timeline,
            cache: state => state.timelineEditor,
        }),
        tracks(){
            return [this.project.slides, this.audioTrack];
        },
        audioTrack(){
            return [{
                starttime: 0,
                checked: true,
                name: this.audio ? path.basename(this.project.audioFilename) : ' '
            }]
        }
    },
    watch: {
        currentTime(){
            this.updateCurrentSlide();
        }
    },
    data:() => ({
        currentTime: 0,
        playing: false,
        audio: null,
        timer: null,
        currentSlide: null,

        addAudioBtnLoading: false,
        playerSlide: {
            width: 0,
            zoom: 1,
        },
        resizeHandler: null,
    }),
    methods: {
        async removeAllMarkers(){
            if(! await confirm('Remove all markers?')) return;
            for(let slide of this.project.slides){
                if(slide.starttime > 0)
                    this.$set(slide, 'checked', false);
            }
            this.currentTime = 0;
        },
        async autoDuration(){
            const dps = await this.$refs.durationSelector.open(5000, 1000, 'Duration per slide');
            if(dps){
                for(let i = 0; i < this.project.slides.length; i++){
                    const slide = this.project.slides[i];
                    this.$set(slide, 'checked', true);
                    this.$set(slide, 'starttime', i * dps);
                }
                this.currentTime = 0;
                const total = dps * this.project.slides.length
                this.timeline.duration = total;
            }
        },
        async changeDuration(){
            this.stop();
            const duration = await this.$refs.durationSelector.open(
                this.timeline.duration,
                this.project.slides.length * 100);
            if(duration){
                this.currentTime = 0;
                this.timeline.duration = duration;
            }
        },
        updateCurrentSlide(){
            const time = this.currentTime;
            const slides = this.project.slides;
            if(time == 0){
                this.currentSlide = slides[0];
                return;
            };
            let record = -1;
            let selected = null;
            for(let i = 0; i < slides.length; i++){
                const slide = slides[i];
                if(slide.checked){
                    if(slide.starttime <= time){
                        if(slide.starttime > record){
                            record = slide.starttime;
                            selected = slide;
                        }
                    }else{
                        break;
                    }
                }
            }
            this.currentSlide = selected;
        },
        async removeAudioClick(){
            if(this.stop());
            if(await confirm('Remove audio track?')){
                this.removeAudio();
            }
        },
        removeAudio(){
            this.audio.unload();
            this.audio = null;
            this.project.audioFilename = null;
        },
        async addAudio(){
            this.stop();
            this.addAudioBtnLoading = true;
            try {
                const audio = await Editor.promptAudio();
                if(audio){
                    if(this.audio) this.audio.unload();
                    this.audio = audio.audio;
                    this.project.audioFilename = audio.filename;
                }
            } catch (error) {
                alert('An error occured when loading audio file', 'Error!');
            }
            this.addAudioBtnLoading = false;
        },
        async loadCurrentAudio(){
            this.addAudioBtnLoading = true;
            try {
                this.audio = await Editor.loadAudio(this.project.audioFilename);
            } catch (error) {
                alert('An error occured when loading audio file', 'Error!');
            }
            this.addAudioBtnLoading = false;
        },
        itemCheckedChanged(index, item){
            if(item.checked){
                let starttime = this.currentTime;
                const nextSlide = this.getNextChecked(index);
                if(nextSlide){
                    const diff = nextSlide.starttime - starttime;
                    if(diff < SLIDE_MIN_DIFF * 2){
                        this.$nextTick(() => item.checked = false);
                        return;
                    }
                }
                const previousItem = this.getPreviousChecked(index);
                const diff = starttime - previousItem.starttime;
                if(diff < SLIDE_MIN_DIFF){
                    starttime += (SLIDE_MIN_DIFF - diff);
                }
                item.starttime = starttime;
            }
            if(!this.playing){
                this.updateCurrentSlide();
            }
        },
        getPreviousChecked(index){
            const items = this.project.slides;
            for(let i = index - 1; i >= 0; i--){
                const item = items[i];
                if(item.checked){
                    return item;
                }
            }
        },
        getNextChecked(index){
            const items = this.project.slides;
            for(let i = index + 1; i < items.length; i++){
                const item = items[i];
                if(item.checked){
                    return item;
                }
            }
            return null;
        },
        switchPlayState(){
            this.playing ? this.stop() : this.play();
        },
        play(){
            this.playing = true;
            this.timer.start();
            if(this.audio){
                this.seekAudio(this.currentTime)
                this.audio.play();
            }
        },
        stop(){
            this.playing = false;
            this.timer.stop();
            if(this.audio){
                this.audio.pause();
            }
        },
        seekAudio(time){
            if(this.audio){
                this.audio.seek(time / 1000);
            }
        },
        timerTick(){
            const duration = this.timeline.duration;
            let _currentTime = this.audio ? this.audio.seek() * 1000 : this.currentTime + 50;
            if(_currentTime >= duration){
                this.currentTime = 0;
                this.stop();
            }else{
                this.currentTime = _currentTime;
            }
        },
        updateSizes(){
            const el = this.$refs.playerSlideWrapper;
            const { height } = el.getClientRects()[0];
            const width = Math.round(height * (800 / 450));
            this.playerSlide.width = width;
            this.playerSlide.zoom = height / 450;
        }
    },
    mounted(){
        const firstSlide = this.project.slides[0];
        this.$set(firstSlide, 'starttime', 0);
        this.$set(firstSlide, 'checked', true);
        this.currentSlide = firstSlide;
        this.updateSizes();

        if(this.project.audioFilename && !this.audio){
            this.loadCurrentAudio();
        }
    },
    created(){
        if(this.timeline.duration == -1){
            const { type, slides } = this.project;
            const timeperslide = type == 'classic' ? 5000 : 8000;
            this.timeline.duration = timeperslide * slides.length;
        }
        this.timer = new AccurateTimer(() => this.timerTick(), 50);
        this.resizeHandler = () => this.updateSizes();
        window.addEventListener('resize', this.resizeHandler);
        this.audio = this.cache.audio;
        this.currentTime = this.cache.currentTime;
    },
    beforeDestroy(){
        window.removeEventListener('resize', this.resizeHandler);
        this.cache.audio = this.audio;
        this.cache.currentTime = this.currentTime;
        this.stop();
    }
}
</script>

<style lang="scss" scoped>
.timeline-editor{
    height: 100%;
    padding: 0;
    overflow: hidden;
}
.bottom-card{
    height: 142px;
}
.bottom{
    display: inline-block;
    &.left{
        width: 120px;
        float: left;
        padding-top: 33px;
        .track-controll{
            width: 100%;
            height: 40px;
            box-sizing: border-box;
            border: 1px solid #e8e8e8;
            overflow: hidden;
            font-size: 16px;
            font-weight: bold;
            color: #737373;
            padding: 8px;
            text-align: center;
            button{
                position: relative;
                top: -3px;
            }
            i{
                position: absolute;
                left: 16px;
                margin-top: 2px;
                font-size: 20px;
                cursor: pointer;
            }
        }
    }
    &.right{
        width: calc(100% - 120px);
        margin-top: 4px;
    }
}
.middle-card{
    box-sizing: border-box;
    width: 100%;
    margin: auto;
    height: calc(100% - 280px);
    .tools{
        float: left;
        height: 0;
        button{
                width: 186px;
        }
    }
}
.player{
    .canvas{
        width: 100%;
        height: calc(100% - 42px);
        box-sizing: border-box;
        margin-bottom: 5px;
        .playerSlideWrapper{
            height: 100%;
            margin: auto;
            pointer-events: none;
            box-sizing: border-box;
            padding: 5px;
            border-radius: 20px;
            overflow: hidden;
        }
    }
    .controls{
        width: 500px;
        margin: auto;
        height: 37px;
        background-color: #f1f1f1;
        border-radius: 4px;
        button{
            width: 110px;
            font-weight: bold;
            float: left;
            i{
                margin-left: -5px;
                margin-right: 5px;
            }
            &.duration{
                width: fit-content;
                float: right;
            }
        }
        span{
            position: absolute;
            left: 0;
            display: inline-block;
            width: 100%;
            font-size: 18px;
            font-weight: bold;
            padding-top: 4px;
            text-align: center;
        }
    }
}
.v-card{
    margin-bottom: 10px;
}
</style>