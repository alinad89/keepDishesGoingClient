import { Card, CardContent, Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FormCardProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
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
                borderRadius: "4px",
                background:
                    "linear-gradient(135deg, rgba(17, 24, 39, 0.96), rgba(15, 23, 42, 0.98))",
                boxShadow: "0 18px 45px rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                transform: "translateZ(0)",
                transition:
                    "transform 0.18s ease-out, box-shadow 0.18s ease-out",
                "&:hover": {
                    transform: "translateY(-1px) translateZ(0)",
                    boxShadow: "0 22px 55px rgba(0, 0, 0, 0.85)",
                },
                "&:focus-within": {
                    boxShadow:
                        "0 0 0 1px var(--accent), 0 0 24px var(--accent-glow)",
                },
            }}
        >
            {/* Step badge */}
            {step && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 14,
                        right: 16,
                        px: 1.6,
                        height: 26,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 999,
                        fontSize: "0.7rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background:
                            "linear-gradient(135deg, rgba(168, 85, 255, 0.22), rgba(236, 72, 153, 0.28))",
                        color: "var(--text-color)",
                        border: "1px solid rgba(248, 250, 252, 0.12)",
                        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.9)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        zIndex: 2,
                    }}
                >
                    STEP&nbsp;{step}
                </Box>
            )}

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: { xs: 2, md: 3 },
                    py: { xs: 1.6, md: 2.1 },
                    background: "transparent", // no header strip
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {icon && (
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.6rem",
                            background:
                                "radial-gradient(circle at 30% 0%, rgba(168, 85, 255, 0.35), rgba(15, 23, 42, 0.95))",
                            color: "var(--accent)",
                            borderRadius: "999px",
                            flexShrink: 0,
                            border: "1px solid rgba(148, 163, 184, 0.45)",
                            boxShadow: "0 10px 26px rgba(0, 0, 0, 0.85)",
                        }}
                    >
                        {icon}
                    </Box>
                )}

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.35,
                    }}
                >
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: { xs: "1.05rem", md: "1.18rem" },
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                            textTransform: "none",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            color: "var(--text-color)",
                        }}
                    >
                        {title}
                    </Typography>

                    {description && (
                        <Typography
                            component="p"
                            sx={{
                                fontSize: "0.86rem",
                                color: "var(--muted-text)",
                                lineHeight: 1.7,
                                opacity: 0.9,
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
                    py: { xs: 2.1, md: 2.5 },
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
}

export default FormCard;
