import type { Guid } from "./guid";

export interface CreateAddressDto {
    street: string;
    buildingNumber: number;
    appartmentNumber: number;
    city: string;
}

export interface CreateAddressResponseDto {
    id: Guid;
    street: string;
    buildingNumber: number;
    appartmentNumber: number;
    city: string;
}

export type EditAddressDto = Partial<CreateAddressDto>;

export type EditAddressResponseDto = CreateAddressResponseDto;

export type GetAddressResponseDto = CreateAddressResponseDto;
