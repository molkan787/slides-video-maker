<template>
    <div class="root">
        <SlideItem v-for="(item, index) in items" :key="index"
            :item="item" :active="item == pvalue" @click="itemClick" />
        <div class="addnew" v-ripple @click="addnew">
            <v-icon large>mdi-plus</v-icon>
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
            const item = {
                content: 'New Slide',
                animation: 'fade',
            };
            this.items.push(item);
            this.itemClick(item);
        }
    },
    mounted(){
        this.pvalue = this.value;
    }
}
</script>

<style scoped>
.root{
    height: 100%;
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
