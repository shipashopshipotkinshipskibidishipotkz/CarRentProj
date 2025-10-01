import React from 'react';
import useApi from '../hooks/useApi';
import { bookingService } from '../services/bookingService';
import { Calendar, User, Car, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

const BookingList = () => {
    const { data: bookings, loading, error, execute: refreshBookings } = useApi(bookingService.getAllBookings);

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
            try {
                await bookingService.deleteBooking(bookingId);
                refreshBookings();
            } catch (err) {
                alert('Ошибка при удалении бронирования: ' + (err.response?.data || err.message));
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return <Clock size={16} />;
            case 'CONFIRMED':
                return <CheckCircle size={16} />;
            case 'CANCELLED':
                return <XCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return '#ffc107';
            case 'CONFIRMED':
                return '#28a745';
            case 'CANCELLED':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    if (loading) return <div style={styles.loading}>Загрузка бронирований...</div>;
    if (error) return <div style={styles.error}>Ошибка: {error}</div>;

    return (
        <div style={styles.bookingList}>
            <h2>Все бронирования</h2>

            {bookings && bookings.length === 0 ? (
                <div style={styles.emptyState}>
                    <Calendar size={48} />
                    <h3>Нет бронирований</h3>
                    <p>Бронирования появятся здесь после создания</p>
                </div>
            ) : (
                <div style={styles.bookingsGrid}>
                    {bookings?.map(booking => (
                        <div key={booking.bookingId} style={styles.bookingCard}>
                            <div style={styles.bookingHeader}>
                                <div style={styles.bookingTitle}>
                                    <h4>Бронирование #{booking.bookingId}</h4>
                                    <div style={{
                                        ...styles.status,
                                        backgroundColor: getStatusColor(booking.status)
                                    }}>
                                        {getStatusIcon(booking.status)}
                                        <span>{booking.status || 'PENDING'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteBooking(booking.bookingId)}
                                    style={styles.deleteBtn}
                                    title="Удалить бронирование"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div style={styles.bookingDetails}>
                                <div style={styles.detail}>
                                    <User size={16} />
                                    <span>Пользователь ID: {booking.userId}</span>
                                </div>

                                <div style={styles.detail}>
                                    <Car size={16} />
                                    <span>Автомобиль ID: {booking.carId}</span>
                                </div>

                                <div style={styles.detail}>
                                    <Calendar size={16} />
                                    <span>Начало: {new Date(booking.startDate).toLocaleDateString('ru-RU')}</span>
                                </div>

                                <div style={styles.detail}>
                                    <Calendar size={16} />
                                    <span>Окончание: {new Date(booking.endDate).toLocaleDateString('ru-RU')}</span>
                                </div>

                                <div style={styles.duration}>
                  <span>
                    Продолжительность: {
                      Math.ceil(
                          (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
                      )
                  } дней
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    bookingList: {
        padding: '2rem 0',
    },
    bookingsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
    },
    bookingCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef',
    },
    bookingHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
    },
    bookingTitle: {
        flex: 1,
    },
    bookingTitleH4: {
        margin: '0 0 0.5rem 0',
        color: '#333',
        fontSize: '1.1rem',
    },
    status: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    deleteBtn: {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '0.5rem',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookingDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    detail: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#666',
        fontSize: '0.9rem',
    },
    duration: {
        marginTop: '0.5rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid #e9ecef',
        color: '#333',
        fontWeight: '600',
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
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#6c757d',
    },
    emptyStateH3: {
        margin: '1rem 0 0.5rem 0',
        color: '#333',
    },
};

export default BookingList;