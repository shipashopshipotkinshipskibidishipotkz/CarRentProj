import api from './api';
import { API_CONFIG } from '../config';

export const bookingService = {
    async getAllBookings() {
        const response = await api.get(API_CONFIG.ENDPOINTS.BOOKINGS);
        return response.data;
    },

    async getBookingById(id) {
        const response = await api.get(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`);
        return response.data;
    },

    async createBooking(bookingData) {
        const response = await api.post(API_CONFIG.ENDPOINTS.BOOKINGS, bookingData);
        return response.data;
    },

    async deleteBooking(id) {
        await api.delete(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`);
    }
};