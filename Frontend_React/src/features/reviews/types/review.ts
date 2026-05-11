export interface Review {
  id: string;
  rating: number;
  description?: string;
  createdAt: string;
  authorUserId: string;
}

export interface ReviewsFilter {
  pageNumber: number;
  pageSize: number;
  sortBy: 'createdAt' | 'rating';
  sortDirection: 'asc' | 'desc';
  minRating?: number;
  maxRating?: number;
}

export interface ReviewsResponse {
  items: Review[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface AddReviewRequest {
  rating: number;
  description?: string;
}

export interface AddReviewResponse {
  id: string;
  restaurantId: string;
  rating: number;
  description?: string;
  createdAt: string;
}
