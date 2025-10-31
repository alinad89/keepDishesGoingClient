// src/pages/customer/RestaurantPage.tsx
import { useEffect } from 'react';
import {useParams, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useBasket } from '../../hooks/customer/useBasket';
import DishFilters from '../../components/restaurant/DishFilters.tsx';
import DishGrid from '../../components/restaurant/DishGrid.tsx';
import BasketStatus from '../../components/basket/BasketStatus.tsx';
import { DISH_TYPES} from '../../types';
import useCustomerDishes from "../../hooks/customer/useCustomerDishes.ts";
import {useAnonymCustomer} from "../../hooks/customer/useAnonymCustomer.ts";
import {useAddItemToBasket} from "../../hooks/customer/useAddItem.ts";
import { useRestaurantWithEta } from "../../hooks/customer/useRestaurantWithEta.ts";


export default function RestaurantPage() {
    const { id = '' } = useParams();

    const [params, setParams] = useSearchParams();
    const type = (params.get('type') || '') as ('' | typeof DISH_TYPES[number]);
    const tag = params.get('tag') || '';
    const sortBy = params.get('sortBy') || '';

    const { basket, isBasketLoading, add } = useBasket();
    const { data, isError, isLoading } = useCustomerDishes(id, { type, tag, sortBy });
    const { createAnonCustomer } = useAnonymCustomer();
    const { addItem } = useAddItemToBasket();
    const { restaurantWithEta } = useRestaurantWithEta(id);

    useEffect(() => {
        createAnonCustomer();
    }, [createAnonCustomer]);


    const setParam = (key: 'type' | 'tag' | 'sortBy', value: string) => {
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
            <Box sx={{ mb: 3 }}>
                {restaurantWithEta?.restaurant && (
                    <Typography variant="h4" gutterBottom>
                        {restaurantWithEta.restaurant.name}
                    </Typography>
                )}
                {!restaurantWithEta?.restaurant && (
                    <Typography variant="h4" gutterBottom>Menu</Typography>
                )}

                {restaurantWithEta?.etaMinutes && (
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={`Estimated delivery: ${restaurantWithEta.etaMinutes} min`}
                        color="primary"
                        sx={{ mt: 1 }}
                    />
                )}
            </Box>

            <DishFilters type={type} tag={tag} sortBy={sortBy} onChange={setParam} />

            <DishGrid
                loading={isLoading}
                dishes={data}
                onAdd={handleAdd}
                addDisabled={add.isPending || isBasketLoading}
            />

            <BasketStatus restaurantId={basket?.restaurantId} isBlocked={basket?.blocked} />
        </Container>
    );
}
