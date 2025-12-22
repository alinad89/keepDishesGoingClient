import { useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import {
  EmptyState,
  Grid,
  InfoBox,
  LoadingSpinner,
  PageContainer,
} from '../components/common'
import { useGameLibrary } from '../hooks/useGameLibrary'
import {
  AchievementsControls,
  GameCard,
} from './components/AchievementsPageComponents'

function AchievementsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { gameLibrary, isLoading, isError, error, refetch } = useGameLibrary()

  const filteredLibrary = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return gameLibrary

    return gameLibrary.filter(({ game }) => {
      const achievementText = game.achievements
        .map((achievement) => `${achievement.name} ${achievement.instructions}`)
        .join(' ')
      const haystack = [
        game.name,
        game.shortDescription,
        game.description,
        ...(game.tags || []),
        achievementText,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [gameLibrary, searchQuery])

  return (
    <PageContainer maxWidth="wide">
      <Section
        title="Achievements"
        subtitle="See what you can unlock across your games"
        centered
      >
        <AchievementsControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={refetch}
        />

        {isLoading && <LoadingSpinner size="large" />}

        {isError && !isLoading && (
          <InfoBox title="Unable to load achievements" variant="accent">
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
            title="No achievements to show"
            description="Add games to your library to start tracking achievements."
            icon="🏆"
            action={
              <Button variant="primary">
                Browse Games
              </Button>
            }
          />
        )}

        {!isLoading && !isError && filteredLibrary.length > 0 && (
          <Grid columns={2} gap="large">
            {filteredLibrary.map((entry) => (
              <GameCard key={entry.game.id} entry={entry} />
            ))}
          </Grid>
        )}
      </Section>
    </PageContainer>
  )
}

export default AchievementsPage
