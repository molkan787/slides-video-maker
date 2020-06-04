<template>
    <div class="text-input-root">
        <TextSpliter v-if="step == 'split'" ref="spliter"/>
        <TextItemsEditor v-else-if="step == 'edit'" ref="editor" :items="items"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import TextSpliter from './TextSpliter';
import TextItemsEditor from './TextItemsEditor';
export default {
    components: {
        TextSpliter,
        TextItemsEditor
    },
    computed: mapState(['app']),
    data:() => ({
        step: 'split',
        items: [],
    }),
    methods: {
        back(){
            return false;
        },

        next(){
            return this.step == 'split' ? this.splitNext() : this.editNext();
        },

        splitNext(){
            const items = this.$refs.spliter.getItems();
            if(items.length){
                this.items = items;
                this.step = 'edit';
            }else{
                alert('Please enter at least one item');
            }
            return true;
        },
        editNext(){
            const items = this.items.map(it => it.trim()).filter(it => it.length);
            if(items.length){
                this.app.rawSlides = items;
                return false;
            }else{
                alert('Please enter at least one item');
                return true;
            }
        }
    }
}
</script>

<style scoped>
.text-input-root{
    width: 100%;
    height: 100%;
}
</style>