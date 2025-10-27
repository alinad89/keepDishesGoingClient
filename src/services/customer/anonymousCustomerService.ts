// src/services/customer/anonymous.ts
import axiosClient from '../../lib/axiosClient';

export async function createAnonymousCustomer() {
    const {data} = await axiosClient.post(`/customers/anonym`, {}, {withCredentials: true});
    return data;
}