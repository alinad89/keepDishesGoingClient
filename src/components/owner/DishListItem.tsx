import { Card, CardContent, CardActions, Typography, Chip, Button, Box, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import type { DishDto, DishState } from "../../types";
import { colorForState } from "../../utils/dishStateUtils.ts";

type DishListItemProps = {
    dish: DishDto;
    onStatusChange: (dishId: string, newState: DishState) => void;
    onApplyDraft?: (dishId: string) => void;
    onSchedule?: (dish: DishDto) => void;
};

export default function DishListItem({ dish, onStatusChange, onApplyDraft, onSchedule }: DishListItemProps) {
    const hasDraft = !!dish.draft;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                borderColor: hasDraft ? "warning.main" : undefined,
                borderWidth: hasDraft ? 2 : 1,
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography variant="h6">{dish.name}</Typography>
                    {hasDraft && (
                        <Chip
                            icon={<EditIcon />}
                            label="Has Draft"
                            color="warning"
                            size="small"
                        />
                    )}
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography color="text.secondary">
                        €{Number(dish.price).toFixed(2)}
                    </Typography>
                    {hasDraft && dish.draft?.price !== undefined && dish.draft.price !== dish.price && (
                        <Typography color="warning.main" sx={{ fontSize: "0.9rem" }}>
                            → €{Number(dish.draft.price).toFixed(2)} (draft)
                        </Typography>
                    )}
                </Stack>

                <Chip
                    label={dish.state ?? "UNPUBLISHED"}
                    color={colorForState(dish.state)}
                />
            </CardContent>

            <CardActions sx={{ gap: 1, pl: 2, pb: 2, flexWrap: "wrap" }}>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => onStatusChange(dish.id, "PUBLISHED")}
                >
                    Publish
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onStatusChange(dish.id, "UNPUBLISHED")}
                >
                    Unpublish
                </Button>
                <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    onClick={() => onStatusChange(dish.id, "OUT_OF_STOCK")}
                >
                    Out of stock
                </Button>

                {onSchedule && (
                    <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => onSchedule(dish)}
                    >
                        Schedule
                    </Button>
                )}

                <Button
                    component={RouterLink}
                    to={`/owner/dishes/${dish.id}/edit-draft`}
                    variant="outlined"
                    color="primary"
                    size="small"
                >
                    Edit Draft
                </Button>

                {hasDraft && onApplyDraft && (
                    <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => onApplyDraft(dish.id)}
                    >
                        Apply This Draft
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}
