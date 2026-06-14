import React, { useState, useEffect } from 'react';

export const RestaurantReportPage = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [report, setReport] = useState<any>(null);

    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:5122/api/restaurants');
                
                if (response.ok) {
                    const data = await response.json();
                    setRestaurants(data);
                    
                    if (data.length > 0) {
                        setSelectedRestaurantId(data[0].id);
                    }
                }
            } catch (error) {
                console.error("Błąd podczas pobierania listy restauracji:", error);
            }
        };

        fetchRestaurants();
    }, []);

    const fetchReport = async () => {
        if (!startDate || !endDate) {
            alert("Proszę wybrać obie daty!");
            return;
        }
        
        if (!selectedRestaurantId) {
            alert("Brak wybranej restauracji!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5122/api/restaurants/${selectedRestaurantId}/report?startDate=${startDate}&endDate=${endDate}`);
            if (response.ok) {
                const data = await response.json();
                setReport(data);
            } else {
                alert("Nie udało się pobrać raportu.");
            }
        } catch (error) {
            console.error("Błąd połączenia:", error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Raport Sprzedaży</h1>
            <p>Wybierz restaurację oraz okres, za który chcesz wygenerować podsumowanie.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                
                <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>
                    Wybierz restaurację:
                    <select 
                        value={selectedRestaurantId} 
                        onChange={e => setSelectedRestaurantId(e.target.value)}
                        style={{ padding: '8px', marginTop: '5px', borderRadius: '4px' }}
                    >
                        {restaurants.map(rest => (
                            <option key={rest.id} value={rest.id}>
                                {rest.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <label>Od: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
                    <label>Do: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
                </div>

                <button 
                    onClick={fetchReport} 
                    style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                >
                    Generuj Raport
                </button>
            </div>

            {report && (
                <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
                    <h3>Podsumowanie:</h3>
                    <p><strong>Ilość zamówień:</strong> {report.totalOrders}</p>
                    <p><strong>Przychód całkowity:</strong> {report.totalRevenue} zł</p>
                    <p><strong>Unikalni klienci:</strong> {report.newCustomers}</p>
                </div>
            )}
        </div>
    );
};