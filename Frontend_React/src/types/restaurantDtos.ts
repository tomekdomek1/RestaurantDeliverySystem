import type { Guid } from "./guid";

export interface CreateRestaurantDto {
    name: string,
    phoneNumber: string,
    description: string,
    addressId: Guid
}

export interface CreateRestaurantResponseDto {
    id: Guid,
    name: string,
    phoneNumber: string,
    description: string,
    addressId: Guid
}