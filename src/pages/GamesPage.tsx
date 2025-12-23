import { useState } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Section from '../components/ui/Section'
import { usePlatformGame } from '../hooks/usePlatformGames'
import { usePlatformGames } from '../hooks/useGames'
import PaymentButton from '../components/ui/PaymentButton'
import { useAddGameToLibrary } from '../hooks/useGameLibrary.ts'
import { SearchInput, FilterBar, Grid, EmptyState, PageContainer } from '../components/common'
import { GAME_TAGS } from "../schemas/game.schema.ts";

function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  // const { games: apiGames, loading, error } = usePlatformGames(searchQuery)
  const { game: selectedGame, loading: gameDetailsLoading } = usePlatformGame(selectedGameId)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { addGame, isPending: addingToLibrary } = useAddGameToLibrary()

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
  if (loading) {
    return (
      <PageContainer>
        <Section title="Browse Games" subtitle="Loading games..." centered />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <Section
          title="Browse Games"
          subtitle={`Error loading games: ${error.apiMessage}`}
          centered
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
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

        {/* Games Grid */}
        {apiGames.length > 0 ? (
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
                        onClick={() => addGame({ gameId: game.id })}
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
        ) : (
          <EmptyState
            title="No games found"
            description="Try adjusting your search or tag filters."
          />
        )}
      </Section>

      {/* Game Details Modal */}
      {selectedGameId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={() => setSelectedGameId(null)}
        >
          <div
            style={{
              background: 'var(--card-bg)',
              border: '3px solid var(--accent)',
              borderRadius: '12px',
              padding: '2.5rem',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {gameDetailsLoading ? (
              <p>Loading game details...</p>
            ) : selectedGame ? (
              <>
                <h2 style={{
                  color: 'var(--accent)',
                  marginBottom: '1.5rem',
                  fontSize: '2.4rem'
                }}>
                  {selectedGame.name}
                </h2>

                {selectedGame.coverImageUrl && (
                  <img
                    src={selectedGame.coverImageUrl}
                    alt={selectedGame.name}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      marginBottom: '1.5rem'
                    }}
                  />
                )}

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Description</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {selectedGame.description}
                  </p>
                </div>

                {selectedGame.tags && selectedGame.tags.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Tags</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {selectedGame.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.4rem 1rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '4px',
                            fontSize: '1.2rem',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedGame.rules && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Rules</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {selectedGame.rules}
                    </p>
                  </div>
                )}

                {selectedGame.achievements && selectedGame.achievements.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                      Achievements ({selectedGame.achievements.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {selectedGame.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px'
                          }}
                        >
                          {achievement.iconUrl && (
                            <img
                              src={achievement.iconUrl}
                              alt={achievement.name}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '4px'
                              }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                              {achievement.name}
                            </h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                              {achievement.instructions}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedGameId(null)}
                  >
                    Close
                  </Button>
                  <Button variant="primary">
                    Play Now
                  </Button>
                </div>
              </>
            ) : (
              <p>Game not found</p>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default GamesPage
