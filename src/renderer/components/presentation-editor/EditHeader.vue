<template>
    <div>
        <span class="leftTitle">Slide options:</span>
        <v-select :items="animations" v-model="item.animation" value="fade" class="myinput"
        label="Transition" outlined dense hide-details background-color="white"/>

        <v-btn @click="$emit('deleteClick')" :disabled="!canDelete"
            dark class="mybtn" small fab elevation="0" title="Delete current slide">
            <v-icon>mdi-delete</v-icon>
        </v-btn>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        canDelete: {
            type: Boolean,
            default: false,
        }
    },
    data:() => ({
        animations: [
            { value: 'fade', text: 'Fade'},
            { value: 'zoom', text: 'Zoom'},
            { value: 'slide', text: 'Slide'},
        ]
    })
}
</script>

<style scoped>
.leftTitle{
    font-size: 20px;
    margin-right: 10px;
}
.myinput{
    width: 200px;
    display: inline-block;
}
.mybtn{
    /* height: 100% !important; */
    float: right;
}
</style>