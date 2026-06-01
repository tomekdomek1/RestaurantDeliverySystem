import type { Guid } from "../../../api/types/guid";

export interface CreateRestaurantDto {
    name: string,
    phoneNumber: string,
    descrition: string,
    addressId: Guid
}

export interface CreateRestaurantResponseDto {
    id: Guid,
    name: string,
    phoneNumber: string,
    descrition: string,
    addressId: Guid
}

export interface GetRestaurantResponseDto extends CreateRestaurantResponseDto {
    averageRating: number;
    totalReviews: number;
}

export type EditRestaurantDto = Partial<CreateRestaurantDto>;

export type EditRestaurantResponseDto = CreateRestaurantResponseDto;
