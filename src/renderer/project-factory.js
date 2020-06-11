export default class ProjectFactory{

    static create(type, template, rawSlides){
        return type == 'classic' ?
            this.createClassicProject(template, rawSlides):
            this.createKineticProject(template, rawSlides);
    }

    static createClassicProject(template, rawSlides){
        const { background, animation, fontFamily, fontSize, textColor } = template;
        const defaultText = 'New slide';
        const _fontFamily = fontFamily || 'Roboto, sans-serif';
        const _fontSize = fontSize || '26.25px';
        const item = {
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
        };
        const slide = {
            content: [ Object.clone(item) ],
            background,
            animation,
        };
        const project = {
            type: 'classic',
            template: {
                item,
                slide,
                createItem(){
                    return Object.clone(this.item);
                },
                createNewSlide(positionIndex){
                    return Object.clone(this.slide);
                }
            },
            slides: [],
            audioFilename: '',
            timeline: {
                duration: -1,
            }
        }
        if(rawSlides){
            for(let slideStr of rawSlides){
                const slide = project.template.createNewSlide();
                const contentItem = slide.content[0];
                contentItem.content.text = slideStr;
                contentItem.rect = this.calcCenteredItemRect(slideStr, _fontFamily, _fontSize);
                project.slides.push(slide);
            }
        }else{
            project.slides.push(project.template.createNewSlide());
        }
        return project;
    }

    static createKineticProject(templates, rawSlides){
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
                duration: -1,
            }
        };
        if(rawSlides){
            for(let i = 0; i < rawSlides.length; i++){
                const slideStr = rawSlides[i];
                const lines = slideStr.split('\n');
                const slide = project.template.createNewSlide(i);
                slide.content = lines;
                project.slides.push(slide);
            }
        }else{
            for(let i = 0; i < project.template.templates.length; i++){
                project.slides.push(project.template.createNewSlide(i));
            }
        }
        return project;
    }

    // ============== Helpers ==============

    static calcCenteredItemRect(text, fontFamily, fontSize){
        const cWidth = 800, cHeight = 450;
        let { width, height } = calcTextSize(text, {
            'font-family': fontFamily,
            'font-size': fontSize
        }, { maxWidth: 800 });
        width *= 1.05;
        height *= 1.05;
        const x = (cWidth - width) / 2;
        const y = (cHeight - height) / 2;
        return {
            x, y,
            width,
            height,
        }
    }

}