import React from 'react';
import { Car, Calendar, DollarSign, Gauge } from 'lucide-react';

const CarCard = ({ car, onBook }) => {
    const photoPath = `/images/cars/${car.brand.toLowerCase().replace(/ /g, '-')}-${car.model.toLowerCase().replace(/ /g, '-')}.jpg`;

    return (
        <div style={styles.carCard}>
            <div style={styles.carImageWrapper}>
                <img
                    src={photoPath}
                    alt={`${car.brand} ${car.model}`}
                    style={styles.carImage}
                    onError={(e) => { e.target.src = ''; }} // если фотка отсутствует, оставим placeholder
                />
                {!car.photoUrl && (
                    <div style={styles.carPlaceholder}>
                        <Car size={48} />
                    </div>
                )}
            </div>

            <div style={styles.carInfo}>
                <h3 style={styles.carTitle}>{car.brand} {car.model}</h3>

                <div style={styles.carDetails}>
                    <div style={styles.detail}>
                        <Calendar size={16} />
                        <span>Год: {car.releaseYear}</span>
                    </div>

                    <div style={styles.detail}>
                        <Gauge size={16} />
                        <span>Пробег: {car.mileage?.toLocaleString()} км</span>
                    </div>

                    <div style={styles.detail}>
                        <DollarSign size={16} />
                        <span>Цена: ${car.price}/день</span>
                    </div>
                </div>

                <button
                    style={styles.bookBtn}
                    onClick={() => onBook(car)}
                >
                    Забронировать
                </button>
            </div>
        </div>
    );
};

const styles = {
    carCard: {
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
    },
    carImageWrapper: {
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
        position: 'relative',
    },
    carImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
    },
    carPlaceholder: {
        position: 'absolute',
        color: '#6c757d',
    },
    carInfo: {
        padding: '1rem 1.5rem',
    },
    carTitle: {
        fontSize: '1.25rem',
        marginBottom: '1rem',
        color: '#333',
    },
    carDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1rem',
    },
    detail: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#666',
        fontSize: '0.9rem',
    },
    bookBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
};

export default CarCard;
