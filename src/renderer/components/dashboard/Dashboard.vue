<template>
    <div class="dashboard">
        <div class="wrapper">
            <v-card elevation="1">
                <h1>Create new Presentation</h1>
                <h4>Presentation Style:</h4>
                <v-btn-toggle v-model="projectType" mandatory >
                    <v-btn value="classic">Classic</v-btn>
                    <v-btn value="kinetic">Kinetic</v-btn>
                </v-btn-toggle>
                <h4 class="mt-7">Project:</h4>
                <v-btn-toggle v-model="inputRawText" mandatory >
                    <v-btn :value="false">Start from<br>scratch</v-btn>
                    <v-btn :value="true">Paste Text</v-btn>
                </v-btn-toggle>
                <v-btn @click="createProject" class="submit white--text" block dark elevation="0">Create</v-btn>
            </v-card>
        </div>
    </div>
</template>

<script>
import ProjectFactory from '../../project-factory';
import { mapState } from 'vuex';
export default {
    computed: mapState(['project', 'steps', 'app']),
    methods: {
        createProject(type){
            this.app.rawInputRequested = this.inputRawText;
            this.project.type = this.projectType;
            this.steps.current = 'design-setting';
        }
    },
    data:() => ({
        projectType: 'classic',
        inputRawText: false,
    }),
    mounted(){
        this.projectType = this.project.type || 'classic';
    }
}
</script>

<style lang="scss" scoped>
.dashboard{
    display: table;
    width: 100%;
    height: 100%;
    .wrapper{
        display: table-cell;
        width: 100%;
        height: 100%;
        vertical-align: middle;
        text-align: center;
        .v-card{
            display: inline-block;
            width: fit-content;
            padding: 20px;
        }
        h1{
            margin-bottom: 80px;
        }
        h4{
            margin-bottom: 10px;
        }
        button{
            height: 48px;
            width: 200px;
            font-weight: bold;
            font-size: 15px;
            color: #555;
            &.submit{
                margin-top: 100px;
            }
        }
    }
}
</style>