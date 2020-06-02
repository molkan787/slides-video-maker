<template>
    <div class="dashboard">
        <div class="wrapper">
            <h1>Create new Presentation</h1>
            <v-btn @click="classicClick">Classic style Presentation</v-btn>
            <v-btn @click="kineticClick">Kinetic style Presentation</v-btn>
        </div>
    </div>
</template>

<script>
import ProjectCreator from '../../project-creator';
import { mapState } from 'vuex';
export default {
    computed: mapState(['project', 'steps']),
    methods: {
        classicClick(){
            this.createProject('classic');
        },
        kineticClick(){
            this.createProject('kinetic');
        },
        createProject(type){
            const project = ProjectCreator.create(type);
            this.patchObject(this.project, project);
            this.steps.current = 'editor';
        },
        patchObject(obj, patch){
            for(let prop in patch){
                obj[prop] = patch[prop];
            }
        }
    },
    created(){
        this.createProject('classic');
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
        h1{
            margin-bottom: 50px;
        }
        button{
            height: 80px;
            width: 350px;
            font-weight: bold;
            font-size: 15px;
            color: #555;
        }
    }
}
</style>