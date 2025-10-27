// src/services/customer/customerService.ts
import axiosClient from '../../lib/axiosClient';

const UUID_RE =
    /^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$/;

function normalizeAnonId(data: any): string {
    // Expected: { customerId: { customerId: "uuid" } }
    const id = data?.customerId?.customerId;
    if (typeof id === 'string' && UUID_RE.test(id)) return id;
    throw new Error('Anonymous customer response missing id');
}

let inflight: Promise<string> | null = null;

export async function ensureAnonymous(): Promise<string> {
    const saved = localStorage.getItem('anonCustomerId');
    if (saved && UUID_RE.test(saved)) return saved;

    if (!inflight) {
        inflight = axiosClient.post('/customers/anonym', null)
            .then(({ data }) => {
                const id = normalizeAnonId(data);
                localStorage.setItem('anonCustomerId', id);
                return id;
            })
            .finally(() => { inflight = null; });
    }
    return inflight;
}

export async function getAnonId(): Promise<string> {
    const saved = localStorage.getItem('anonCustomerId');
    if (saved && UUID_RE.test(saved)) return saved;
    return ensureAnonymous();
}
