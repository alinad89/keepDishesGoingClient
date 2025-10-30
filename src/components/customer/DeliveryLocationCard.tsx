// src/components/customer/DeliveryLocationCard.tsx
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

type DeliveryLocationCardProps = {
    lat: number;
    lng: number;
};

export default function DeliveryLocationCard({ lat, lng }: DeliveryLocationCardProps) {
    return (
        <Card sx={{ borderRadius: 2, bgcolor: "primary.light", borderLeft: 4, borderColor: "primary.main" }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <LocalShippingIcon sx={{ color: "primary.main", fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={700}>
                        Delivery in Progress
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <LocationOnIcon sx={{ color: "primary.dark", fontSize: 20 }} />
                    <Typography variant="body1" fontWeight={600}>
                        Driver Location:
                    </Typography>
                    <Chip
                        label={`${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`}
                        size="small"
                        sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    />
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Your order is on the way! The driver's location is being updated in real-time.
                </Typography>
            </CardContent>
        </Card>
    );
}
