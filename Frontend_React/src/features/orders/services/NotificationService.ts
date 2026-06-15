export interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  date: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface NotificationRecord {
  orderId: string;
  timestamp: number;
  order: Order;
  read: boolean;
}

const STORAGE_KEY = 'restaurant_notifications';

export class NotificationService {
  static getNotifications(): NotificationRecord[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveNotifications(notifications: NotificationRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }

  static addNotification(order: Order): NotificationRecord {
    const notifications = this.getNotifications();
    const existingIndex = notifications.findIndex(n => n.orderId === order.id);

    if (existingIndex !== -1) {
      return notifications[existingIndex];
    }

    const notification: NotificationRecord = {
      orderId: order.id,
      timestamp: Date.now(),
      order,
      read: false
    };

    notifications.unshift(notification);
    this.saveNotifications(notifications);
    return notification;
  }

  static markAsRead(orderId: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.orderId === orderId);
    if (notification) {
      notification.read = true;
      this.saveNotifications(notifications);
    }
  }

  static clearHistory(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  static getUnreadCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(n => !n.read).length;
  }

  static getNewOrders(currentOrders: Order[]): Order[] {
    const notifications = this.getNotifications();
    const existingOrderIds = new Set(notifications.map(n => n.orderId));
    return currentOrders.filter(order => !existingOrderIds.has(order.id));
  }

  static sendBrowserNotification(order: Order): void {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification('Nowe zamówienie!', {
        body: `Zamówienie #${order.id.slice(0, 8)} - Kwota: ${order.totalAmount} zł`,
        icon: '/notification-icon.png',
        tag: `order-${order.id}`,
        requireInteraction: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  static requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return Promise.reject('Notifications not supported');
    }

    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      return Notification.requestPermission();
    }

    return Promise.resolve(Notification.permission);
  }
}
