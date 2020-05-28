<template>
    <div class="parent" @click="parentClick">
        <div class="textareaParent">
            <textarea v-model="item.content" ref="textarea" rows="1"
                oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    watch: {
        item(){
            this.$nextTick(() => this.$refs.textarea.oninput());
        }
    },
    methods:{
        parentClick(e){
            if(e.target.tagName != 'TEXTAREA'){
                this.$refs.textarea.focus();
            }
        }
    }
}
</script>

<style scoped>
.parent{
    display: table;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 25px;
    /* border: 1px solid #f0f0f0; */
    border-radius: 0 !important;
    font-size: 32px;
}
.textareaParent{
    display: table-cell;
    vertical-align: middle;
}
textarea{
    width: 100%;
    text-align: center;
    resize: none;
    outline: none;
}
</style>