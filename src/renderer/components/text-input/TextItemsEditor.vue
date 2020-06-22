<template>
    <div class="root">
        <h4>Review/Adjust your slides</h4>
        <div class="body">
            <Draggable :list="items" handle=".handle">
                <div v-for="(item, index) in items" :key="index" class="item">
                    <textarea v-model="items[index]"></textarea>
                    <div class="controls">
                        <div class="handle">
                            <v-icon>mdi-apps</v-icon>
                        </div>
                        <div @click="deleteItem(index)" class="delete-btn" title="Remove slide">
                            <v-icon>mdi-delete</v-icon>
                        </div>
                    </div>
                </div>
            </Draggable>
        </div>
        <div class="footer">
            <v-btn class="primary-button" elevation="0" dark @click="items.push('')">Add new slide</v-btn>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable';
export default {
    components: {
        Draggable
    },
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    methods: {
        deleteItem(index){
            this.items.splice(index, 1);
        }
    }
}
</script>

<style lang="scss" scoped>
.root{
    background-color: white;
    width: 100%;
    height: 100%;
    // box-shadow: 0 0 2px #444;
}
$headerHeight: 30px;
$footerHeight: 50px;
.body{
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - #{$footerHeight + $headerHeight});
    overflow-y: scroll;
    padding: 5px;
    // background-color: rgb(243, 243, 243);
    border-radius: 3px;
}
.footer{
    width: 100%;
    height: $footerHeight;
    padding: 7px 5px 5px 5px;
    display: block;
    text-align: left;
}
h4{
    height: $headerHeight;
    margin: 0;
    color: #808080;
    font-size: 15px;
}
.item{
    $controls-width: 30px;
    box-sizing: border-box;
    margin-bottom: 5px;
    width: 100%;
    height: 60px;
    border: 1px solid rgb(185, 185, 185);
    border-radius: 3px;
    background-color: white;
    color: rgb(59, 59, 59);
    font-weight: bold;
    overflow: hidden;
    textarea{
        box-sizing: border-box;
        width: calc(100% - #{$controls-width});
        height: 100%;
        padding: 6px;
        resize: none;
        border: none;
    }
    .controls{
        display: inline-block;
        float: left;
        width: $controls-width;
        height: 100%;
        background-color: #eaeaea;
        div{
            display: inline-block;
            width: 100%;
            height: 50%;
            text-align: center;
            &.handle{
                cursor: move;
            }
            &.delete-btn{
                cursor: pointer;
            }
            i{
                font-size: 20px;
            }
        }
    }
}
</style>