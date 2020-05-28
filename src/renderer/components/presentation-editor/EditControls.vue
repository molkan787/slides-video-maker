<template>
    <div class="pa-2 elevation-1">
        <v-btn fab dark small color="primary" elevation="2">
            <v-icon dark>mdi-text</v-icon>
        </v-btn>
        <v-btn fab dark small color="primary" elevation="2" class="mt-2">
            <v-icon dark>mdi-image</v-icon>
        </v-btn>
    </div>
</template>

<style scoped>
div{
    width: 55px;
    height: 100%;
    margin-left: -55px;
    position: absolute;
    z-index: 1;
    border-radius: 0 !important;
    text-align: center;
}
</style>