import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Typography,
    Button as MuiButton,
} from '@mui/material';
import type { Achievement } from '../../types/achievement.types';

export type AchievementsSectionProps = {
    achievements: Achievement[];
    achievementsLoading: boolean;
    achievementsIsError: boolean;
    achievementsError: { apiMessage?: string; message?: string } | null | undefined;
    onRefresh: () => void;
    onAdd: () => void;
    onEdit: (achievement: Achievement) => void;
    onDelete: (achievement: Achievement) => void;
};

export function AchievementsSection({
    achievements,
    achievementsLoading,
    achievementsIsError,
    achievementsError,
    onRefresh,
    onAdd,
    onEdit,
    onDelete,
}: AchievementsSectionProps) {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 7 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ color: 'var(--text-color)' }}>
                        Achievements
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <MuiButton variant="outlined" onClick={onRefresh}>
                            Refresh
                        </MuiButton>
                        <MuiButton variant="contained" onClick={onAdd}>
                            Add Achievement
                        </MuiButton>
                    </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {achievementsLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {achievementsIsError && !achievementsLoading && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {achievementsError?.apiMessage || achievementsError?.message || 'Failed to load achievements'}
                    </Alert>
                )}

                {!achievementsLoading && achievements.length === 0 && (
                    <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
                        No achievements yet. Add the first one for this game.
                    </Typography>
                )}

                {!achievementsLoading && achievements.length > 0 && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: 2,
                        }}
                    >
                        {achievements.map((achievement) => (
                            <Card key={achievement.id} sx={{ backgroundColor: 'rgba(15,23,42,0.6)' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                        <Box
                                            component="img"
                                            src={achievement.iconUrl}
                                            alt={achievement.name}
                                            sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover' }}
                                        />
                                        <Box>
                                            <Typography variant="h6" sx={{ color: 'var(--text-color)' }}>
                                                {achievement.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
                                                {achievement.instructions}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <MuiButton variant="outlined" size="small" onClick={() => onEdit(achievement)}>
                                            Edit
                                        </MuiButton>
                                        <MuiButton
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => onDelete(achievement)}
                                        >
                                            Delete
                                        </MuiButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
