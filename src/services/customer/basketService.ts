// src/services/customer/basketService.ts
import axiosClient from '../../lib/axiosClient';
import type { BasketDto, AddItemToBasket } from '../../types/basket';

export async function getCurrentBasket(): Promise<BasketDto> {
    const { data } = await axiosClient.get<BasketDto>('/baskets/current');
    return data;
}

export async function addItemToBasket(basketId: string, item: AddItemToBasket): Promise<BasketDto> {
    const { data } = await axiosClient.patch<BasketDto>(`/baskets/${basketId}/items`, item);
    return data;
}
