import { useState, useEffect, useRef, useCallback } from 'react';
import type { Order, NotificationRecord } from '../services/NotificationService';
import { NotificationService } from '../services/NotificationService';

const POLLING_INTERVAL = 10000; // 10 seconds

export interface UseRestaurantNotificationsReturn {
  notifications: NotificationRecord[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (orderId: string) => void;
  clearHistory: () => void;
  refresh: () => Promise<void>;
}

export const useRestaurantNotifications = (restaurantId: string): UseRestaurantNotificationsReturn => {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchActiveOrders = useCallback(async (): Promise<Order[]> => {
    try {
      const response = await fetch(
        `http://localhost:5122/api/orders/restaurant/${restaurantId}/active`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    }
  }, [restaurantId]);

  const processOrders = useCallback(async (orders: Order[]) => {
    const newOrders = NotificationService.getNewOrders(orders);

    newOrders.forEach(order => {
      NotificationService.addNotification(order);
      NotificationService.sendBrowserNotification(order);
    });

    const allNotifications = NotificationService.getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(NotificationService.getUnreadCount());
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const orders = await fetchActiveOrders();
      await processOrders(orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [fetchActiveOrders, processOrders]);

  const markAsRead = useCallback((orderId: string) => {
    NotificationService.markAsRead(orderId);
    setNotifications(NotificationService.getNotifications());
    setUnreadCount(NotificationService.getUnreadCount());
  }, []);

  const clearHistory = useCallback(() => {
    NotificationService.clearHistory();
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    // Initial fetch
    refresh();

    // Request notification permission
    NotificationService.requestNotificationPermission().catch(() => {});

    // Start polling
    pollingIntervalRef.current = setInterval(() => {
      refresh();
    }, POLLING_INTERVAL);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [refresh]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    clearHistory,
    refresh,
  };
};
