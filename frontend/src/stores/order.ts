import { defineStore } from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';
import { DeliveryEntitySchema } from "@/stores/delivery.ts";

const DeliverySchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  phoneNumber: z.string().nullable(),
  status: z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  shippingMethodId: z.number().nullable(),
  orderId: z.number(),
});

const ProductSchema = z.object({
  price: z.number(),
  id: z.number(),
  name: z.string(),
  reference: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()),
  weight: z.number(),
  brandId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const OrderItemSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  unitPrice: z.string(),
  subtotal: z.string(),
  orderId: z.number(),
  productId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  Product: ProductSchema,
});

const CreatedOrderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  OrderItems: z.array(OrderItemSchema),
  Delivery: DeliverySchema.nullable().optional(), // Adjust as needed
});

const CreatedOrdersSchema = z.array(CreatedOrderSchema);

const ItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

const ItemsSchema = z.array(ItemSchema);

export type CreatedOrder = z.infer<typeof CreatedOrderSchema>;
export type CreatedOrders = z.infer<typeof CreatedOrdersSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type Items = z.infer<typeof ItemsSchema>;

export const useOrderStore = defineStore('orders', {
  state: () => ({
    loading: false,
    delivery: null as DeliveryEntity | null,
    paidOrders: [] as CreatedOrders,
    invoice: null as CreatedOrder | null,
    error: null as string | null,
  }),
  actions: {
    async fetchDelivery(orderId: number) {
      this.loading = true;
      try {
        const response = await apiClient.get(`/orders/${orderId}/delivery`);
        DeliveryEntitySchema.parse(response.data);
        this.delivery = response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createOrder(items: z.infer<typeof ItemsSchema>): Promise<CreatedOrder> {
      try {
        ItemsSchema.parse(items);
        this.loading = true;
        return await apiClient.post('/orders', { items });
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchPaidOrders() {
      try {
        this.loading = true;
        this.error = null;
        const response = await apiClient.get('/orders/history', { withCredentials: true });
        console.log('Fetched paid orders:', response.data); // Log the fetched data
        this.paidOrders = CreatedOrdersSchema.parse(response.data);
      } catch (error) {
        this.error = 'Failed to fetch paid orders';
        console.error('Error fetching paid orders:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchInvoiceDetails(orderId: number) {
      try {
        this.loading = true;
        this.error = null;
        const response = await apiClient.get(`/orders/${orderId}`);
        console.log('Fetched invoice details:', response.data); // Debug log
        this.invoice = CreatedOrderSchema.parse(response.data);
        console.log('Parsed invoice:', this.invoice); // Debug log
      } catch (error) {
        this.error = 'Failed to fetch invoice details';
        console.error('Error fetching invoice details:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchInvoice(orderId: number) {
      try {
        this.loading = true;
        const response = await apiClient.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        this.error = 'Failed to fetch invoice';
        console.error('Error fetching invoice:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      } finally {
        this.loading = false;
      }
    },
  },
});

