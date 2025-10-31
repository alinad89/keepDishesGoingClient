// src/services/kdg/kdgService.ts
import axiosClient from '../../lib/axiosClient';

export async function ensureKdg() {
    const { data } = await axiosClient.post<{ kdgId: string; email: string; created: boolean }>(
        '/kdg/me/ensure'
    );
    return data;
}
