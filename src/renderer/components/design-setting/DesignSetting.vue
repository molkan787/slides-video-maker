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

            </template>
        </div>
        <div class="subheader">Select template</div>
        <div class="body">
            <template v-if="type == 'classic'">
                <TemplateItem name="Color" :colorSlotsCount="1" :active="selected == classicSlides.color"
                    @click="setSelected(classicSlides.color)" :colors="pallet.colorSlide">
                    <ClassicSlide :data="classicSlides.color" :zoom="slideZoom" />
                </TemplateItem>
                <TemplateItem name="Gradient" :colorSlotsCount="2" :active="selected == classicSlides.gradient"
                    @click="setSelected(classicSlides.gradient)" :colors="pallet.gradientSlide">
                    <ClassicSlide :data="classicSlides.gradient" :zoom="slideZoom" />
                </TemplateItem>
            </template>
            <template v-else-if="type == 'kinetic'">
                <TemplateItem name="Template 1" :active="selected == classicSlides.color"
                    @click="setSelected(classicSlides.color)" :colors="pallet.colorSlide">
                    <KineticSlide :data="kineticSlides.template1" :zoom="slideZoom"  />
                </TemplateItem>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import TemplateItem from './TemplateItem';
import ClassicSlide from '../presentation-editor/ClassicSlide';
import KineticSlide from '../presentation-editor/KineticSlide';
export default {
    components: {
        TemplateItem,
        ClassicSlide,
        KineticSlide
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

        selected: null,

        classicSlides: {
            color: {
                content: [
                    {
                        rect: {
                            x: 0, y: 185,
                            width: 800,
                            height: 80
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
        },
        kineticSlides: {
            template1: {
                content: [
                    'SOME TITLE',
                    'LOREM IPSUM IS DUMMY!',
                    'JUST ANOTHER!'
                ],
                template: 'template-1'
            }
        },
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
            this.selected = slide;
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
                    background: this.selected.background,
                } : [
                    'template-1',
                    'template-2'
                ];
                return template;
            }else{
                alert('Please select a template');
                return null;
            }
        }
    },
    created(){
        const gradientSlide = Object.clone(this.classicSlides.color);
        gradientSlide.content[0].content.text = 'Gradient';
        gradientSlide.background = { type: 'css', css: '' };
        this.classicSlides.gradient = gradientSlide;
        this.updateGradientSlide();
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
    display: inline-block;
    width: 200px;
}
</style>