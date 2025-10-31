// src/services/kdg/priceSnapshotsService.ts
import axiosClient from '../../lib/axiosClient';
import type { PriceRangeSnapshot, UUID } from '../../types';

export async function getPriceSnapshots(restaurantId: UUID): Promise<PriceRangeSnapshot[]> {
    const { data } = await axiosClient.get<PriceRangeSnapshot[]>(`/price-snapshots/${restaurantId}/price-ranges`);
    return data;
}
