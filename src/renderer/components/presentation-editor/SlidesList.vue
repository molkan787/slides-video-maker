<template>
    <div class="root">
        <div class="header">
            <v-btn @click="addnew"
                color="blue lighten-2" class="mybtn white--text" small fab elevation="0" title="Add new slide">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn @click="duplicateCurrentSlide"
                color="blue lighten-2" class="mybtn white--text" small fab elevation="0" title="Duplicate current slide">
                <v-icon>mdi-file</v-icon>
            </v-btn>
            <v-btn @click="deleteCurrentSlide" :disabled="items.length < 2"
                color="red lighten-2" class="mybtn white--text" small fab elevation="0" title="Delete current slide">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </div>
        <div class="contentWrapper">
            <SlideItem v-for="(item, index) in items" :key="index"
                :item="item" :active="item == pvalue" @click="itemClick" :type="type" />
            <div class="addnew" v-ripple @click="addnew">
                <v-icon large>mdi-plus</v-icon>
            </div>
        </div>
    </div>
</template>

<script>
import SlideItem from './SlideItem';
export default {
    components: {
        SlideItem
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        template: {
            type: Object,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        value: Object,
    },
    watch: {
        value(){
            this.pvalue = this.value;
        }
    },
    data:() => ({
        pvalue: null,
    }),
    methods: {
        itemClick(item){
            this.pvalue = item;
            this.$emit('input', item);
        },
        addnew(){
            const item = this.template.createNewSlide(this.items.length);
            this.items.push(item);
            this.itemClick(item);
        },
        deleteCurrentSlide(){
            const index = this.items.indexOf(this.pvalue);
            if(index >= 0){
                this.items.splice(index, 1);
                this.selectNearestItem(index);
            }
        },
        duplicateCurrentSlide(){
            const index = this.items.indexOf(this.pvalue);
            if(index >= 0){
                const cloned = JSON.parse(JSON.stringify(this.pvalue));
                this.$set(cloned, 'checked', false);
                this.items.splice(index + 1, 0, cloned);
                this.itemClick(cloned);
            }
        },
        selectNearestItem(currentIndex){
            const newIndex = currentIndex == 0 ? 0 : currentIndex - 1;
            this.itemClick(this.items[newIndex]);
        },
    },
    mounted(){
        this.pvalue = this.value;
    }
}
</script>

<style lang="scss" scoped>
.root{
    height: 100%;
    overflow: hidden;
}
$headerHeight: 56px;
.header{
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    height: $headerHeight;
    box-shadow: 0 0 2px #000000a3;
    padding: 8px;
    text-align: right;
}
.contentWrapper{
    width: 100%;
    height: calc(100% - #{$headerHeight});
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 5px;
}
.addnew{
    margin-top: 4px;
    width: 100%;
    height: 120px;
    background-color: rgb(243, 243, 243);
    border-radius: 3px;
    text-align: center;
    padding: 38px;
    cursor: pointer !important;
}
</style>
