import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button as MuiButton,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { useGame } from '../hooks/useGames';
import {
    useCreateAchievement,
    useDeleteAchievement,
    useGameAchievements,
    useUpdateAchievement,
} from '../hooks/useAchievements';
import type { Achievement } from '../types/achievement.types';

function GameDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { game, loading, error } = useGame(id);
    const gameId = id || '';

    const {
        achievements,
        loading: achievementsLoading,
        error: achievementsError,
        isError: achievementsIsError,
        refetch: refetchAchievements,
    } = useGameAchievements(gameId);
    const {
        createAchievementAsync,
        loading: creatingAchievement,
        error: createAchievementError,
    } = useCreateAchievement(gameId);
    const {
        updateAchievementAsync,
        loading: updatingAchievement,
        error: updateAchievementError,
    } = useUpdateAchievement(gameId);
    const {
        deleteAchievementAsync,
        loading: deletingAchievement,
        error: deleteAchievementError,
    } = useDeleteAchievement(gameId);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [createForm, setCreateForm] = useState({
        name: '',
        instructions: '',
        icon: null as File | null,
    });
    const [editForm, setEditForm] = useState({
        name: '',
        instructions: '',
        icon: null as File | null,
    });

    const handleOpenCreate = () => {
        setCreateForm({ name: '', instructions: '', icon: null });
        setActionError(null);
        setCreateDialogOpen(true);
    };

    const handleOpenEdit = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        setEditForm({
            name: achievement.name,
            instructions: achievement.instructions,
            icon: null,
        });
        setActionError(null);
        setEditDialogOpen(true);
    };

    const handleOpenDelete = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        setActionError(null);
        setDeleteDialogOpen(true);
    };

    const handleCreateSubmit = async () => {
        if (!createForm.icon) {
            setActionError('Icon image is required.');
            return;
        }

        try {
            setActionError(null);
            await createAchievementAsync({
                name: createForm.name,
                instructions: createForm.instructions,
                icon: createForm.icon,
            });
            setCreateDialogOpen(false);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to create achievement');
        }
    };

    const handleEditSubmit = async () => {
        if (!selectedAchievement) return;

        try {
            setActionError(null);
            await updateAchievementAsync({
                achievementId: selectedAchievement.id,
                updates: {
                    name: editForm.name,
                    instructions: editForm.instructions,
                    icon: editForm.icon || undefined,
                },
            });
            setEditDialogOpen(false);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to update achievement');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedAchievement) return;

        try {
            setActionError(null);
            await deleteAchievementAsync(selectedAchievement.id);
            setDeleteDialogOpen(false);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to delete achievement');
        }
    };

    if (loading) {
        return (
            <div className="developer-main-container">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '60vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="developer-main-container">
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error?.apiMessage || 'Game not found'}
                </Alert>
                <MuiButton variant="outlined" onClick={() => navigate('/developer/games')}>
                    Back to Games
                </MuiButton>
            </div>
        );
    }

    return (
        <div className="developer-main-container">
            {/* Header */}
            <div className="page-header">
                <MuiButton
                    variant="outlined"
                    onClick={() => navigate('/developer/games')}
                    sx={{ mb: 2 }}
                >
                    Back to Games
                </MuiButton>
                <h1 className="page-title">{game.name}</h1>
                <p className="page-subtitle">{game.shortDescription}</p>

                {/* Tags as part of header (no "Tags" title) */}
                {game.tags && game.tags.length > 0 && (
                    <Box
                        sx={{
                            mt: 1.5,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            justifyContent: 'center',
                        }}
                    >
                        {game.tags.map((tag: string) => (
                            <Chip
                                key={tag}
                                label={tag.replace(/_/g, ' ')}
                                sx={{
                                    textTransform: 'capitalize',
                                    backgroundColor: 'var(--accent)',
                                    color: 'white',
                                    '& .MuiChip-label': {
                                        color: 'white',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                )}
            </div>

            {/* Cover Image (no card) */}
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Box
                    component="img"
                    src={game.coverImageUrl}
                    alt={game.name}
                    sx={{
                        width: '100%',
                        maxWidth: 800,
                        maxHeight: 320,
                        objectFit: 'cover',
                        borderRadius: 2,
                        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.7)',
                    }}
                />
            </Box>

            {/* Game Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 7 }}>
                    <Typography variant="h4" sx={{ mb: 2, color: 'var(--text-color)' }}>
                        Game Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '200px 1fr',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'var(--text-color)' }}
                        >
                            Game ID:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
                            {game.id}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'var(--text-color)' }}
                        >
                            Game Key:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
                            {game.key}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'var(--text-color)' }}
                        >
                            Version:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
                            {game.version}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'var(--text-color)' }}
                        >
                            Price:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
                            {game.priceAmount > 0 ? `$${game.priceAmount}` : 'Free'}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'var(--text-color)' }}
                        >
                            Game URL:
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'var(--muted-text)', wordBreak: 'break-all' }}
                        >
                            <a
                                href={game.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--accent)', textDecoration: 'none' }}
                            >
                                {game.url}
                            </a>
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'var(--text-color)' }}
                        >
                            Thumbnail:
                        </Typography>
                        <Box>
                            <Box
                                component="img"
                                src={game.thumbnailUrl}
                                alt={`${game.name} thumbnail`}
                                sx={{
                                    width: 200,
                                    height: 'auto',
                                    borderRadius: 1,
                                }}
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Description */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 7 }}>
                    <Typography variant="h4" sx={{ mb: 2, color: 'var(--text-color)' }}>
                        Description
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-wrap', color: 'var(--text-color)' }}
                    >
                        {game.description}
                    </Typography>
                </CardContent>
            </Card>

            {/* Rules */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 7 }}>
                    <Typography variant="h4" sx={{ mb: 2, color: 'var(--text-color)' }}>
                        Rules & Instructions
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-wrap', color: 'var(--text-color)' }}
                    >
                        {game.rules}
                    </Typography>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 7 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ color: 'var(--text-color)' }}>
                            Achievements
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <MuiButton variant="outlined" onClick={() => refetchAchievements()}>
                                Refresh
                            </MuiButton>
                            <MuiButton variant="contained" onClick={handleOpenCreate}>
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
                                            <MuiButton variant="outlined" size="small" onClick={() => handleOpenEdit(achievement)}>
                                                Edit
                                            </MuiButton>
                                            <MuiButton
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleOpenDelete(achievement)}
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

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Link
                    to={`/developer/games/${game.id}/edit`}
                    style={{ textDecoration: 'none' }}
                >
                    <MuiButton variant="contained" color="primary">
                        Edit Game
                    </MuiButton>
                </Link>
                <MuiButton variant="outlined" onClick={() => navigate('/developer/games')}>
                    Back to Games
                </MuiButton>
            </Box>

            {/* Create Achievement Dialog */}
            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Achievement</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        label="Name"
                        value={createForm.name}
                        onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Instructions"
                        value={createForm.instructions}
                        onChange={(event) => setCreateForm((prev) => ({ ...prev, instructions: event.target.value }))}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <Box>
                        <MuiButton variant="outlined" component="label">
                            Upload Icon
                            <input
                                type="file"
                                hidden
                                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] || null;
                                    setCreateForm((prev) => ({ ...prev, icon: file }));
                                }}
                            />
                        </MuiButton>
                        {createForm.icon && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'var(--muted-text)' }}>
                                {createForm.icon.name}
                            </Typography>
                        )}
                    </Box>
                    {(actionError || createAchievementError) && (
                        <Alert severity="error">
                            {actionError || createAchievementError?.apiMessage || createAchievementError?.message}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setCreateDialogOpen(false)} disabled={creatingAchievement}>
                        Cancel
                    </MuiButton>
                    <MuiButton
                        variant="contained"
                        onClick={handleCreateSubmit}
                        disabled={creatingAchievement || !createForm.name || !createForm.instructions}
                    >
                        {creatingAchievement ? 'Saving...' : 'Create'}
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Edit Achievement Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Achievement</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        label="Name"
                        value={editForm.name}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Instructions"
                        value={editForm.instructions}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, instructions: event.target.value }))}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <Box>
                        <MuiButton variant="outlined" component="label">
                            Replace Icon
                            <input
                                type="file"
                                hidden
                                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] || null;
                                    setEditForm((prev) => ({ ...prev, icon: file }));
                                }}
                            />
                        </MuiButton>
                        {editForm.icon && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'var(--muted-text)' }}>
                                {editForm.icon.name}
                            </Typography>
                        )}
                    </Box>
                    {(actionError || updateAchievementError) && (
                        <Alert severity="error">
                            {actionError || updateAchievementError?.apiMessage || updateAchievementError?.message}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setEditDialogOpen(false)} disabled={updatingAchievement}>
                        Cancel
                    </MuiButton>
                    <MuiButton
                        variant="contained"
                        onClick={handleEditSubmit}
                        disabled={updatingAchievement || !editForm.name || !editForm.instructions}
                    >
                        {updatingAchievement ? 'Saving...' : 'Save'}
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Delete Achievement Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Achievement</DialogTitle>
                <DialogContent>
                    <Typography>
                        Delete "{selectedAchievement?.name}"? This cannot be undone.
                    </Typography>
                    {(actionError || deleteAchievementError) && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {actionError || deleteAchievementError?.apiMessage || deleteAchievementError?.message}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setDeleteDialogOpen(false)} disabled={deletingAchievement}>
                        Cancel
                    </MuiButton>
                    <MuiButton
                        variant="contained"
                        color="error"
                        onClick={handleDeleteConfirm}
                        disabled={deletingAchievement}
                    >
                        {deletingAchievement ? 'Deleting...' : 'Delete'}
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GameDetailsPage;
