<template>
    <v-autocomplete
      :items="items"
      density="comfortable"
      placeholder="rechercher"
      prepend-inner-icon="mdi-magnify"
      theme="light"
      variant="solo"
      auto-select-first
      item-props
      :rounded="rounded"
    ></v-autocomplete>
</template>
  
<script>
  export default {
    name: 'CustomAutocomplete',
    props: {
      items: {
        type: Array,
        required: true
      },
      rounded: {
        type: Boolean,
        default: false
      }
    }
  }
</script>