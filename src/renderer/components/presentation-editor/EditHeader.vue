<template>
    <div>
        <v-select :items="animations" v-model="item.animation" value="fade" class="myinput"
            label="Slide Transition" outlined dense hide-details background-color="white"
            :disabled="type !== 'classic'" :style="{ opacity: type == 'classic' ? 1 : 0 }"/>

        <v-btn @click="$emit('deleteClick')" :disabled="!canDelete"
            color="red lighten-2" class="mybtn ml-2 white--text" small fab elevation="0" title="Delete current slide">
            <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn @click="$emit('duplicateClick')"
            color="blue lighten-2" class="mybtn ml-2 white--text" small fab elevation="0" title="Duplicate current slide">
            <v-icon>mdi-file</v-icon>
        </v-btn>
        <template v-if="type == 'classic'">
            <div class="vertical-bar-divider mybtn ml-2"></div>
            <v-btn @click="$emit('addTextClick')" class="mybtn ml-2" fab dark small color="primary" elevation="0" title="Add text">
                <v-icon dark>mdi-text</v-icon>
            </v-btn>
            <v-btn @click="$emit('addImageClick')" class="mybtn ml-2" fab dark small color="primary" elevation="0" title="Add image">
                <v-icon dark>mdi-image</v-icon>
            </v-btn>
        </template>

    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true,
        },
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
.vertical-bar-divider{
    display: inline-block;
    box-sizing: border-box;
    width: 2px;
    height: 28px;
    padding: 10px 0px;
    background-color: #ddd;
    transform: translateY(6px);
}
</style>