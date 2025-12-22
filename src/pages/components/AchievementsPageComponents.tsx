import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import Button from '../../components/ui/Button'
import { FilterBar, SearchInput } from '../../components/common'
import type { GameLibraryAchievement, GameLibraryEntry } from '../../types/game-library.types'

type AchievementsControlsProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
}

export function AchievementsControls({
  searchQuery,
  onSearchChange,
  onRefresh,
}: AchievementsControlsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
      <SearchInput
        value={searchQuery}
        onValueChange={onSearchChange}
        placeholder="Search games or achievements..."
      />
      <FilterBar>
        <Button variant="small" onClick={onRefresh}>
          Refresh
        </Button>
      </FilterBar>
    </Box>
  )
}

type AchievementListProps = {
  achievements: GameLibraryAchievement[]
}

export function AchievementList({ achievements }: AchievementListProps) {
  if (achievements.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
        No achievements available for this game yet.
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {achievements.map((achievement) => (
        <Box
          key={achievement.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {achievement.iconUrl && (
            <Box
              component="img"
              src={achievement.iconUrl}
              alt={achievement.name}
              sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: 'cover' }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ color: 'var(--text-color)' }}>
              {achievement.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
              {achievement.instructions}
            </Typography>
          </Box>
          <Chip
            label={achievement.achievementsObtained ? 'Unlocked' : 'Locked'}
            size="small"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: 'var(--text-color)',
              background: achievement.achievementsObtained
                ? 'linear-gradient(135deg, rgba(16,185,129,0.35), rgba(5,150,105,0.2))'
                : 'rgba(148,163,184,0.2)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
        </Box>
      ))}
    </Box>
  )
}

type GameCardProps = {
  entry: GameLibraryEntry
}

export function GameCard({ entry }: GameCardProps) {
  const cover = entry.game.coverImageUrl || entry.game.thumbnailUrl
  const total = entry.game.achievements.length
  const obtained = entry.game.achievements.filter((a) => a.achievementsObtained).length
  const progress = total === 0 ? 0 : Math.round((obtained / total) * 100)

  return (
    <Box
      key={entry.game.id}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '14px',
        overflow: 'hidden',
        minHeight: '100%',
        background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.92))',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
      }}
    >
      <Box
        sx={{
          height: 160,
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
            {entry.game.shortDescription || entry.game.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'var(--muted-text)' }}>
            Progress {total > 0 ? `${obtained}/${total}` : 'Not available'}
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

        <AchievementList achievements={entry.game.achievements} />
      </Box>
    </Box>
  )
}
