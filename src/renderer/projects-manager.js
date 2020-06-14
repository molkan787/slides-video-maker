import electron from 'electron';
import path from 'path';
import { JSONfn } from 'jsonfn';
import { readDir, readTextFile, writeFile, prepareFolder, deleteFile } from './fs-helpers';
import store from './store';

const app = electron.remote.app;
const PROJECTS_DIR = path.join(app.getPath('userData'), 'Projects');
const PROJECT_FILE_EXTENSION = '.json';
export default class ProjectsManager{

    static addProjectToList(name){
        const index = this.projectsList.indexOf(name);
        if(index == -1){
            this.projectsList.push(name);
        }
    }

    static async deleteProject(name){
        const filename = path.join(PROJECTS_DIR, name + PROJECT_FILE_EXTENSION);
        await deleteFile(filename);
        const index = this.projectsList.indexOf(name);
        this.projectsList.splice(index, 1);
    }

    static async getProjectsList(){
        if(this.projectsList) return this.projectsList
        const files = await readDir(PROJECTS_DIR);
        this.projectsList = files.map(f => f.split('.')[0]);
        return this.projectsList;
    }
    
    static async saveCurrentProject(){
        const data = store.state.project;
        const jsonData = JSONfn.stringify(data);
        await prepareFolder(PROJECTS_DIR);
        const filename = path.join(PROJECTS_DIR, data.name + PROJECT_FILE_EXTENSION);
        await writeFile(filename, jsonData);
        this.addProjectToList(data.name);
        return true;
    }

    static async loadProject(name){
        const filename = path.join(PROJECTS_DIR, name + PROJECT_FILE_EXTENSION);
        const jsonData = await readTextFile(filename);
        const data = JSONfn.parse(jsonData);
        store.dispatch('setProject', data);
        return true;
    }

    static checkProjectName(name){
        name = name && name.trim();
        if(typeof name != 'string' || name.length < 1){
            throw 'empty_name';
        }
        if((/[^a-z0-9 ]/gi).test(name)){
            throw 'illegal_character';
        }
        const _name = name.toLowerCase();
        const arr = this.projectsList;
        const l = arr.length;
        for(let i = 0; i < l; i++){
            if(arr[i].toLowerCase() == _name){
                throw 'name_exist';
            }
        }
        return true;
    }

}

ProjectsManager.PROJECTS_DIR = PROJECTS_DIR;
window.ProjectsManager = ProjectsManager;