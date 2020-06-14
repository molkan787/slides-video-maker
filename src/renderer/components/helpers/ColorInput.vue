<template>
  <div class="v-input v-input--hide-details v-input--is-label-active v-input--is-dirty v-input--dense theme--light v-text-field v-text-field--filled v-text-field--is-booted v-text-field--enclosed v-text-field--outlined">
    <div class="v-input__control">
      <div class="v-input__slot">
        <fieldset aria-hidden="true">
          <legend style="width: 60.75px;">
            <span>​</span>
          </legend>
        </fieldset>
        <div class="v-text-field__slot">
          <label
            for="color-input-57"
            class="v-label v-label--active theme--light"
            style="left: 0px; right: auto; position: absolute;">{{ label }}</label>
            <ColorButton class="color-button" :value="value" @input="$emit('input', $event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorButton from './ColorButton';
export default {
    components: {
        ColorButton
    },
    props: {
        value: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: 'Color',
        }
    }
}
</script>

<style scoped>
.color-button{
    width: 100% !important;
    height: 24px !important;
    box-shadow: none !important;
    margin-top: 2px !important;
}
</style>