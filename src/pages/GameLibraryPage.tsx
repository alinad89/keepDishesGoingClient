import { useState } from 'react'
import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import {
  PageContainer,
  SearchInput,
  FilterBar,
  Grid,
  LoadingSpinner,
  EmptyState,
  InfoBox,
} from '../components/common'
import { useAddGameToFavourites, useGameLibrary } from '../hooks/useGameLibrary'
import type { GameLibraryEntry } from '../types/game-library.types'

type FilterType = 'all' | 'favourites'

function GameLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const { gameLibrary, isLoading, error, isError, refetch } = useGameLibrary()
  const { addToFavourites, isPending: updatingFavourites } = useAddGameToFavourites()


    const query = searchQuery.trim().toLowerCase()
    const filteredLibrary = gameLibrary.filter(({ game, favourite }) => {
      if (filter === 'favourites' && !favourite) return false

      if (!query) return true

      const haystack = [
        game.name,
        game.shortDescription,
        game.description,
        ...(game.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    });

  const handleToggleFavourite = (entry: GameLibraryEntry) => {
    addToFavourites(entry.game.id, {
      action: entry.favourite ? 'REMOVE_FROM_FAVOURITE' : 'MARK_AS_FAVOURITE',
    })
  }

  const renderAchievements = (entry: GameLibraryEntry) => {
    const total = entry.game.achievements.length
    const obtained = entry.game.achievements.filter(a => a.achievementsObtained).length
    const progress = total === 0 ? 0 : Math.round((obtained / total) * 100)

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
          Achievements {total > 0 ? `${obtained}/${total}` : 'Not available'}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              background: 'linear-gradient(90deg, var(--accent), #60a5fa)',
            },
          }}
        />
      </Box>
    )
  }

  const renderLibraryCard = (entry: GameLibraryEntry) => {
    const cover = entry.game.coverImageUrl || entry.game.thumbnailUrl
    return (
      <Box
        key={entry.game.id}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '100%',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.92))',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 20px 45px rgba(0,0,0,0.65)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 26px 60px rgba(0,0,0,0.75), 0 0 30px rgba(96,165,250,0.15)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 160,
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.65)), url(${cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {entry.favourite && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'rgba(168,85,255,0.32)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
              }}
            >
              Favourite
            </Box>
          )}
        </Box>

        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 300,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-color)',
              }}
            >
              {entry.game.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--muted-text)',
                lineHeight: 1.6,
              }}
            >
              {entry.game.shortDescription || entry.game.description}
            </Typography>
          </Box>

          {entry.game.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {entry.game.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: 'var(--text-color)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontWeight: 300,
                  }}
                />
              ))}
            </Box>
          )}

          {renderAchievements(entry)}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography
              variant="body2"
              sx={{ color: 'var(--muted-text)', fontWeight: 300 }}
            >
              Version {entry.game.version}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="small"
                onClick={() => handleToggleFavourite(entry)}
                disabled={updatingFavourites}
                className={entry.favourite ? 'favourite-active' : ''}
              >
                {entry.favourite ? 'Unfavourite' : 'Favourite'}
              </Button>
              <Button variant="small">Play</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <PageContainer maxWidth="wide">
      <Section
        title="My Library"
        subtitle="Games you've collected, ready to play"
        centered
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search your library..."
          />
          <FilterBar>
            <Button
              variant="small"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'filter-active' : ''}
            >
              All ({gameLibrary.length})
            </Button>
            <Button
              variant="small"
              onClick={() => setFilter('favourites')}
              className={filter === 'favourites' ? 'filter-active' : ''}
            >
              Favourites ({gameLibrary.filter(g => g.favourite).length})
            </Button>
            <Button variant="small" onClick={() => refetch()}>
              Refresh
            </Button>
          </FilterBar>
        </Box>

        {isLoading && <LoadingSpinner size="large" />}

        {isError && !isLoading && (
          <InfoBox title="Unable to load your library" variant="accent">
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

        {!isLoading && !isError && filteredLibrary.length === 0 && (
          <EmptyState
            title={filter === 'favourites' ? 'No favourites yet' : 'Your library is empty'}
            description={
              filter === 'favourites'
                ? 'Mark games as favourites to see them here.'
                : 'Browse games and add them to your library.'
            }
            icon="🎮"
            action={
              <Button variant="primary">
                Discover Games
              </Button>
            }
          />
        )}

        {!isLoading && !isError && filteredLibrary.length > 0 && (
          <Grid columns={3} gap="large">
            {filteredLibrary.map(renderLibraryCard)}
          </Grid>
        )}
      </Section>
    </PageContainer>
  )
}

export default GameLibraryPage