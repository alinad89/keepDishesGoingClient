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
} from '@mui/material';
import { useGame } from '../hooks/useGames';

function GameDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { game, loading, error } = useGame(id);

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
        </div>
    );
}

export default GameDetailsPage;
