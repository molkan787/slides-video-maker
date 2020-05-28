<template>
    <div class="root">
        <KineticSlide />
    </div>
</template>

<script>
import CLassicSlideEditor from './presentation-editor/ClassicSlideEditor';
import KineticSlide from './presentation-editor/KineticSlide';
export default {
    components: {
        CLassicSlideEditor,
        KineticSlide
    },
    data:() => ({
        items: [
            {
                rect: {
                    x: 0, y: 0,
                    width: 100,
                    height: 150
                },
                content: {
                    type: 'text',
                    text: 'New Header Text',
                    style: {
                        'font-size': '30px',
                        'color': 'skyblue',
                        'text-align': 'center'
                    }
                }
            },
            {
                rect: {
                    x: 250, y: 70,
                    width: 100,
                    height: 60
                },
                content: {
                    type: 'image',
                    src: __static + '\\images\\p2.png' 
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