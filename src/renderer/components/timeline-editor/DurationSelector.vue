<template>
    <v-row justify="center">
    <v-dialog v-model="isOpen" persistent max-width="250">
        <v-card>
            <v-card-title class="headline">{{ title }}</v-card-title>
            <v-card-text class="wrapper">
                <Timeselector ref="timeselector" displayFormat="mm:ss" :interval="{m:1, s:1}" :displayHours="false"
                    v-model="date" :displayMinutes="true" :displaySeconds="true" >
                    <template slot="clear-ico">
                        <span></span>
                    </template>
                </Timeselector>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelClick">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="okClick">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Timeselector from 'vue-timeselector';
export default {
    components: {
        Timeselector
    },
    data:() => ({
        isOpen: false,
        title: '',
        current: 0,
        min: 0,
        date: new Date()
    }),

    methods: {
        okClick(){
            this.isOpen = false;
            let duration = this.getTime();
            if(duration < this.min){
                duration = this.min;
            }
            this.resolve(duration);
        },
        cancelClick(){
            this.isOpen = false;
            this.resolve(false)
        },

        handleRequest(current, min, title){
            this.title = title || 'Change Duration';
            this.current = current;
            this.min = min;
            this.parseTime();
            this.isOpen = true;
        },

        getTime(){
            const minutes = this.date.getMinutes();
            const seconds = this.date.getSeconds();
            return ((minutes * 60) + seconds) * 1000;
        },

        parseTime(){
            const totalSeconds = this.current / 1000;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds - (minutes * 60));
            this.date.setMinutes(minutes, seconds);
        },

        open(current, min, title){
            return new Promise(resolve => {
                this.resolve = resolve;
                this.handleRequest(current, min, title);
                this.$nextTick(() => {
                    const input = this.$refs.timeselector.$el.querySelector('input');
                    // input.focus();
                    input.click();
                })
            });
        },
    },
    mounted(){
        // setTimeout(() => this.isOpen = true, 500)
    }
}
</script>

<style lang="scss" scoped>
.wrapper{
    height: 200px;
    padding: 6px;
    padding-top: 3px;
}
</style>

<style lang="scss">
.vtimeselector{
    input{
        font-size: 28px;
        text-align: center;
        margin-bottom: 11px;
    }
    .vtimeselector__box__item {
        font-size: 1.3em;
    }
}
</style>