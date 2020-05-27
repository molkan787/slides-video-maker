<template>
    <div class="root">
        <CLassicSlideEditor :items="items"/>
    </div>
</template>

<script>
import CLassicSlideEditor from './presentation-editor/ClassicSlideEditor';
export default {
    components: {
        CLassicSlideEditor
    },
    data:() => ({
        items: [
            {
                rect: {
                    x: 0, y: 0,
                    width: 100,
                    height: 150
                }
            },
            {
                rect: {
                    x: 250, y: 70,
                    width: 100,
                    height: 60
                }
            }
        ]
    })
}
</script>

<style scoped>
div.root{
    padding: 50px;
    height: 100%;
}
</style>