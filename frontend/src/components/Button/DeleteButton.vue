<template>
  <div class="flex">
    <v-btn v-bind="$attrs" @click="openModal">
    </v-btn>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="confirmDeletion" :disabled="loading">Oui</v-btn>
          <v-btn color="" @click="closeModal">Non</v-btn>
        </v-card-actions>
        <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
        <v-alert v-if="errorMessage" type="error" variant="tonal">{{ errorMessage }}</v-alert>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DeleteButton',
  props: {
    buttonText: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Confirmer la suppression',
    },
    message: {
      type: String,
      default: 'Êtes-vous sûr de vouloir supprimer cet élément?',
    },
    deleteFunction: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    const loading = ref(false);
    const errorMessage = ref('');

    const openModal = () => {
      dialog.value = true;
    };

    const closeModal = () => {
      dialog.value = false;
    };

    const confirmDeletion = async () => {
      loading.value = true;
      errorMessage.value = '';
      try {
        await props.deleteFunction();
        closeModal();
      } catch (error) {
        errorMessage.value = 'Une erreur s\'est produite lors de la tentative de suppression de l\'élément.';
      } finally {
        loading.value = false;
      }
    };

    return {
      dialog,
      loading,
      errorMessage,
      openModal,
      closeModal,
      confirmDeletion,
    };
  },
});
</script>
