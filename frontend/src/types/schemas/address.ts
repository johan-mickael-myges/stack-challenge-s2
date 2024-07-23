import {z} from "zod";

export const AddressFieldSchema = z.string()
    .min(3, "L'adresse doit comporter au minimum 3 caractères")
    .max(255, "L'adresse ne peut pas comporter plus de 255 caractères");

export type AddressFieldType = z.infer<typeof AddressFieldSchema>;