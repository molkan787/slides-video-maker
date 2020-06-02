<template>
    <div class="root">
        <v-btn-toggle @change="optionsChanged" v-model="options" multiple >
        
            <v-btn color="white">
                <v-icon>mdi-format-italic</v-icon>
            </v-btn>

            <v-btn color="white">
                <v-icon>mdi-format-bold</v-icon>
            </v-btn>

            <v-btn color="white">
                <v-icon>mdi-format-underline</v-icon>
            </v-btn>

            <v-btn color="white">
                <v-row
                align="center"
                class="flex-column"
                justify="center"
                >
                <v-icon class="cols 12">mdi-format-color-text</v-icon>

                <v-sheet
                    tile
                    style="margin-top: -6px;"
                    height="6"
                    width="26"
                    :color="data.color || 'white'"
                ></v-sheet>
                </v-row>
            </v-btn>

        </v-btn-toggle>

        <v-btn-toggle v-model="data['text-align']" mandatory>
            <v-btn value="left" color="white">
                <v-icon>mdi-format-align-left</v-icon>
            </v-btn>

            <v-btn value="center" color="white">
                <v-icon>mdi-format-align-center</v-icon>
            </v-btn>

            <v-btn value="right" color="white">
                <v-icon>mdi-format-align-right</v-icon>
            </v-btn>
        </v-btn-toggle>
        
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true,
        }
    },
    watch: {
        // options(){
        //     this.optionsChanged();
        // },
        alignment(){
            console.log('alignment', this.alignment)
        },
        data: {
            deep: false,
            handler(){
                this.updateOptions();
            }
        }
    },
    data:() => ({
        options: [],
        alignment: null,
        lockNext: false,
    }),
    methods: {
        optionsChanged(){
            const o = this.options;
            const colorOptionIndex = o.indexOf(3);
            if(colorOptionIndex >= 0){
                o.splice(colorOptionIndex, 1)
                this.openColorPicker();
                return;
            }else{
                this.updateStyles();
            }
        },
        async openColorPicker(){
            const color = await promptColor(this.data.color);
            if(color){
                this.$set(this.data, 'color', color);
            }
        },
        updateStyles(){
            const o = this.options;
            const s = this.data;
            const currentlyBold = s['font-weight'] == 'bold';
            const currentlyItalic = s['font-style'] == 'italic';
            const italic = o.indexOf(0) >= 0;
            const bold = o.indexOf(1) >= 0;
            const underline = o.indexOf(2) >= 0;
            this.$set(s, 'font-style', italic ? 'italic' : 'normal');
            this.$set(s, 'font-weight', bold ? 'bold' : 'normal');
            this.$set(s, 'text-decoration', underline ? 'underline' : 'none');
            if((currentlyBold !== bold) || (currentlyItalic !== italic)){
                this.$emit('sizeChangingStyleChange');
            }
        },
        updateOptions(){
            const o = this.options;
            const s = this.data;
            const italic = s['font-style'] == 'italic';
            const bold = s['font-weight'] == 'bold';
            const underline = s['text-decoration'] == 'underline';
            o.splice(0, o.length);
            this.$nextTick(() => {
                if(italic) o.push(0);
                if(bold) o.push(1);
                if(underline) o.push(2);
            })
        }
    },
    mounted(){
        this.updateOptions();
    }
}
</script>

<style lang="scss" scoped>
div.root{
    display: inline-block;
}
button{
    height: 40px !important;
    width: 44px !important;
    *{
        cursor: pointer !important;
    }
}
.v-sheet{
    border: 1px solid #888 !important;
}
</style>