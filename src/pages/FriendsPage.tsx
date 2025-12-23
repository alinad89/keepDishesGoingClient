import { useState, useEffect, useRef } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Section from '../components/ui/Section'
import { useFriends, useFriendRequests, useSendFriendRequest, useAcceptFriendRequest, useSearchPlayers, useRemoveFriend, type Player } from '../hooks/useFriends'
import { SearchInput, Grid, EmptyState, PageContainer } from '../components/common'
import { useAuth } from '../hooks/useAuth'
import {useRegisterPlayer} from "../hooks/useRegisterPlayer.ts";

function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [usernameSearch, setUsernameSearch] = useState('')
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())

  const { friends, loading: friendsLoading, error: friendsError } = useFriends()
  const { friendRequests, loading: requestsLoading, error: requestsError } = useFriendRequests()
  const { sendRequest, loading: sendingRequest, error: sendRequestError } = useSendFriendRequest()
  const { acceptRequest, loading: acceptingRequest } = useAcceptFriendRequest()
  const { removeFriend, loading: removingFriend } = useRemoveFriend()
  const { players, loading: searchingPlayers } = useSearchPlayers(usernameSearch)
  const { registerPlayerAsync } = useRegisterPlayer()
  const { isAuthenticated, userId } = useAuth()

  // DEBUG: Log user ID
  useEffect(() => {
    if (userId) {
      console.log('🔍 My User ID (sub from token):', userId);
      console.log('🔍 Friend requests count:', friendRequests.length);
    }
  }, [userId, friendRequests])

  const playerRegistrationAttempted = useRef(false)

  // Ensure user is registered as a player (runs once)
  useEffect(() => {
    if (isAuthenticated && !playerRegistrationAttempted.current) {
      playerRegistrationAttempted.current = true
      console.log('Attempting to register player...')
      registerPlayerAsync()
        .then(() => {
          console.log('Player registration successful')
        })
        .catch((error) => {
          console.log('Player registration error (might already be registered):', error)
        })
    }
  }, [isAuthenticated, registerPlayerAsync])

  const filteredFriends = friends.filter(friend => {
    const matchesSearch =
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleSendFriendRequest = (player: Player) => {
    console.log('Sending friend request to:', player)
    console.log('Player ID:', player.id)
    sendRequest({ receiverId: player.id }, {
      onSuccess: () => {
        console.log('Friend request sent successfully to:', player.username)
        setSentRequests(prev => new Set(prev).add(player.id))
      },
      onError: (error) => {
        console.error('Failed to send friend request:', error)
      },
    })
  }

  const handleAcceptRequest = (requestId: string) => {
    acceptRequest(requestId)
  }

  const handleRemoveFriend = (playerId: string, username: string) => {
    if (confirm(`Are you sure you want to remove ${username} from your friends list?`)) {
      removeFriend(playerId, {
        onSuccess: () => {
          console.log('Friend removed successfully:', username)
        },
        onError: (error) => {
          console.error('Failed to remove friend:', error)
        },
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  if (friendsLoading || requestsLoading) {
    return (
      <PageContainer>
        <Section title="Friends" subtitle="Loading..." centered />
      </PageContainer>
    )
  }

  if (friendsError || requestsError) {
    return (
      <PageContainer>
        <Section
          title="Friends"
          subtitle={`Error: ${friendsError?.apiMessage || requestsError?.apiMessage}`}
          centered
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Section
        title="Friends"
        subtitle="Connect with other players"
        centered
      >
        {/* Add Friend Section */}
        <div style={{
          marginBottom: '3rem',
          padding: '2rem',
          background: 'var(--card-bg)',
          border: '2px solid var(--card-border)',
          borderRadius: '12px',
          position: 'relative'
        }}>
          <h3 style={{
            fontSize: '1.6rem',
            fontWeight: 300,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)'
          }}>
            Add Friend
          </h3>
          {sendRequestError && (
            <div style={{
              padding: '1rem 1.5rem',
              marginBottom: '1.5rem',
              background: 'rgba(220, 38, 38, 0.1)',
              border: '2px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '1.2rem'
            }}>
              Error: {sendRequestError.apiMessage || sendRequestError.message}
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={usernameSearch}
              onChange={(e) => setUsernameSearch(e.target.value)}
              placeholder="Search players by username..."
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1.4rem',
                background: 'var(--bg-secondary)',
                border: '2px solid var(--card-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
            {usernameSearch.length >= 2 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--card-border)',
                borderRadius: '8px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 10
              }}>
                {searchingPlayers ? (
                  <div style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    Searching...
                  </div>
                ) : players.length > 0 ? (
                  players.map((player) => (
                    <div
                      key={player.id}
                      style={{
                        padding: '1.5rem',
                        borderBottom: '2px solid var(--card-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '1.4rem',
                          fontWeight: 300,
                          color: 'var(--text-primary)',
                          marginBottom: '0.5rem'
                        }}>
                          {player.username}
                        </div>
                        <div style={{
                          fontSize: '1.1rem',
                          color: 'var(--text-secondary)'
                        }}>
                          ID: {player.id}
                        </div>
                      </div>
                      <Button
                        variant="small"
                        onClick={() => handleSendFriendRequest(player)}
                        disabled={sendingRequest || sentRequests.has(player.id)}
                      >
                        {sentRequests.has(player.id)
                          ? 'Request Sent ✓'
                          : sendingRequest
                          ? 'Sending...'
                          : 'Add'}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    No players found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Friend Requests Section */}
        {friendRequests.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 300,
              marginBottom: '1.5rem',
              color: 'var(--text-primary)'
            }}>
              Friend Requests ({friendRequests.length})
            </h3>
            <Grid>
              {friendRequests.map((request) => (
                <Card
                  key={request.id}
                  title={request.sender.username}
                  description={request.sender.email}
                >
                  <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '2px solid var(--card-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <span style={{
                      fontWeight: 200,
                      fontSize: '1.1rem',
                      color: 'var(--text-secondary)',
                      letterSpacing: '0.5px'
                    }}>
                      Received: {formatDate(request.issuedAt)}
                    </span>
                    <Button
                      variant="small"
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={acceptingRequest}
                    >
                      {acceptingRequest ? 'Accepting...' : 'Accept Request'}
                    </Button>
                  </div>
                </Card>
              ))}
            </Grid>
          </div>
        )}

        {/* Friends List Section */}
        <div>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: 300,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)'
          }}>
            My Friends ({friends.length})
          </h3>

          {/* Search Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <SearchInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search friends by username or email..."
            />
          </div>

          {/* Friends Grid */}
          {filteredFriends.length > 0 ? (
            <Grid>
              {filteredFriends.map((friend) => (
                <Card
                  key={friend.id}
                  title={friend.username}
                  description={friend.email}
                >
                  <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '2px solid var(--card-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <span style={{
                      fontWeight: 200,
                      fontSize: '1.2rem',
                      color: 'var(--text-secondary)',
                      letterSpacing: '0.5px'
                    }}>
                      Player ID: {friend.id}
                    </span>
                    <Button
                      variant="small"
                      onClick={() => handleRemoveFriend(friend.id, friend.username)}
                      disabled={removingFriend}
                      style={{
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        border: '2px solid rgba(220, 38, 38, 0.3)',
                        color: '#dc2626'
                      }}
                    >
                      {removingFriend ? 'Removing...' : 'Remove Friend'}
                    </Button>
                  </div>
                </Card>
              ))}
            </Grid>
          ) : (
            <EmptyState
              title={friends.length === 0 ? 'No friends yet' : 'No friends found matching your search'}
              description={friends.length === 0 ? 'Start adding friends to connect with other players!' : undefined}
            />
          )}
        </div>
      </Section>
    </PageContainer>
  )
}

export default FriendsPage
