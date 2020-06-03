<template>
    <div @click="click" class="color-button" :style="style" title="Select color"></div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: '#fff',
        },
        width: {
            type: String,
            default: '25px'
        }
    },
    watch: {
        value(){
            this.color = this.value;
        }
    },
    computed: {
        style(){
            return {
                'background-color': this.color,
                'width': this.width,
                'height': this.width,
            }
        }
    },
    data:() => ({
        color: null,
    }),
    methods: {
        async click(e){
            const color = await promptColor(this.color);
            if(color != null){
                this.color = color;
                this.$emit('input', color);
            }
        }
    },
    mounted(){
        this.color = this.value;
    }
}
</script>

<style scoped>
.color-button{
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid white;
    border-radius: 3px;
    box-shadow: 0 0 2px #444;
    cursor: pointer;
}
</style>