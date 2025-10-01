import api from './api';
import { API_CONFIG } from '../config';

export const carService = {
    getAllCars: () => api.get(API_CONFIG.ENDPOINTS.CARS).then(res => res.data),
    getCarById: (id) => api.get(`${API_CONFIG.ENDPOINTS.CARS}/${id}`).then(res => res.data),
    createCar: (data) => api.post(API_CONFIG.ENDPOINTS.CARS, data).then(res => res.data),
    deleteCar: (id) => api.delete(`${API_CONFIG.ENDPOINTS.CARS}/${id}`)
};
