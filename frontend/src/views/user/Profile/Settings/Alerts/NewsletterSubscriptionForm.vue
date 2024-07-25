<template>
  <v-switch v-model="subscribed" density="comfortable" color="black" :label="label" @change="saveSubscription" />
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {useNewsletterSubscriptionStore} from "@/stores/newsletterSubscription.ts";

export default defineComponent({
  name: "NewsletterSubscriptionForm",
  setup() {
    const subscriptionStore = useNewsletterSubscriptionStore();
    const subscribed = ref(false);
    const label = ref("Je souhaite recevoir des mails de la part du site");

    onMounted(async () => {
      await subscriptionStore.fetchNewsletterSubscription();
      subscribed.value = subscriptionStore.newsletterSubscription?.subscribed ?? false;
    });

    watch(subscribed, (newVal) => {
      label.value = newVal
          ? "Je souhaite recevoir des mails de la part du site"
          : "Je ne souhaite pas recevoir des mails de la part du site";
    });

    const saveSubscription = async () => {
      await subscriptionStore.saveNewsletterSubscription(subscribed.value);
    };

    return {
      subscribed,
      label,
      saveSubscription
    };
  },
});
</script>