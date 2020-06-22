<template>
    <div id="style-selector-root">
        <span>Choose Your Style</span>
        <div class="content-wrapper">
            <img src="@/assets/images/ez_classic.png" alt="">
            <img src="@/assets/images/ez_kinetic.png" alt="">
            <v-btn @click="selectType('classic')" large>Select</v-btn>
            <v-btn @click="selectType('kinetic')" large>Select</v-btn>
        </div>
    </div>
</template>

<script>
import Shell from '../shell';
export default {
    methods: {
        selectType(type){
            Shell.setProjectType(type);
            hideLoadingScreen();
        }
    },
    mounted(){
        this.$el.addEventListener('transitionend', () => {
            if(this.$el.style.opacity == 0){
                this.$el.style.display = 'none';
            }
        })
    }
}
</script>

<style lang="scss" scoped>
#style-selector-root{
    $height: 200px;
    position: fixed;
    z-index: 210;
    left: 0;
    top: 50%;
    margin-top: $height / -4;
    width: 100%;
    height: $height;
    padding-right: 30px;
    text-align: center;
    span{
        padding-left: 30px;
    }
    .content-wrapper{
        display: grid;
        width: 400px;
        height: 100%;
        margin: auto;
        margin-top: 15px;
        grid-template-columns: 50% 50%;
        grid-template-rows: auto 50px;
        column-gap: 30px;
        img{
            width: 100%;
        }
    }
    opacity: 0;
    transition: opacity 0.5s;
}
</style>