<template>
    <div class="root-pane v-card">
        <div class="header" v-if="type == 'classic'">
            <template>

                <v-select :items="app.animations" v-model="animation" class="myinput"
                label="Slides Transition" outlined filled dense hide-details background-color="grey lighten-5" menu-props="auto" />

                <v-autocomplete :items="app.fontsList" v-model="fontFamily" class="myinput" label="Font Name" placeholder="Default"
                 outlined filled dense hide-details background-color="grey lighten-5" no-data-text="Font not found" menu-props="auto"/>

                <v-select :items="app.fontSizes" v-model="fontSize" class="myinput m2 small" label="Font Size"
                 outlined filled dense hide-details background-color="grey lighten-5" placeholder="42" menu-props="auto" />

                <!-- <ColorButton v-model="textColor"/> -->
                <ColorInput v-model="textColor" label="Text Color" class="myinput color" />

            </template>
        </div>
        <div class="subheader">Select template</div>
        <div class="body">
            <template v-if="type == 'classic'">

                <TemplateItem name="Image" :active="selected == classicSlides.image"
                    @click="setSelected(classicSlides.image)">
                    <ClassicSlide :data="classicSlides.image" :zoom="slideZoom" />
                </TemplateItem>
                <TemplateItem name="Color" :colorSlotsCount="1" :active="selected == classicSlides.color"
                    @click="setSelected(classicSlides.color)" :colors="pallet.colorSlide">
                    <ClassicSlide :data="classicSlides.color" :zoom="slideZoom" />
                </TemplateItem>
                <TemplateItem name="Gradient" :colorSlotsCount="2" :active="selected == classicSlides.gradient"
                    @click="setSelected(classicSlides.gradient)" :colors="pallet.gradientSlide">
                    <ClassicSlide :data="classicSlides.gradient" :zoom="slideZoom" />
                </TemplateItem>
                <TemplateItem v-for="(slide, index) in classicSlides.others" :key="'ot' + index"
                    :name="'Template ' + (index + 1)" :active="selected == slide"
                    @click="setSelected(slide)">
                    <ClassicSlide :data="slide" :zoom="slideZoom" />
                </TemplateItem>

            </template>
            <template v-else-if="type == 'kinetic'">
                <TemplateItem v-for="slide in kineticSlides" :key="slide.data_name" :name="slide.data_name"
                    :active="selected == slide" @click="setSelected(slide)">
                    <KineticSlide :data="slide" :zoom="slideZoom"  />
                </TemplateItem>
            </template>
        </div>
    </div>
</template>

<script>
import Editor from '../../editor';
import { mapState } from 'vuex';
import TemplateItem from './TemplateItem';
import ClassicSlide from '../presentation-editor/ClassicSlide';
import KineticSlide from '../presentation-editor/KineticSlide';
import ColorInput from '../helpers/ColorInput';
export default {
    components: {
        TemplateItem,
        ClassicSlide,
        KineticSlide,
        ColorInput
    },
    computed: mapState({
        app: state => state.app,
        steps: state => state.steps,
        type: state => state.project.type,
    }),
    data:() => ({
        slideZoom: 0.2375,
        animation: 'fade',
        fontFamily: 'Arial',
        fontSize: '62.5px',
        textColor: '#ffffff',

        selected: null,

        classicSlides: {
            color: {
                content: [
                    {
                        rect: {
                            x: 0, y: 185,
                            width: 800,
                            height: 100
                        },
                        content: {
                            type: 'text',
                            text: 'Color',
                            style: {
                                'color': 'white',
                                'text-align': 'center',
                                'font-size': '80px',
                                'font-family': '"Roboto", sans-serif',
                            }
                        }
                    },
                ],
                background: {
                    type: 'color',
                    color: '#1ebed8'
                }
            },
            gradient: null,
            image: null,
            others: [],
        },
        kineticSlides: [
            {
                content: [
                    'SOME TITLE',
                    'LOREM IPSUM IS DUMMY!',
                    'JUST ANOTHER!'
                ],
                template: 'template-1',
                data_name: 'Board 1',
                data_templates: [
                    'template-1',
                    'template-2'
                ]
            },
            {
                content: [
                    'Heavy One',
                    'Is more heavy',
                ],
                template: 'heavy-1',
                data_name: 'Heavy 1',
                data_templates: [
                    'heavy-1',
                ]
            }
        ],
        pallet: {
            colorSlide: ['#1EBED8'],
            gradientSlide: ['#1EBED8', '#1467AB'],
        }
    }),
    watch: {
        'pallet.colorSlide'(){
            this.updateColorSlide();
        },
        'pallet.gradientSlide'(){
            this.updateGradientSlide();
        }
    },
    methods: {
        setSelected(slide){
            if(slide == this.classicSlides.image){
                this.updateImageSlide();
            }
            this.selected = slide;
        },
        async updateImageSlide(){
            const data = await Editor.promptImage();
            if(data){
                this.classicSlides.image.background.src = data.filename;
            }
        },
        updateColorSlide(){
            this.classicSlides.color.background.color = this.pallet.colorSlide[0];
        },
        updateGradientSlide(){
            const [ color1, color2 ] = this.pallet.gradientSlide;
            const css = `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`;
            this.classicSlides.gradient.background.css = css;
        },
        getTemplate(){
            if(this.selected){
                const template = this.type == 'classic' ? {
                    animation: this.animation,
                    fontFamily: this.fontFamily,
                    fontSize: this.fontSize,
                    textColor: this.textColor,
                    background: this.selected.background,
                } : this.selected.data_templates;
                return template;
            }else{
                alert('Please select a template');
                return null;
            }
        },

        loadClassicTemplates(){
            const result = [];
            const template = { content: [], background: { type: 'image', src: '' } };
            template.content = [];
            for(let i = 1; i <= 4; i++){
                const slide = Object.clone(template);
                slide.background.src = Editor.resolveAssetsPath('templates', 'classic', `template-${i}.png`);
                result.push(slide);
            }
            this.classicSlides.others = result;
        }
    },
    created(){
        if(this.type == 'classic'){
            const gradientSlide = Object.clone(this.classicSlides.color);
            gradientSlide.content[0].content.text = 'Gradient';
            gradientSlide.background = { type: 'css', css: '' };
            this.classicSlides.gradient = gradientSlide;

            const imageSlide = Object.clone(this.classicSlides.color);
            imageSlide.background = {
                type: 'image',
                src: Editor.resolveAssetsPath('images', 'picture.png')
            };
            imageSlide.content[0].content.text = 'Image';
            this.classicSlides.image = imageSlide;

            this.updateGradientSlide();
            this.loadClassicTemplates();
        }
    }
}
</script>

<style lang="scss" scoped>
.root-pane{
    background-color: white;
    width: 100%;
    height: 100%;
    // box-shadow: 0 0 2px #444;
    padding: 20px;
}
$headerHeight: 50px;
$subHeaderHeight: 30px;
.header{
    height: $headerHeight;
}
.subheader{
    height: $subHeaderHeight;
    padding-left: 4px;
    font-size: 20px;
    color: #444;
}
.body{
    box-sizing: border-box;
    height: calc(100% - #{$headerHeight + $subHeaderHeight});
    padding-top: 10px;
}
.myinput{
    float: left;
    display: inline-block;
    width: 200px;
    margin-right: 5px !important;
    &.color{
        width: 90px;
    }
}
</style>