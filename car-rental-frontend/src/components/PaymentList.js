import React from 'react';
import { useApi } from '../hooks/useApi';
import { paymentService } from '../services/paymentService';
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

const PaymentList = () => {
    const { data: payments, loading, error } = useApi(paymentService.getAllPayments);

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
                return <CheckCircle size={16} />;
            case 'PENDING':
                return <Clock size={16} />;
            case 'FAILED':
                return <XCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
                return '#28a745';
            case 'PENDING':
                return '#ffc107';
            case 'FAILED':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    if (loading) return <div style={styles.loading}>Загрузка платежей...</div>;
    if (error) return <div style={styles.error}>Ошибка: {error}</div>;

    return (
        <div style={styles.paymentList}>
            <h2>История платежей</h2>

            {payments && payments.length === 0 ? (
                <div style={styles.emptyState}>
                    <CreditCard size={48} />
                    <h3>Нет платежей</h3>
                    <p>Платежи появятся здесь после создания бронирований</p>
                </div>
            ) : (
                <div style={styles.paymentsGrid}>
                    {payments?.map(payment => (
                        <div key={payment.paymentId} style={styles.paymentCard}>
                            <div style={styles.paymentHeader}>
                                <div style={styles.paymentTitle}>
                                    <CreditCard size={20} />
                                    <h4>Платёж #{payment.paymentId}</h4>
                                </div>
                                <div style={{
                                    ...styles.status,
                                    backgroundColor: getStatusColor(payment.status)
                                }}>
                                    {getStatusIcon(payment.status)}
                                    <span>{payment.status || 'PENDING'}</span>
                                </div>
                            </div>

                            <div style={styles.paymentDetails}>
                                <div style={styles.detail}>
                                    <DollarSign size={16} />
                                    <span>Сумма: ${payment.amount}</span>
                                </div>

                                <div style={styles.detail}>
                                    <Calendar size={16} />
                                    <span>Дата: {new Date(payment.paymentDate).toLocaleDateString('ru-RU')}</span>
                                </div>

                                <div style={styles.detail}>
                                    <span>Бронирование: #{payment.bookingId}</span>
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
    paymentList: {
        padding: '2rem 0',
    },
    paymentsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
    },
    paymentCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef',
    },
    paymentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    paymentTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#333',
    },
    paymentTitleH4: {
        margin: 0,
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
    paymentDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    detail: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#666',
        fontSize: '0.9rem',
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

export default PaymentList;