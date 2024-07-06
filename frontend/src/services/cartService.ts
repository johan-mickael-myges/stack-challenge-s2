import axios from 'axios';

const API_URL = 'http://localhost:8000/cart'; 

export const addToCart = async (productId: number, userId: number, quantity: number = 1) => {
    try {
        const response = await axios.post(`${API_URL}/add`, { productId, userId, quantity });
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};