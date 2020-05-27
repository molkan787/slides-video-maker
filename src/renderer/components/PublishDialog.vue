<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Publish Presentation</v-card-title>
        <v-card-text>
            <br>
            <v-text-field :value="outputFilename" label="Output file" @click="selectOutputFile"
                readonly :disabled="working" dense outlined hide-details />
            <v-btn :loading="working" @click="publish" block elevation="1" class="publishButton">Publish</v-btn>
            <p>
                Status: {{ statusText }}
            </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="working" color="blue darken-1" @click="closeClick" text>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { promptSaveFile } from '../helpers';
import { rendererService } from '../services';

export default {
    data:() => ({
        open: false,
        working: false,
        outputFilename: '',

        statusCode: '',
        progress: 0,
        slides: null,
    }),
    computed: {
        statusText(){
            if(this.working){
                if(this.statusCode == 'starting' || this.statusCode == ''){
                    return 'Starting...';
                }else if(this.statusCode == 'rendering_transitions'){
                    return `Rendering slides ${this.progress + 1}/${this.slides.length}`;
                }else if(this.statusCode == 'rendering_video'){
                    return 'Rendering video...'
                }
            }else{
                return '--';
            }
        }
    },
    methods: {
        async publish(){
            if(this.outputFilename.length < 6){
                alert('Please select an output file');
                return;
            }
            this.working = true;
            const progress = rendererService.render({
                slides: this.slides,
                options: {
                    type: 'classic',
                    outputFilename: this.outputFilename,
                    size: {
                        width: 1280,
                        height: 720
                    }
                }
            });
            progress.on('statusChanged', ({ code }) => this.statusCode = code);
            progress.on('changed', ({ success }) => this.progress = success);
            const resp = await progress.wait();
            if(resp == 'completed'){
                await alert('Presentation got successfully published!');
                this.working = false;
                this.open = false;
            }else{
                alert('Something went wrong, Please try again.');
                this.working = false;
            }
        },
        async selectOutputFile(){
            const filename = await promptSaveFile([{
                name: 'Video',
                extensions: ['mp4']
            }]);
            if(filename){
                this.outputFilename = filename;
            }
        },

        closeClick(){
            this.open = false;
        },

        handleRequest(slides){
            this.slides = slides;
            this.statusCode = '';
            this.progress = 0;
            this.working = false;
            this.open = true;
        },

        start(slides){
            return new Promise(resolve => {
                this.resolve = resolve;
                this.handleRequest(slides);
            });
        }
    },

    created(){
        window.publishPresentation = slides => this.start(slides);
        // setTimeout(() => this.open = true, 500)
    }
}
</script>

<style scoped>
.publishButton{
    margin: 10px 0;
}
</style>