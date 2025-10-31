import axiosClient from "../../lib/axiosClient";
import type { DishDto } from "../../types";

export type CustomerDishFilters = {
    type?: string;
    tag?: string;
    sortBy?: string;
};

export async function fetchCustomerDishes(
    restaurantId: string,
    filters: CustomerDishFilters = {}
) {
    const { data } = await axiosClient.get<DishDto[]>(
        `/orders/restaurants/${restaurantId}/dishes`,
        { params: filters }
    );
    return data;
}
