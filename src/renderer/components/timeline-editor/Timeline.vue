<template>
    <div ref="timeline" class="timeline">
        <div class="timebar" @mousedown="timebarClick" :style="{width}" style="background-image: url('static/images/timeline.png'">
            <span v-for="(stamp, index) in timebarStamps" :key="index">{{ stamp | time }}</span>
        </div>
        <div v-for="(track, index) in tracks" :key="index" class="track" :style="{width}">
            <div v-for="(item, index) in track" :key="index"
                :style="getItemStyle(item)" class="item">
                {{ item.name || `Slide ${index + 1}` }}
            </div>
        </div>
        <div ref="seekbar" class="seekbar" :style="{left: timeToPixels(currentTime) + 'px'}">
            <div class="handle"></div>
            <div class="indicator"></div>
        </div>
    </div>
</template>

<script>
import { horizontalDrag } from '../../ui-helpers';
export default {
    props: {
        duration: {
            type: Number,
            required: true
        },
        value: {
            type: Number,
            default: 0
        },
        tracks: {
            type: Array,
            required: true,
        },
        playing: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        width(){
            return this.timeToPixels(this.duration).toString() + 'px';
        }
    },
    watch: {
        duration(){
            this.updateTimebarStamps();
            this.dragController.max = this.timeToPixels(this.duration);
        },
        value(val){
            this.currentTime = val;
        },
        currentTime(val){
            const timelineEl = this.$refs.timeline;
            if(val == 0){
                timelineEl.scrollLeft = 0;
                return;
            }
            if(!this.playing || this.lockAutoScroll) return;
            const seekbarLeft = this.timeToPixels(val);
            const scrollLeft = timelineEl.scrollLeft;
            const width = timelineEl.getClientRects()[0].width;
            const diff = width - (seekbarLeft - scrollLeft);
            if(diff < 10){
                timelineEl.scrollLeft += 300;
                this.lockAutoScroll = true;
                setTimeout(() => this.lockAutoScroll = false, 100);
            }
        }
    },
    data:() => ({
        currentTime: 0,
        timebarStamps: [],
        dragController: null,
        lockAutoScroll: false,
    }),
    methods: {
        timeToPixels(time){
            return (time / 5000) * 119;
        },
        pixelsToTime(pixels){
            return (pixels / 119) * 5000;
        },
        getItemStyle(item){
            const hidden = !item.checked;
            const left = this.timeToPixels(item.starttime);
            const width = this.timeToPixels(this.duration) - left;
            return {
                'margin-left': left + 'px',
                'width': width + 'px',
                'opacity': hidden ? 0 : 1,
            }
        },
        updateTimebarStamps(){
            const stamps = [];
            const n = Math.ceil(this.duration / 5000);
            for(let i = 0; i < n; i++){
                stamps.push(i * 5000);
            }
            this.timebarStamps = stamps;
        },
        timebarClick(e){
            this.seekbarChange(e.offsetX);
            this.dragController.start(e.offsetX);
        },
        seekbarChange(left){
            const time = this.pixelsToTime(left);
            this.currentTime = time;
            this.$emit('input', time);
        }
    },
    mounted(){
        this.updateTimebarStamps();
        const dragController = this.dragController = horizontalDrag(this.$refs.seekbar, 0, this.timeToPixels(this.duration));
        dragController.onchange = left => this.seekbarChange(left);
        this.currentTime = this.value;
    }
}
</script>

<style lang="scss" scoped>
.timeline{
    position: relative;
    padding-top: 12px;
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
        height: 16px;
    }
    
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
        border-radius: 4px;
        &:hover{
            background-color: rgb(156, 156, 156);
        }
        &:active{
            background-color: rgb(136, 136, 136);
        }
    }
}
.timebar{
    height: 17px;
    min-width: 100%;
    background-repeat: repeat-x;
    span{
        display: inline-block;
        float: left;
        width: 119px;
        height: 100%;
        font-size: 12px;
        font-weight: bold;
        padding-left: 0px;
        margin-top: -15px;
        color: #525252;
        pointer-events: none;
    }
}
.track{
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    background-color: #f9f9f9;
    border: 1px solid #e8e8e8;
    overflow: hidden;
    .item{
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        padding: 8px;
        color: #676666;
        font-weight: bold;
        border-left: 1px solid #c3c3c3;
        background-color: inherit;
        position: relative;
        transform: translateX(-1px);
        pointer-events: none;
        margin-bottom: -40px;
    }
}
.seekbar{
    position: absolute;
    top: 14px;
    width: 14px;
    height: 140px;
    margin-left: -6px;
    div{
        background-color: red;
    }
    .handle{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        box-shadow: 0 0 4px #757474;
        cursor: pointer;
        transition: transform 0.25s;
        &:hover{
            transform: scale(1.1);
        }
    }
    .indicator{
        width: 2px;
        height: 100%;
        margin: 0 6px;
    }
}
</style>