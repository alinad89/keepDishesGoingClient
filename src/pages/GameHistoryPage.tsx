import { useMemo, useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import {
  PageContainer,
  FilterBar,
  Grid,
  LoadingSpinner,
  EmptyState,
  InfoBox,
} from '../components/common';
import { useGameSessions } from '../hooks/useGameSessions';
import GameSessionDetailModal from '../components/game/GameSessionDetailModal';
import { fetchGameSessionDetail } from '../api/gameSessions';
import type { GameSessionSummary, GameSessionDetail } from '../types/game-session.types';

type ResultFilter = 'all' | 'win' | 'lose' | 'draw';

const resultLabelMap: Record<string, string> = {
  win: 'Win',
  lose: 'Loss',
  draw: 'Draw',
};

const resultColorMap: Record<string, string> = {
  win: 'linear-gradient(135deg, rgba(16,185,129,0.35), rgba(5,150,105,0.2))',
  lose: 'linear-gradient(135deg, rgba(239,68,68,0.35), rgba(248,113,113,0.2))',
  draw: 'linear-gradient(135deg, rgba(148,163,184,0.35), rgba(71,85,105,0.2))',
};

const normalizeResult = (result?: string) => result?.toLowerCase?.() || '';

function GameHistoryPage() {
  const { keycloak, initialized } = useKeycloak();
  const [filter, setFilter] = useState<ResultFilter>('all');
  const [selectedSession, setSelectedSession] = useState<GameSessionDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const {
    gameSessions,
    isLoading,
    isError,
    error,
    refetch,
  } = useGameSessions(Boolean(keycloak.authenticated));

  const filteredSessions = useMemo(() => {
    if (filter === 'all') {
      return gameSessions;
    }
    return gameSessions.filter((session) => normalizeResult(session.result) === filter);
  }, [filter, gameSessions]);

  const handleSessionClick = async (session: GameSessionSummary) => {
    if (!session.id || !session.gameId) {
      console.error('Session is missing id or gameId');
      return;
    }

    setModalOpen(true);
    setLoadingDetail(true);

    try {
      const detail = await fetchGameSessionDetail(session.gameId, session.id);
      setSelectedSession(detail);
    } catch (err) {
      console.error('Failed to fetch session details:', err);
      setSelectedSession(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSession(null);
  };

  const renderSessionCard = (session: GameSessionSummary, index: number) => {
    const normalizedResult = normalizeResult(session.result);
    const resultLabel = resultLabelMap[normalizedResult] || session.result;
    const resultAccent = resultColorMap[normalizedResult] || 'rgba(255,255,255,0.08)';

    return (
      <Box
        key={`${session.date}-${index}`}
        onClick={() => handleSessionClick(session)}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: '14px',
          padding: 3,
          minHeight: '100%',
          background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.92))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 24px 50px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'var(--text-color)', letterSpacing: '0.06em' }}>
            Game #{index + 1}
          </Typography>
          <Chip
            label={resultLabel}
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: 'var(--text-color)',
              background: resultAccent,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Finished At
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--text-color)' }}>
            {session.date}
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleLogin = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    keycloak.login({ redirectUri });
  };

  if (!initialized) {
    return (
      <PageContainer maxWidth="wide">
        <Section title="Game History" subtitle="Loading your session history..." centered>
          <LoadingSpinner size="large" />
        </Section>
      </PageContainer>
    );
  }

  if (!keycloak.authenticated) {
    return (
      <PageContainer maxWidth="wide">
        <Section title="Game History" subtitle="Sign in to see your finished matches" centered>
          <InfoBox title="Login required" variant="accent">
            <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>
              Sign in to view your personal game history.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>
            </Box>
          </InfoBox>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="wide">
      <Section title="Game History" subtitle="Every finished match, all in one place" centered>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
          <FilterBar>
            <Button
              variant="small"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'filter-active' : ''}
            >
              All ({gameSessions.length})
            </Button>
            <Button
              variant="small"
              onClick={() => setFilter('win')}
              className={filter === 'win' ? 'filter-active' : ''}
            >
              Wins ({gameSessions.filter((s) => normalizeResult(s.result) === 'win').length})
            </Button>
            <Button
              variant="small"
              onClick={() => setFilter('lose')}
              className={filter === 'lose' ? 'filter-active' : ''}
            >
              Losses ({gameSessions.filter((s) => normalizeResult(s.result) === 'lose').length})
            </Button>
            <Button
              variant="small"
              onClick={() => setFilter('draw')}
              className={filter === 'draw' ? 'filter-active' : ''}
            >
              Draws ({gameSessions.filter((s) => normalizeResult(s.result) === 'draw').length})
            </Button>
            <Button variant="small" onClick={() => refetch()}>
              Refresh
            </Button>
          </FilterBar>
        </Box>

        {isLoading && <LoadingSpinner size="large" />}

        {isError && !isLoading && (
          <InfoBox title="Unable to load your game history" variant="accent">
            <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>
              {error?.message || 'Something went wrong. Please try again.'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="small" onClick={() => refetch()}>
                Try again
              </Button>
            </Box>
          </InfoBox>
        )}

        {!isLoading && !isError && filteredSessions.length === 0 && (
          <EmptyState
            title={filter === 'all' ? 'No matches yet' : `No ${filter} matches`}
            description="Play a game to build your history."
            icon="🏁"
            action={
              <Button variant="primary">
                Browse Games
              </Button>
            }
          />
        )}

        {!isLoading && !isError && filteredSessions.length > 0 && (
          <Grid columns={3} gap="large">
            {filteredSessions.map(renderSessionCard)}
          </Grid>
        )}
      </Section>

      <GameSessionDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        session={selectedSession}
        loading={loadingDetail}
      />
    </PageContainer>
  );
}

export default GameHistoryPage;
