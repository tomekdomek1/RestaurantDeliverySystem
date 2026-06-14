import useSWR from 'swr';

// Twardo ustawiony fetcher na Twoje API .NET
const fetcher = async (url: string) => {
  const res = await fetch(`http://localhost:5122${url}`);
  if (!res.ok) throw new Error('Błąd pobierania menu');
  return res.json();
};

export function useGetDishes(restaurantId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    restaurantId ? `/api/restaurants/${restaurantId}/dishes` : null,
    fetcher
  );

  return {
    // API backendowe zwraca tutaj bezpośrednio tablicę
    dishes: Array.isArray(data) ? data : [],
    isLoading,
    error,
    mutate
  };
}