<template>
    <v-navigation-drawer class="mydrawer" absolute permanent left >
      <template v-slot:prepend>
        <h2 class="appname" style="color: #c6dadc !important;">Slides Video Maker</h2>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="(item, index) in items"
          :key="item.title"
          :class="{active: item.slug == current}"
          @click="itemClick(item)"
          :disabled="!available.includes(index)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
  export default {
    props: {
      current: {
        type: String,
        default: '',
      },
      available: {
        type: Array,
        default: () => []
      }
    },
    data:() => ({
        items: [
            { slug: 'dashboard', title: 'Dashboard', icon: 'mdi-home-city' },
            { slug: 'design-setting', title: 'Design Setting', icon: 'mdi-home-city' },
            { slug: 'editor', title: 'Editor', icon: 'mdi-home-city' },
            { slug: 'timeline', title: 'Timeline', icon: 'mdi-home-city' },
        ],
    }),
    methods: {
        itemClick(item){
          this.$emit('itemClick', item.slug);
        }
    }
  }
</script>

<style lang="scss">
.v-navigation-drawer.mydrawer{
    background: linear-gradient(180deg, #1A2476 0%, #0D1341 100%) !important;
    border: none !important;
    *{
        color: #5F6BC4 !important;
    }
    .v-list-item{
        text-transform: uppercase;
        width: 90%;
        margin: 0 0 0 10%;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        padding: 4px 16px;
        &.v-list-item--disabled{
          opacity: 0.5;
        }
        &.active{
            background-color: white;
            *{
                color: #374390 !important;
            }
            // $bw: 20px;
            // &:after,
            // &:before{
            //     content:'';
            //     width:$bw;
            //     height:$bw;
            //     position:absolute;
            //     bottom:-3px;
            //     border-top:0;
            // }
            // &:after{
            //     border-left: 0;
            //     border-radius: 0 0 20px 0;
            //     top: 6px -$bw;
            //     left: calc(100% - #{$bw} + 6px);
            //     border-bottom: 6px solid white;
            //     border-right: 6px solid white;
            // }
            // &:before{
            //     border-left:0;
            //     border-radius: 0 0 0 10px;
            //     top: calc(100% - #{$bw});
            //     left: calc(100% - #{$bw} + 6px);
            //     border-top: 6px solid white;
            //     border-right: 6px solid white;
            // }
        }
        .v-list-item__title{
            font-weight: bold !important;
            font-size: 16px;
        }
        .v-list-item__icon:first-child{
            margin-right: 15px !important;
        }
    }
}
.v-navigation-drawer__border{
    display: none !important;
}
h2.appname{
    color: #c6dadc !important;
    line-height: 1 !important;
    padding: 18px 20px !important;
    width: 100% !important;
    margin: 0 !important;
}
</style>