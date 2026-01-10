import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRecommendations } from '../../hooks/useRecommendations';
import { fetchPlatformGameById } from '../../api/platformGames';
import type { PlatformGameDetails } from '../../types/game.types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PaymentButton from '../ui/PaymentButton';
import { useAddGameToLibrary } from '../../hooks/useGameLibrary';
import { Grid } from '../common';
import type { ApiError } from '../../api/config';

interface RecommendedGamesProps {
  onViewDetails?: (gameId: string) => void;
}

function RecommendedGames({ onViewDetails }: RecommendedGamesProps) {
  const { recommendations, loading: loadingRecommendations, error } = useRecommendations();
  const [games, setGames] = useState<PlatformGameDetails[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const { addGame, isPending: addingToLibrary } = useAddGameToLibrary();

  const handleAddGame = (gameId: string, gameName: string) => {
    addGame({ gameId }, {
      onSuccess: () => {
        toast.success(`${gameName} added to your library!`);
      },
      onError: (error: unknown) => {
        const apiError = error as ApiError;
        toast.error(
          apiError?.apiMessage || 'Failed to add game to library. Please try again.'
        );
      },
    });
  };

  useEffect(() => {
    async function fetchRecommendedGames() {
      if (!recommendations?.recommendations || recommendations.recommendations.length === 0) {
        return;
      }

      setLoadingGames(true);
      setFetchError(false);
      try {
        const gamePromises = recommendations.recommendations.map((rec) =>
          fetchPlatformGameById(rec.id).catch((error) => {
            console.warn(`Skipping unavailable game ${rec.id}:`, error.message || error);
            return null;
          })
        );
        const results = await Promise.all(gamePromises);
        const availableGames = results.filter((game): game is PlatformGameDetails => game !== null);
        setGames(availableGames);
      } catch (error) {
        console.error('Failed to fetch recommended games:', error);
        setFetchError(true);
      } finally {
        setLoadingGames(false);
      }
    }

    fetchRecommendedGames();
  }, [recommendations]);

  // Silently hide if there's an error (don't break the page)
  if (error || fetchError) {
    console.log('Recommendations not available:', error?.message || 'fetch error');
    return null;
  }

  // Hide while loading (don't show loading spinner to keep page clean)
  if (loadingRecommendations || loadingGames) {
    return null;
  }

  // Hide if no recommendations
  if (!recommendations || !games.length) {
    return null;
  }

  return (
    <div style={{ marginBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 200,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--accent)',
            textShadow: '0 2px 10px var(--accent-glow)',
            marginBottom: '0.5rem',
          }}
        >
          Your Recommendations
        </h2>
        <p style={{ color: 'var(--muted-text)', fontSize: '1rem' }}>
          Games picked just for you based on your preferences
        </p>
      </div>

      <Grid>
        {games.map((game) => (
          <Card
            key={game.id}
            title={game.name}
            description={game.shortDescription || game.description}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '2px solid var(--card-border)',
              }}
            >
              <span
                style={{
                  fontWeight: 200,
                  fontSize: '1.4rem',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 2px 10px var(--accent-glow)',
                }}
              >
                {game.priceAmount > 0 ? `$${game.priceAmount}` : 'Free'}
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {game.priceAmount > 0 ? (
                  <PaymentButton gameId={game.id} variant="small">
                    Aquire
                  </PaymentButton>
                ) : (
                  <Button
                    variant="small"
                    disabled={addingToLibrary}
                    onClick={() => handleAddGame(game.id, game.name)}
                  >
                    {addingToLibrary ? 'Adding...' : 'Aquire'}
                  </Button>
                )}
                {onViewDetails && (
                  <Button variant="small" onClick={() => onViewDetails(game.id)}>
                    View Details
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </div>
  );
}

export default RecommendedGames;
