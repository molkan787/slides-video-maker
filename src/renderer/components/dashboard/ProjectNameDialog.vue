<template>
    <v-row justify="center">
        <v-dialog v-model="open" persistent max-width="400">
            <v-card>
                <v-card-title class="headline">Create new Presentation</v-card-title>
                <v-card-text>
                    Type the presentation name (alpha-numeric only) <br> <br>
                    <v-text-field v-model="name" label="Presentation Name" dense outlined hide-details filled block />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelClick" v-if="cancelButtonText">{{ cancelButtonText }}</v-btn>
                    <v-btn color="blue darken-1" text @click="okClick">{{ okButtonText }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import ProjectsManager from '../../projects-manager';
export default {
    data:() => ({
        open: false,
        name: '',
        okButtonText: 'OK',
        cancelButtonText: 'Cancel'
    }),

    methods: {
        okClick(){
            let name = this.name.trim();
            if(this.validate(name)){
              name = name.charAt(0).toUpperCase() + name.substr(1);
              this.open = false;
              this.resolve(name);
            }
        },
        cancelClick(){
            this.open = false;
            this.resolve(false)
        },

        validate(name){
            if(name.length < 1){
                alert('Please type a name');
                return false;
            }
            try {
                ProjectsManager.checkProjectName(name);
            } catch (error) {
                if(error == 'illegal_character'){
                  alert('Please use only alpha-numeric characters.');
                }else if(error == 'name_exist'){
                  alert('A presentation with the same name already exist.');
                }
                return false;
            }
            return true;
        },

        handleRequest(){
            this.name = '';
            this.open = true;
        },

        prompt(){
            return new Promise(resolve => {
                this.resolve = resolve;
                this.handleRequest();
            });
        },
    }
}
</script>

<style>
.v-text-field--filled.v-input--dense input{
  margin-top: 0 !important;
}
</style>