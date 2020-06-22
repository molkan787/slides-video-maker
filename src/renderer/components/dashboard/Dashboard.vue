<template>
    <div class="dashboard">
        <div class="wrapper">
           <div class="cards">
                <v-card class="left item" elevation="1">
                    <h1>Create New Video</h1>
                    <!-- <h4>Presentation Style:</h4>
                    <v-btn-toggle v-model="projectType" mandatory >
                        <v-btn value="classic">Classic</v-btn>
                        <v-btn value="kinetic">Kinetic</v-btn>
                    </v-btn-toggle> -->
                    <!-- <h4 class="mt-7">Project:</h4> -->
                    <v-btn-toggle v-model="inputRawText" mandatory >
                        <v-btn class="my-switch-btn" :value="false">
                            <div>
                                <img src="@/assets/icons/blank_document.png">
                                <br>Blank Slide
                            </div>
                        </v-btn>
                        <v-btn class="my-switch-btn" :value="true">
                            <div>
                                <img src="@/assets/icons/paste_text.png">
                                <br>Paste Text
                            </div>
                        </v-btn>
                    </v-btn-toggle>
                    <v-btn @click="createProject" class="submit primary-button" block dark elevation="0">Start</v-btn>
                    <!-- <v-btn @click="loadProject" class="submit" block light elevation="0">Load</v-btn> -->
                </v-card>
                <v-card class="right item projects-list">
                    <h1>Saved Projects</h1>
                    <div class="list">
                        <div v-for="p in projects" :key="p">
                            <v-icon @click="deleteProject(p)" title="Delete">mdi-delete</v-icon>
                            <a @click="loadProject(p)" href="#">{{ p }}</a>
                        </div>
                        <div v-if="!projects || projects.length == 0" class="empty">No Presentations</div>
                    </div>
                </v-card>
           </div>
        </div>
    </div>
</template>

<script>
import ProjectFactory from '../../project-factory';
import ProjectsManager from '../../projects-manager';
import { mapState } from 'vuex';
export default {
    computed: mapState(['project', 'steps', 'app']),
    watch: {
        'project.type'(){
            this.loadProjects();
        }
    },
    methods: {
        async createProject(type){
            this.app.rawInputRequested = this.inputRawText;
            // this.project.type = this.projectType;
            this.project.name = '';
            this.steps.current = 'design-setting';
        },
        async loadProject(name){
            await ProjectsManager.loadProject(name);
            this.steps.current = 'editor';
        },
        async deleteProject(name){
            if(await confirm(`Delete project '${name}'? This action cannot be undone.`)){
                await ProjectsManager.deleteProject(name);
            }
        },

        async loadProjects(){
            this.projects = [];
            this.projects = await ProjectsManager.getProjectsList();
        }
    },
    data:() => ({
        projectType: 'classic',
        inputRawText: false,
        projects: [],
    }),
    async mounted(){
        this.projectType = this.project.type || 'classic';
        this.loadProjects();
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
        .cards{
            width: fit-content;
            margin: auto;
            .item{
                height: 508px;
                &.left{
                    float: left;
                }
                &.right{
                    margin-left: 20px;
                }
            }
        }
        .v-card{
            display: inline-block;
            width: fit-content;
            padding: 20px;
            min-width: 300px;
        }
        h1{
            margin-bottom: 110px;
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
                margin-top: 130px;
            }
        }
    }
}
.my-switch-btn{
    div, img{
        cursor: pointer;
    }
    height: 130px !important;
    img{
        opacity: 0.5;
    }
}
.projects-list{
    padding: 20px 34px;
    h1{
        margin-bottom: 20px !important;
    }
    .list{
        text-align: left;
        div{
            padding-bottom: 6px;
        }
        a{
            font-size: 19px;
            color: #5a5a5a;
        }
        i{
            color: #5a5a5a;
            font-size: 20px;
            margin-top: -3px;
            cursor: pointer;
            opacity: 0.6;
            &:hover{
                opacity: 1;
            }
        }
    }
}
</style>