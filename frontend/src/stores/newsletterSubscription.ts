import {defineStore} from 'pinia';
import apiClient from "@/config/axios.ts";
import {z} from 'zod';

export const NewsletterSubscriptionSchema = z.object({
    id: z.number(),
    subscribed: z.boolean(),
    userId: z.number(),
});
export type NewsletterSubscription = z.infer<typeof NewsletterSubscriptionSchema>;

export const useNewsletterSubscriptionStore = defineStore('newsletter_subscription', {
    state() {
        return {
            loading: false,
            error: '',
            newsletterSubscription: null as NewsletterSubscription | null,
        }
    },

    actions: {
        clearState() {
            this.loading = false;
            this.error = '';
            this.newsletterSubscription = null;
        },
        async fetchNewsletterSubscription() {
            this.loading = true;
            this.error = '';

            try {
                const response = await apiClient.get('/alerts/subscription');
                if (!response.data) {
                    this.newsletterSubscription = null;
                    return;
                }
                this.newsletterSubscription = NewsletterSubscriptionSchema.parse(response.data);
            } catch (error) {
                console.error(error);
                this.error = error.response.data;
            }

            this.loading = false;
        },
        async saveNewsletterSubscription(value: boolean) {
            this.loading = true;
            this.error = '';

            try {
                const response = await apiClient.post('/newsletters/subscription', {
                    subscribed: value,
                });
                this.newsletterSubscription = NewsletterSubscriptionSchema.parse(response.data);
            } catch (error) {
                console.error(error);
                this.error = error.response.data;
            }

            this.loading = false;
        },
    },
});