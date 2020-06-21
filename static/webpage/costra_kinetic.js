class CostraKinetic extends CostraFactory{

    constructor(element, options){
        super(element, options);
        this.namesapce = 'kinetic';
        this.templates = {
            'template-1': KineticTemplate1,
            'template-2': KineticTemplate1,
            'heavy-1': KineticHeavy1,
            'stretchy-1': KineticStretchy,
            'stretchy-2': KineticStretchy,
            'panes-1': KineticPanes,
            'panes-2': KineticPanes,
            'panes-3': KineticPanes,
        };
    }

    createSlide(data, outAnimation, delay){
        const el_id = this.createElement(data);
        return this.createAnimation(el_id, data, outAnimation, delay)
    }

    createElement(data){
        const { template } = data;
        const slideDiv = document.createElement('div');
        const backgroundDiv = document.createElement('div');
        const contentSection = document.createElement('section');
        slideDiv.className = `slide ${this.namesapce} ${template}`;
        slideDiv.appendChild(backgroundDiv);
        slideDiv.appendChild(contentSection);
        backgroundDiv.className = 'background';
        const id = this.genId();
        slideDiv.id = id;
        const templateBuilder = this.getTemplateBuiler(template);
        contentSection.innerHTML = templateBuilder.generateContentHTML(data);
        this.element.appendChild(slideDiv);
        return id;
    }

    createAnimation(elId, slide, outAnimation, delay){
        const { template } = slide;
        const templateBuilder = this.getTemplateBuiler(template);
        return templateBuilder.createAnimation(elId, slide, outAnimation, delay);        
    }

    getTemplateBuiler(name){
        const templateBuilder = this.templates[name];
        if(templateBuilder){
            return templateBuilder;
        }else{
            throw new Error(`Template builder "${name}" not found.`);
        }
    }


}