<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Publish Video</v-card-title>
        <v-card-text>
            <br>
            <v-text-field :value="outputFilename" label="Output file" @click="selectOutputFile"
                readonly :disabled="working" dense outlined hide-details />
            <v-btn :loading="working" @click="publish" block class="publishButton primary-button" elevation="0">Publish</v-btn>
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
import { mapState } from 'vuex';
import path from 'path';

export default {
    data:() => ({
        open: false,
        working: false,
        outputFilename: '',

        statusCode: '',
        progress: 0,
        slides: null,
        options: null,
    }),
    computed: {
        ...mapState(['project']),
        statusText(){
            if(this.working){
                if(this.statusCode == 'starting' || this.statusCode == ''){
                    return 'Starting...';
                }else if(this.statusCode == 'rendering_transitions'){
                    return `Rendering slides ${this.progress + 1}/${this.slides.length}`;
                }else if(this.statusCode == 'rendering_video'){
                    return 'Rendering video...'
                }else if(this.statusCode == 'adding_audio'){
                    return 'Adding audio...';
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
                    ...this.options,
                    scale: 1280 / 800,
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
                await alert('Video Successfully Published!', 'Success!');
                this.working = false;
                this.open = false;
            }else{
                alert('Something went wrong, Please try again.', 'Error');
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
                this.assignProjectName(filename);
            }
        },

        assignProjectName(filename){
            if(!this.project.name){
                const basename = path.basename(filename);
                const projectname = basename.substr(0, basename.length - path.extname(basename).length);
                this.project.name = projectname;
                console.log(projectname)
            }
        },

        closeClick(){
            this.open = false;
        },

        handleRequest(slides, options){
            this.slides = slides;
            this.options = options;
            this.statusCode = '';
            this.progress = 0;
            this.working = false;
            this.open = true;
        },

        start(slides, type){
            return new Promise(resolve => {
                this.resolve = resolve;
                this.handleRequest(slides, type);
            });
        }
    },

    created(){
        window.publishPresentation = (slides, type) => this.start(slides, type);
        // setTimeout(() => this.open = true, 500)
    }
}
</script>

<style scoped>
.publishButton{
    margin: 10px 0;
}
</style>