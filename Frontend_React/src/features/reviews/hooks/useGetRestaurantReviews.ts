import useSWR from 'swr';

// Twardo ustawiony fetcher na Twoje API .NET
const fetcher = async (url: string) => {
  const res = await fetch(`http://localhost:5122${url}`);
  if (!res.ok) throw new Error('Błąd pobierania opinii');
  return res.json();
};

export function useGetRestaurantReviews(restaurantId: string | undefined) {
  // Przekazujemy PageSize=100 aby na Happy Path pobrać wszystkie opinie na raz
  const { data, error, isLoading, mutate } = useSWR(
    restaurantId ? `/api/restaurants/${restaurantId}/reviews?PageNumber=1&PageSize=100` : null,
    fetcher
  );

  return {
    // API backendowe (GetRestaurantReviewsResponseDto) trzyma tablicę opinii w polu "items"
    reviews: data?.items ? data.items : [],
    isLoading,
    error,
    mutate
  };
}