import React from 'react';
import { Car, Calendar, CreditCard } from 'lucide-react';

const Header = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'cars', label: 'Автомобили', icon: Car },
        { id: 'bookings', label: 'Бронирования', icon: Calendar },
        { id: 'payments', label: 'Платежи', icon: CreditCard }
    ];

    return (
        <header style={styles.header}>
            <div style={styles.headerContent}>
                <h1>🚗 Car Booking System</h1>

                <nav style={styles.tabs}>
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                style={{
                                    ...styles.tab,
                                    ...(activeTab === tab.id ? styles.activeTab : {})
                                }}
                                onClick={() => onTabChange(tab.id)}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};

const styles = {
    header: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tabs: {
        display: 'flex',
        gap: '0.5rem',
    },
    tab: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
    },
    activeTab: {
        background: 'white',
        color: '#667eea',
    }
};

export default Header;