<template>
  <v-app>
    <!-- <HomePage />
    <PublishDialog /> -->
    <Test />
    <Dialog />
  </v-app>
</template>

<script>
import HomePage from './components/HomePage';
import Dialog from './components/Dialog';
import PublishDialog from './components/PublishDialog';
import Test from './components/Test';

export default {
  name: 'App',

  components: {
    HomePage,
    Dialog,
    PublishDialog,
    Test
  },

  data: () => ({
    //
  }),
};
</script>

<style scoped>
.content{
  padding: 20px;
  height: 100%;
}
</style>

<style>
html, body, .v-application{
  overflow: hidden !important;
  height: 100%;
}
*:not(input){
  user-select: none;
}
h1, h2, h3, h4, h5, h6, div, p, span:not(.v-btn__content), label{
  cursor: default;
}
.v-list-item, .v-list-item div, .v-select__selections, .v-select__selection{
  cursor: pointer !important;
}
</style>