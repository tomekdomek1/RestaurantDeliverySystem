export interface OrderItemResultDto {
  id: string;
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderAddressResultDto {
  street: string;
  buildingNumber: number;
  appartmentNumber: number;
  city: string;
}

export interface GetMyOrdersResultDto {
  id: string;
  restaurantId: string;
  date: string; // format ISO, np. "2026-06-08T12:30:00Z"
  deliveryTime: string; // np. "14:30:00"
  notes?: string; //opcjonalne
  status: string;
  totalAmount: number;
  address: OrderAddressResultDto;
  items: OrderItemResultDto[];
}