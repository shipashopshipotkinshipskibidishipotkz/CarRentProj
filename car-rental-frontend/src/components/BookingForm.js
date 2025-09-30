import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { X } from 'lucide-react';

const BookingForm = ({ car, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        userId: '',
        startDate: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const bookingData = {
                userId: parseInt(formData.userId),
                carId: car.carId,
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: 'PENDING'
            };

            await bookingService.createBooking(bookingData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'Ошибка при создании бронирования');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.bookingForm}>
                <div style={styles.formHeader}>
                    <h3>Бронирование {car.brand} {car.model}</h3>
                    <button onClick={onCancel} style={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label>ID пользователя:</label>
                        <input
                            type="number"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Дата начала:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Дата окончания:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    {error && <div style={styles.errorMessage}>{error}</div>}

                    <div style={styles.formActions}>
                        <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                            Отмена
                        </button>
                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                            {loading ? 'Бронирование...' : 'Забронировать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
    },
    bookingForm: {
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    formHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#666',
        padding: '0.25rem',
        borderRadius: '4px',
    },
    formGroup: {
        marginBottom: '1rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '2px solid #e9ecef',
        borderRadius: '8px',
        fontSize: '1rem',
    },
    errorMessage: {
        background: '#f8d7da',
        color: '#721c24',
        padding: '0.75rem',
        borderRadius: '6px',
        margin: '1rem 0',
        fontSize: '0.9rem',
    },
    formActions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
    },
    cancelBtn: {
        flex: 1,
        padding: '0.75rem',
        background: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    submitBtn: {
        flex: 1,
        padding: '0.75rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    }
};

export default BookingForm;