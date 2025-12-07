import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Section from '../components/Section'
import { useGames } from '../hooks/useGames'
import { SearchInput, FilterBar, Grid, EmptyState, PageContainer } from '../components/common'

type FilterType = 'all' | 'favourites'

function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const { games: apiGames, loading, error } = useGames()

  // Load favourites from localStorage on mount
  const [favourites, setFavourites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('hexagon-favourites')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Persist favourites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hexagon-favourites', JSON.stringify([...favourites]))
  }, [favourites])

  const toggleFavourite = (gameId: string) => {
    setFavourites(prev => {
      const newFavs = new Set(prev)
      if (newFavs.has(gameId)) {
        newFavs.delete(gameId)
      } else {
        newFavs.add(gameId)
      }
      return newFavs
    })
  }

  const filteredGames = apiGames
    .filter(game => {
      // Only show ONLINE games to players
      const isOnline = game.status === 'ONLINE';

      // Apply search filter
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Apply favourites filter
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'favourites' && favourites.has(game.id))

      return isOnline && matchesSearch && matchesFilter
    })

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
            <Button
              variant="small"
              onClick={() => setActiveFilter('all')}
              className={activeFilter === 'all' ? 'filter-active' : ''}
            >
              All Games ({apiGames.length})
            </Button>
            <Button
              variant="small"
              onClick={() => setActiveFilter('favourites')}
              className={activeFilter === 'favourites' ? 'filter-active' : ''}
            >
              Favourites ({favourites.size})
            </Button>
          </FilterBar>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <Grid>
            {filteredGames.map((game) => (
              <Card
                key={game.id}
                title={game.name}
                description={game.shortDescription}
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
                    Free
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Button
                      variant="small"
                      onClick={() => toggleFavourite(game.id)}
                      className={favourites.has(game.id) ? 'favourite-active' : ''}
                    >
                      Favourite
                    </Button>
                    <Button variant="small">Play</Button>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        ) : (
          <EmptyState
            title={activeFilter === 'favourites' ? 'No favourite games yet' : 'No games found matching your search'}
            description={activeFilter === 'favourites' ? 'Click the Favourite button on any game to add it to your favourites!' : undefined}
          />
        )}
      </Section>
    </PageContainer>
  )
}

export default GamesPage
