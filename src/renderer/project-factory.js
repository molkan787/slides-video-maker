export default class ProjectFactory{

    static create(type, template){
        return type == 'classic' ? this.createClassicProject(template) : this.createKineticProject(template);
    }

    static createClassicProject(template){
        const { background, animation, fontFamily, fontSize, textColor } = template;
        const defaultText = 'New slide';
        const _fontFamily = fontFamily || '"Roboto", sans-serif';
        const _fontSize = fontSize || '26.25px';
        const slide = {
            content: [
                {
                    rect: this.calcCenteredItemRect(defaultText, _fontFamily, _fontSize),
                    content: {
                        type: 'text',
                        text: defaultText,
                        style: {
                            'color': textColor || 'white',
                            'text-align': 'center',
                            'font-size': _fontSize,
                            'font-family': _fontFamily,
                        }
                    }
                },
            ],
            background,
            animation,
        };
        const createSlide = () => Object.clone(slide);
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

    static createKineticProject(templates){
        const slide = {
            content: [
                'SOME TITLE',
                'LOREM IPSUM IS DUMMY!',
                'JUST ANOTHER!'
            ],
            template: '',
            duration: 5000,
        };
        const createSlide = () => Object.clone(slide);
        const project = {
            type: 'kinetic',
            template: {
                templates,
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

    // ============== Helpers ==============

    static calcCenteredItemRect(text, fontFamily, fontSize){
        const cWidth = 800, cHeight = 450;
        const { width, height } = calcTextSize(text, {
            'font-family': fontFamily,
            'font-size': fontSize
        });
        const x = (cWidth - width) / 2;
        const y = (cHeight - height) / 2;
        return {
            x, y,
            width,
            height,
        }
    }

}