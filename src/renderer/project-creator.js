export default class ProjectCreator{

    static create(type){
        return type == 'classic' ? this.createClassicProject() : this.createKineticProject();
    }

    static createClassicProject(){
        const slide = {
            content: [
                {
                    rect: {
                        x: 300, y: 200,
                        width: 206,
                        height: 38
                    },
                    content: {
                        type: 'text',
                        text: 'New slide',
                        style: {
                            'color': 'white',
                            'text-align': 'center',
                            'font-size': '26.25px',
                            'font-family': '"Roboto", sans-serif',
                        }
                    }
                },
            ],
            background: {
                type: 'color',
                color: '#1ED760'
            },
            animation: 'zoom',
        };
        const createSlide = () => this.cloneObject(slide);
        return {
            type: 'classic',
            template: {
                createNewSlide(positionIndex){
                    return createSlide();
                }
            },
            slides: [createSlide()],
            audioFilename: '',
            timeline: {
                duration: 30000,
            }
        }
    }

    static createKineticProject(){
        const slide = {
            content: [
                'SOME TITLE',
                'LOREM IPSUM IS DUMMY!',
                'JUST ANOTHER!'
            ],
            template: 'template-1',
            duration: 5000,
        };
        const createSlide = () => this.cloneObject(slide);
        const project = {
            type: 'kinetic',
            template: {
                templates: [
                    'template-1',
                    'template-2'
                ],
                createNewSlide(positionIndex){
                    const _slide = createSlide();
                    _slide.template = this.templates[positionIndex % this.templates.length];
                    return _slide;
                }
            },
            slides: [],
            audioFilename: '',
            timeline: {
                duration: 30000,
            }
        };
        for(let i = 0; i < project.template.templates.length; i++){
            project.slides.push(project.template.createNewSlide(i));
        }
        return project;
    }

    static cloneObject(obj){
        return JSON.parse(JSON.stringify(obj));
    }

}