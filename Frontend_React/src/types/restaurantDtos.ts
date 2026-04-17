import type { Guid } from "./guid";

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

export type EditRestaurantDto = Partial<CreateRestaurantDto>;

export type EditRestaurantResponseDto = CreateRestaurantResponseDto;

export type GetRestaurantResponseDto = CreateRestaurantResponseDto;
