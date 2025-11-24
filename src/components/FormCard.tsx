import { Card, CardContent, Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FormCardProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    step?: number | string;
}

function FormCard({
                      icon,
                      title,
                      description,
                      children,
                      className,
                      step,
                  }: FormCardProps) {
    return (
        <Card
            className={className}
            elevation={0}
            sx={{
                position: "relative",
                p: 0,
                overflow: "hidden",
                borderRadius: 3,
                clipPath: "none",
                background: "linear-gradient(135deg, var(--card-bg) 0%, var(--bg-color) 100%)",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.55)",
                transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.85)",
                },
                "&:focus-within": {
                    boxShadow: "0 0 0 1px var(--accent), 0 0 22px var(--accent-glow)",
                },
            }}
        >
            {/* Step badge */}
            {step && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        minWidth: 34,
                        height: 34,
                        px: 1,
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        boxShadow: "0 10px 22px rgba(15, 23, 42, 0.9)",
                        zIndex: 1,
                    }}
                >
                    {step}
                </Box>
            )}

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: { xs: 2, md: 3 },
                    py: { xs: 1.5, md: 2 },
                    background:
                        "linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(34, 197, 94, 0.04))",
                    position: "relative",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: 120,
                        height: 2,
                        background: "linear-gradient(90deg, var(--accent), transparent)",
                        opacity: 0.85,
                    },
                }}
            >
                {icon && (
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.8rem",
                            background: "rgba(15, 23, 42, 0.85)",
                            color: "var(--accent)",
                            borderRadius: "999px",
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </Box>
                )}

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.4 }}>
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: { xs: "1rem", md: "1.15rem" },
                            textTransform: "uppercase",
                            letterSpacing: "0.16em",
                            fontWeight: 500,
                            color: "var(--accent)",
                            mb: description ? 0.25 : 0,
                        }}
                    >
                        {title}
                    </Typography>
                    {description && (
                        <Typography
                            component="p"
                            sx={{
                                fontSize: "0.9rem",
                                color: "var(--muted-text)",
                                lineHeight: 1.6,
                            }}
                        >
                            {description}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Content */}
            <CardContent
                sx={{
                    px: { xs: 2, md: 3 },
                    py: { xs: 2, md: 2.4 },
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
}

export default FormCard;
