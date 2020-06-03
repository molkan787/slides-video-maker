<template>
    <div class="root">
        <!-- <TextSpliter /> -->
        <!-- <TextItemsEditor /> -->
        <DesignSetting />
    </div>
</template>

<script>
import TextSpliter from './dashboard/TextSpliter';
import TextItemsEditor from './dashboard/TextitemsEditor';
import DesignSetting from './design-setting/DesignSetting';
export default {
    components: {
        TextSpliter,
        TextItemsEditor,
        DesignSetting
    },
    data:() => ({
        
    })
}
</script>

<style lang="scss" scoped>
div.root{
    width: 100%;
    height: 100%;
    padding: 50px;
    color: black;
}
</style>