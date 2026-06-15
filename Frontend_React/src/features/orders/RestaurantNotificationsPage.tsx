import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurantNotifications } from './hooks/useRestaurantNotifications';
import './RestaurantNotificationsPage.css';

interface NotificationsPageProps {
  restaurantId?: string;
}

const ORDER_STATUSES = [
  'All',
  'WaitingForConfirmation',
  'Confirmed',
  'IsBeingPrepared',
  'WaitingForDriver',
  'InDelivery',
  'Delivered'
];

const STATUS_POLISH_NAMES: Record<string, string> = {
  'All': 'Wszystkie',
  'WaitingForConfirmation': 'Oczekujące potwierdzenia',
  'Confirmed': 'Potwierdzone',
  'IsBeingPrepared': 'W przygotowaniu',
  'WaitingForDriver': 'Oczekujące kierowcy',
  'InDelivery': 'W dostawie',
  'Delivered': 'Dostarczone'
};

export const RestaurantNotificationsPage: React.FC<NotificationsPageProps> = ({ restaurantId: propRestaurantId }) => {
  const { restaurantId: routeRestaurantId } = useParams<{ restaurantId: string }>();
  const effectiveRestaurantId = propRestaurantId || routeRestaurantId || '';
  
  const { notifications, unreadCount, isLoading, error, markAsRead, clearHistory, refresh } = 
    useRestaurantNotifications(effectiveRestaurantId);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  if (!effectiveRestaurantId) {
    return (
      <div className="notifications-page">
        <div className="error-message">
          Brak identyfikatora restauracji. Nie można załadować powiadomień.
        </div>
      </div>
    );
  }

  const filteredNotifications = useMemo(() => {
    if (selectedStatus === 'All') {
      return notifications;
    }
    return notifications.filter(n => n.order.status === selectedStatus);
  }, [notifications, selectedStatus]);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-title">
          <h1>Powiadomienia o zamówieniach</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} nowych</span>
          )}
        </div>
        <div className="header-actions">
          <button 
            onClick={refresh}
            disabled={isLoading}
            className="btn-refresh"
          >
            {isLoading ? 'Odświeżanie...' : 'Odśwież'}
          </button>
          <button 
            onClick={clearHistory}
            className="btn-clear-history"
          >
            Wyczyść historię
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          Błąd: {error}
        </div>
      )}

      <div className="filters">
        <label>Filtruj po statusie:</label>
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-filter"
        >
          {ORDER_STATUSES.map(status => (
            <option key={status} value={status}>
              {STATUS_POLISH_NAMES[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <p>Brak powiadomień</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.orderId} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <div className="order-header">
                  <span className="order-id">
                    Zamówienie #{notification.order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className={`order-status status-${notification.order.status.toLowerCase()}`}>
                    {STATUS_POLISH_NAMES[notification.order.status] || notification.order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p><strong>Kwota:</strong> {notification.order.totalAmount.toFixed(2)} zł</p>
                  <p><strong>Ilość pozycji:</strong> {notification.order.items.length}</p>
                  <p><strong>Otrzymano:</strong> {formatDate(notification.timestamp)}</p>
                </div>
                <div className="order-items">
                  <strong>Pozycje:</strong>
                  <ul>
                    {notification.order.items.map(item => (
                      <li key={item.id}>
                        {item.name} x{item.quantity} ({item.price.toFixed(2)} zł)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {!notification.read && (
                <button 
                  onClick={() => markAsRead(notification.orderId)}
                  className="btn-mark-read"
                >
                  Oznacz jako przeczytane
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
