import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { carService } from '../services/carService';
import CarCard from './CarCard';
import BookingForm from './BookingForm';

const CarList = () => {
    const { data: cars, loading, error, execute: refreshCars } = useApi(carService.getAllCars, false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);

    useEffect(() => {
        refreshCars();
    }, [refreshCars]);

    const handleBookCar = (car) => {
        setSelectedCar(car);
        setShowBookingForm(true);
    };

    const handleBookingSuccess = () => {
        setShowBookingForm(false);
        setSelectedCar(null);
        refreshCars();
    };

    if (loading) return <div style={styles.loading}>Загрузка автомобилей...</div>;
    if (error) return <div style={styles.error}>Ошибка: {error}</div>;

    return (
        <div style={styles.carList}>
            <h2>Доступные автомобили</h2>

            <div style={styles.carsGrid}>
                {cars?.map(car => (
                    <CarCard
                        key={car.carId}
                        car={car}
                        onBook={handleBookCar}
                    />
                ))}
            </div>

            {showBookingForm && selectedCar && (
                <BookingForm
                    car={selectedCar}
                    onSuccess={handleBookingSuccess}
                    onCancel={() => setShowBookingForm(false)}
                />
            )}
        </div>
    );
};

const styles = {
    carList: {
        padding: '2rem 0',
    },
    carsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
    },
    loading: {
        textAlign: 'center',
        padding: '2rem',
        fontSize: '1.1rem',
        color: '#666',
    },
    error: {
        background: '#f8d7da',
        color: '#721c24',
        padding: '1rem',
        borderRadius: '8px',
        margin: '1rem 0',
    }
};

export default CarList;
