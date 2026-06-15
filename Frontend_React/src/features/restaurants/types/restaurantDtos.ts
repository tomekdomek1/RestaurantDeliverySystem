import type { Guid } from "../../../api/types/guid";

export type RestaurantCategory = 'Pizza' | 'Burgers' | 'Sushi' | 'Kebab' | 'Asian' | 'Vegan' | 'Italian' | 'Polish' | 'Other';

export interface CreateRestaurantDto {
    name: string,
    phoneNumber: string,
    descrition: string,
    addressId: Guid,
    category: RestaurantCategory
}

export interface CreateRestaurantResponseDto {
    id: Guid,
    name: string,
    phoneNumber: string,
    descrition: string,
    addressId: Guid,
    category: RestaurantCategory
}

export interface GetRestaurantResponseDto extends CreateRestaurantResponseDto {
    averageRating: number;
    totalReviews: number;
}

export type EditRestaurantDto = Partial<CreateRestaurantDto>;

export type EditRestaurantResponseDto = CreateRestaurantResponseDto;