// src/pages/customer/_components/DishCard.tsx
import { Paper, Typography, Stack, Chip, Button } from '@mui/material';
import { labelize, type DishDto } from '../../types';

type Props = {
    dish: DishDto;
    onAdd: () => void;
    disabled?: boolean;
};

export default function DishCard({ dish, onAdd, disabled }: Props) {
    return (
        <Paper sx={{ p: 2, display: 'grid', gap: 1, flex: '1 1 260px', maxWidth: 360 }}>
            <Typography variant="h6">{dish.name}</Typography>
            <Typography variant="body2">{dish.description}</Typography>
            <Typography fontWeight={700}>€ {Number(dish.price).toFixed(2)}</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Chip size="small" label={labelize(dish.type)} />
                {dish.tags?.slice(0, 3).map(t => <Chip key={t} size="small" variant="outlined" label={labelize(t)} />)}
            </Stack>
            <Button variant="contained" onClick={onAdd} disabled={disabled}>Add to basket</Button>
        </Paper>
    );
}


//t handleAddToBasket = () => {
//           add.mutate({
//               dishId: dish.id,
//               quantity: 1
//           });
//       };
//
//       return (
//           <button
//               onClick={handleAddToBasket}
//               disabled={add.isPending}  // ← Disable while loading
//           >
//               {add.isPending ? 'Adding...' : 'Add to Basket'}
//           </button>
//       );
//   }