import api from './api';
import { API_CONFIG } from '../config';

export const paymentService = {
    async getAllPayments() {
        const response = await api.get(API_CONFIG.ENDPOINTS.PAYMENTS);
        return response.data;
    },

    async getPaymentById(id) {
        const response = await api.get(`${API_CONFIG.ENDPOINTS.PAYMENTS}/${id}`);
        return response.data;
    },

    async createPayment(paymentData) {
        const response = await api.post(API_CONFIG.ENDPOINTS.PAYMENTS, paymentData);
        return response.data;
    }
};