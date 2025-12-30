import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Section from '../components/ui/Section'
import { usePlatformGame } from '../hooks/usePlatformGames'
import { usePlatformGames } from '../hooks/useGames'
import PaymentButton from '../components/ui/PaymentButton'
import { useAddGameToLibrary } from '../hooks/useGameLibrary.ts'
import { SearchInput, FilterBar, Grid, EmptyState, PageContainer } from '../components/common'
import { GAME_TAGS } from "../schemas/game.schema.ts";
import GameDetailsModal from '../components/game/GameDetailsModal'
import RecommendedGames from '../components/recommendations/RecommendedGames'
import type { ApiError } from '../api/config'

function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  // const { games: apiGames, loading, error } = usePlatformGames(searchQuery)
  const { game: selectedGame, loading: gameDetailsLoading } = usePlatformGame(selectedGameId)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { addGame, isPending: addingToLibrary } = useAddGameToLibrary()

  const handleAddGame = (gameId: string, gameName: string) => {
    addGame(
      { gameId },
      {
        onSuccess: () => {
          toast.success(`${gameName} added to your library!`)
        },
        onError: (error) => {
          const apiError = error as ApiError
          toast.error(
            apiError?.apiMessage || 'Failed to add game to library. Please try again.'
          )
        },
      }
    )
  }

  const trimmedSearch = searchQuery.trim()

  const { games: apiGames, loading, error, refetch } = usePlatformGames({
    searchQuery: trimmedSearch || undefined,
    filterBy: selectedTags.length ? selectedTags : undefined,
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => (
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    ))
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    refetch()
  }

  return (
    <PageContainer>
      {/* Recommended Games Section */}
      <RecommendedGames onViewDetails={setSelectedGameId} />

      <Section
        title="Browse Games"
        subtitle="Discover amazing games and add your favourites"
        centered
      >
        {/* Search and Filter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search games..."
          />
          <FilterBar>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {GAME_TAGS.map(tag => {
                const active = selectedTags.includes(tag)
                return (
                  <Button
                    key={tag}
                    variant="small"
                    onClick={() => toggleTag(tag)}
                    className={active ? 'filter-active' : ''}
                  >
                    {tag.replace(/_/g, ' ')}
                  </Button>
                )
              })}
            </div>
            <Button variant="small" onClick={resetFilters}>
              Clear Filters
            </Button>
          </FilterBar>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Loading games...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--error)' }}>
            Error loading games: {error.apiMessage}
          </div>
        )}

        {/* Games Grid */}
        {!loading && !error && apiGames.length > 0 && (
          <Grid>
            {apiGames.map((game) => (
              <Card
                key={game.id}
                title={game.name}
                description={game.shortDescription || game.description}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '2px solid var(--card-border)'
                }}>
                  <span style={{
                    fontWeight: 200,
                    fontSize: '1.4rem',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '0 2px 10px var(--accent-glow)'
                  }}>
                    {game.priceAmount > 0 ? `$${game.priceAmount}` : 'Free'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {game.owned ? (
                      <Button variant="small" disabled>
                        Owned
                      </Button>
                    ) : game.priceAmount > 0 ? (
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
                      <Button
                          variant="small"
                          onClick={() => setSelectedGameId(game.id)}
                      >
                          View Details
                      </Button>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && !error && apiGames.length === 0 && (
          <EmptyState
            title="No games found"
            description="Try adjusting your search or tag filters."
          />
        )}
      </Section>

      {/* Game Details Modal */}
      <GameDetailsModal
        open={selectedGameId !== null}
        onClose={() => setSelectedGameId(null)}
        game={selectedGame}
        loading={gameDetailsLoading}
      />
    </PageContainer>
  )
}

export default GamesPage
