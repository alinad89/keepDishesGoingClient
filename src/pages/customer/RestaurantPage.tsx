// src/pages/customer/RestaurantPage.tsx
import { useEffect } from 'react';
import {useParams, useSearchParams } from 'react-router-dom';
import { Container, Typography, Alert } from '@mui/material';
import { useBasket } from '../../hooks/customer/useBasket';
import DishFilters from '../../components/restaurant/DishFilters.tsx';
import DishGrid from '../../components/restaurant/DishGrid.tsx';
import BasketStatus from '../../components/basket/BasketStatus.tsx';
import { DISH_TYPES} from '../../types';
import useCustomerDishes from "../../hooks/customer/useCustomerDishes.ts";
import {useAnonymCustomer} from "../../hooks/customer/useAnonymCustomer.ts";
import {useAddItemToBasket} from "../../hooks/customer/useAddItem.ts";


export default function RestaurantPage() {
    const { id = '' } = useParams();

    const [params, setParams] = useSearchParams();
    const type = (params.get('type') || '') as ('' | typeof DISH_TYPES[number]);
    const tag = params.get('tag') || '';

    const { basket, isBasketLoading, add } = useBasket();
    const { data, isError, isLoading } = useCustomerDishes(id, { type, tag });
    const { createAnonCustomer } = useAnonymCustomer();
    const { addItem } = useAddItemToBasket();

    useEffect(() => {
        createAnonCustomer();
    }, [createAnonCustomer]);


    const setParam = (key: 'type' | 'tag', value: string) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value);
        else next.delete(key);
        setParams(next, { replace: true });
    };

    const handleAdd = (dishId: string) => {
        if (id) localStorage.setItem('lastRestaurantId', id);
        if (id && data) {
            const raw = localStorage.getItem(`dishPrices:${id}`);
            const map = raw ? JSON.parse(raw) as Record<string, number> : {};
            const dish = data.find(d => d.id === dishId);
            if (dish) {
                map[dishId] = Number(dish.price) || 0;
                localStorage.setItem(`dishPrices:${id}`, JSON.stringify(map));
            }
        }
        addItem({ dishId, quantity: 1 });
    };

    if (isError || data === undefined)
        return <Typography color="error">Error loading menu.</Typography>;

    return (
        <Container sx={{ py: 3 }}>
            <Typography variant="h4" gutterBottom>Menu</Typography>

            <DishFilters type={type} tag={tag} onChange={setParam} />

            {isBasketLoading && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Preparing your basket…
                </Alert>
            )}

            <DishGrid
                loading={isLoading}
                dishes={data}
                onAdd={handleAdd}
                addDisabled={add.isPending || isBasketLoading}
            />

            <BasketStatus basketId={basket?.id} />
        </Container>
    );
}
