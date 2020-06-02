<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="300">
      <v-card>
        <!-- <v-card-title class="headline">{{ title }}</v-card-title> -->
        <v-color-picker v-model="currentColor" flat />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelClick">Cancel</v-btn>
          <v-btn color="primary" elevation="0" @click="okClick">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    data:() => ({
        open: false,
        currentColor: '#0f0'
    }),

    methods: {
        okClick(){
            this.open = false;
            const c = this.currentColor;
            this.resolve(typeof c == 'object' ? c.hex : c);
        },
        cancelClick(){
            this.open = false;
            this.resolve(null)
        },

        handleRequest(currentColor){
            this.currentColor = currentColor;            
            this.open = true;
        },

        promptColor(currentColor){
            return new Promise(resolve => {
                this.resolve = resolve;
                this.handleRequest(currentColor);
            });
        },
    },

    created(){
        window.promptColor = currentColor => this.promptColor(currentColor);
        // setTimeout(() => this.open = true, 500)
    }
}
</script>