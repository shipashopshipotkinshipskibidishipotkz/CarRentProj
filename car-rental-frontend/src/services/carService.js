import axios from 'axios';

// Настройка API
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080', // <- замените на порт вашего бэкенда
};

// Создаем экземпляр Axios
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // таймаут 5 секунд
});

// Функция получения всех машин
export const getAllCars = async () => {
    const url = '/cars'; // endpoint на бэкенде
    console.log('Попытка запроса к:', API_CONFIG.BASE_URL + url);

    try {
        const response = await api.get(url);
        console.log('Ответ сервера:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Ошибка ответа сервера:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Сервер не ответил, запрос был отправлен:', error.request);
        } else {
            console.error('Ошибка настройки запроса:', error.message);
        }
        throw error;
    }
};
console.log('Попытка запроса к:', API_CONFIG.BASE_URL + '/cars');

export class carService {
}