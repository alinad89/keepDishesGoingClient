// src/hooks/customer/useBasket.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentBasket, addItemToBasket } from '../../services/customer/basketService';
import type { BasketDto, AddItemToBasket } from '../../types/basket';

export function useBasket(opts?: { enabled?: boolean }) {
    const qc = useQueryClient();
    const enabled = opts?.enabled ?? true;

    const basketQ = useQuery<BasketDto>({
        queryKey: ['basket', 'current'],
        queryFn: getCurrentBasket,
        enabled,
        retry: false,
    });

// src/hooks/customer/useBasket.ts
    const add = useMutation({
        mutationFn: (payload: AddItemToBasket) => {
            const id = basketQ.data?.id;
            if (!id) throw new Error('Basket not ready');
            return addItemToBasket(id, payload);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['basket', 'current'] }); // <- refetch real basket
        },
    });


    return {
        basket: basketQ.data,
        isBasketLoading: basketQ.isLoading,
        add,
        refetchBasket: basketQ.refetch,
    };
}
