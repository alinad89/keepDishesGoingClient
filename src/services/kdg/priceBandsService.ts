// src/services/kdg/priceBandsService.ts
import axiosClient from '../../lib/axiosClient';
import type { PriceBands } from '../../types';

export async function getPriceBands(): Promise<PriceBands> {
    const { data } = await axiosClient.get<PriceBands>('/price-bands');
    return data;
}

export async function updatePriceBands(bands: PriceBands): Promise<void> {
    await axiosClient.patch('/price-bands', bands);
}
