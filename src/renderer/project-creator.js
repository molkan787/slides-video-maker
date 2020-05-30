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
                        width: 200,
                        height: 50
                    },
                    content: {
                        type: 'text',
                        text: 'New slide',
                        style: {
                            'color': 'white',
                            'text-align': 'center',
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
        return {
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
            slides: [createSlide()],
            audioFilename: '',
            timeline: {
                duration: 30000,
            }
        }
    }

    static cloneObject(obj){
        return JSON.parse(JSON.stringify(obj));
    }

}