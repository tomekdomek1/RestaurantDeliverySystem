import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api';

export const useRestaurantId = () => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me/restaurant`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch restaurant ID');
        }

        const data = await response.json();
        setRestaurantId(data.restaurantId);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRestaurantId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantId();
  }, []);

  return { restaurantId, isLoading, error };
};
