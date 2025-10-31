// src/types/basket.ts
export type UUID = string;

export const DISH_STATES = ["PUBLISHED", "OUT_OF_STOCK", "DELETED"] as const;
export type DishState = typeof DISH_STATES[number];

export type BasketItem = {
    dishId: UUID;
    dishName: string;
    quantity: number;
    unitPrice: number;
    state: DishState;
};

export type BasketDto = {
    restaurantId: UUID | null;
    availableItems: BasketItem[];
    blockedItems: BasketItem[];
    totalPrice: number;
    blocked: boolean;
};

export type AddItemToBasket = {
    dishId: UUID;
    quantity: number;
};
