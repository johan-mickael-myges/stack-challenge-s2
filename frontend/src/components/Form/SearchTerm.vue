<template>
  <div>
    <v-text-field
        v-model="searchTerm"
        @input="emitSelectedValues"
        dense
        placeholder="Rechercher"
        @change="emitSelectedValues"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';


export default defineComponent({
  name: 'SearchTerm',
  emits: ['update-values'],
  setup(props, {emit}) {
    const searchTerm = ref<string>('');

    const emitSelectedValues = () => {
      emit('update-values', searchTerm.value);
    };

    return {
      searchTerm,
      emitSelectedValues,
    };
  },
});
</script>
