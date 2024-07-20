<template>
  <v-file-input
      v-bind="$attrs"
      v-model="fileValue"
      class="mb-0 pb-0"
  />
  <filename
      v-if="!isFile && fileNameValue"
      :item="fileNameValue"
  />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from 'vue';
import Filename from './Filename.vue';

export default defineComponent({
  name: 'FileInput',
  components:{
    Filename,
  },
  props: {
    modelValue: {
      type: [String, File, Array],
      default: null,
    },
  },
  setup(props) {
    const isFile = computed(() => {
      if (props.modelValue instanceof File) {
        return true;
      }
      if (Array.isArray(props.modelValue) && props.modelValue.length > 0 && props.modelValue[0] instanceof File) {
        return true;
      }
      return false;
    });

    const fileValue = computed(() => {
      if (isFile.value) {
        return props.modelValue;
      }

      if (!isFile && null === props.modelValue) {
        return null;
      }
    });

    const fileNameValue = computed(() => {
      if (isFile.value) {
        return null;
      }

      if (Array.isArray(props.modelValue)) {
        return props.modelValue;
      }

      if (null === props.modelValue) {
        return null;
      }

      return [props.modelValue];
    });

    watch(() => props.modelValue, () => {
      if (!isFile.value) {
        fileValue.value = null;
      }

      if (isFile.value) {
        fileNameValue.value = null;
      }
    });

    return {
      isFile,
      fileValue,
      fileNameValue,
    };
  },
});
</script>
