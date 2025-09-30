import React, { useState } from 'react';
import Header from './components/Header';
import CarList from './components/CarList';
import BookingList from './components/BookingList';
import PaymentList from './components/PaymentList';

function App() {
    const [activeTab, setActiveTab] = useState('cars');

    const renderContent = () => {
        switch (activeTab) {
            case 'cars':
                return <CarList />;
            case 'bookings':
                return <BookingList />;
            case 'payments':
                return <PaymentList />;
            default:
                return <CarList />;
        }
    };

    return (
        <div style={styles.app}>
            <Header activeTab={activeTab} onTabChange={setActiveTab} />
            <main style={styles.mainContent}>
                {renderContent()}
            </main>
        </div>
    );
}

const styles = {
    app: {
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f5f5f5',
        color: '#333',
    },
    mainContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
    }
};

export default App;