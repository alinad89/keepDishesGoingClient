// src/services/menuApi.ts
import axiosClient from '../../lib/axiosClient.ts';
import type { DishDto } from '../../types';

export async function applyAllDrafts() {
    const { data } = await axiosClient.patch<DishDto[]>('/menus/dishes');
    return data;
}
