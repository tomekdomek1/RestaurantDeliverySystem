import { useRestaurantNotifications } from './hooks/useRestaurantNotifications';
import './NotificationWidget.css';

interface NotificationWidgetProps {
  restaurantId: string;
  maxItems?: number;
  onViewAll?: () => void;
}

const STATUS_POLISH_NAMES: Record<string, string> = {
  'WaitingForConfirmation': 'Oczekuje',
  'Confirmed': 'Potwierdzone',
  'IsBeingPrepared': 'Przygotowanie',
  'WaitingForDriver': 'Czeka na kierowcę',
  'InDelivery': 'W dostawie',
  'Delivered': 'Dostarczone'
};

export const NotificationWidget: React.FC<NotificationWidgetProps> = ({ 
  restaurantId, 
  maxItems = 5,
  onViewAll
}) => {
  const { notifications, unreadCount } = useRestaurantNotifications(restaurantId);

  const recentNotifications = notifications.slice(0, maxItems);

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Teraz';
    if (minutes < 60) return `${minutes}m temu`;
    if (hours < 24) return `${hours}h temu`;
    return `${days}d temu`;
  };

  return (
    <div className="notification-widget">
      <div className="widget-header">
        <h3>Nowe zamówienia</h3>
        {unreadCount > 0 && (
          <span className="widget-badge">{unreadCount}</span>
        )}
      </div>

      <div className="widget-content">
        {recentNotifications.length === 0 ? (
          <div className="widget-empty">
            <p>Brak nowych zamówień</p>
          </div>
        ) : (
          <div className="widget-items">
            {recentNotifications.map(notification => (
              <div 
                key={notification.orderId} 
                className={`widget-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="item-left">
                  {!notification.read && <div className="unread-indicator"></div>}
                  <div className="item-info">
                    <span className="item-order-id">
                      #{notification.order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="item-amount">
                      {notification.order.totalAmount.toFixed(2)} zł
                    </span>
                    <span className="item-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
                <span className={`item-status status-${notification.order.status.toLowerCase()}`}>
                  {STATUS_POLISH_NAMES[notification.order.status] || notification.order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > maxItems && onViewAll && (
        <button onClick={onViewAll} className="widget-view-all">
          Wyświetl wszystkie ({notifications.length})
        </button>
      )}
    </div>
  );
};
