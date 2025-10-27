// src/types/basket.ts
export type UUID = string;

export type BasketItem = {
    dishName: string;
    quantity: number;
    unitPrice: number;
};

export type BasketDto = {
    id: UUID;
    items: BasketItem[];
    totalPrice?: number;
};

export type AddItemToBasket = {
    dishId: UUID;
    quantity: number;
};
