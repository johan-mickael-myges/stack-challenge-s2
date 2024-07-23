import { defineStore } from 'pinia';
import {z} from 'zod';
import apiClient from '@/config/axios';

export const DeliveryEntitySchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    phoneNumber: z.string(),
    status: z.string(),
    shippingMethod: z.number(),
    orderId: z.number(),
})

export type DeliveryEntity = z.infer<typeof DeliveryEntitySchema>;

const DeliveryToCreateSchema = z.object({
    orderId: z.union([
        z.string().min(1, "L'identifiant de la commande est requise"),
        z.number()
            .positive("L'identifiant de la commande doit être un nombre positif")
            .int()
    ]),
    shippingMethodId: z.union([
        z.string().min(1, "L'identifiant de la méthode de livraison est requise"),
        z.number()
            .positive("Veuillez sélectionner une méthode de livraison")
            .int()
    ]),
    address: z.string()
        .min(2, "L'adresse doit au moins comporter 2 caractères")
        .max(255, "L'adresse doit comporter au maximum 255 caractères"),
    firstName: z.string()
        .min(2, "Le prénom doit au moins comporter 2 caractères")
        .max(255, "Le prénom doit comporter au maximum 255 caractères"),
    lastName: z.string()
        .min(2, "Le nom doit au moins comporter 2 caractères")
        .max(255, "Le nom doit comporter au maximum 255 caractères"),
    phoneNumber: z.string().optional(),
});
export type DeliveryToCreate = z.infer<typeof DeliveryToCreateSchema>;

export const DeliveryInformationsSchema = z.object({
    firstName: z.string().nonempty("Le prénom est requis").max(255, "Le prénom doit comporter au maximum 255 caractères"),
    lastName: z.string().nonempty("Le nom est requis").max(255, "Le nom doit comporter au maximum 255 caractères"),
    phoneNumber: z.string().regex(/^\d{10,15}$/, "Le numéro de téléphone doit comporter entre 10 et 15 chiffres").optional(),
    address: z.string().min(2, "L'adresse doit au moins comporter 2 caractères").max(255, "L'adresse doit comporter au maximum 255 caractères"),
});

export type DeliveryInformation = z.infer<typeof DeliveryInformationsSchema>;

export const useDeliveryStore = defineStore('deliveries', {
    state: () => ({
        loading: false,
        delivery: null as DeliveryEntity | null,
        deliveryInformation: null as DeliveryInformation | null,
        errors: [] as string[],
    }),
    actions: {
        async getDelivery(deliveryId: number) {
            this.loading = true;
            try {
                const response = await apiClient.get(`/deliveries/${deliveryId}`);
                DeliveryEntitySchema.parse(response.data);
                this.delivery = response.data;
            } catch(error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async createDelivery(
            delivery: DeliveryToCreate
        ) {
            this.loading = true;
            try {
                DeliveryToCreateSchema.parse(delivery);
                await apiClient.post('/deliveries', delivery);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        setDeliveryInformation(information: DeliveryInformation) {
            try {
                DeliveryInformationsSchema.parse(information);
                this.deliveryInformation = information;
            } catch (error) {
                console.error("Invalid delivery information");
                throw error;
            }
        },
    },
    getters: {
        getDeliveryInformation(): DeliveryInformation | null {
            return this.deliveryInformation
        },
        isLoading(): boolean {
            return this.loading;
        },
    },
});
