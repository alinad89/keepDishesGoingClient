import { useState, useEffect, useRef } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Section from '../components/ui/Section'
import { useFriends, useFriendRequests, useSendFriendRequest, useAcceptFriendRequest, useSearchPlayers, useRemoveFriend, type Player } from '../hooks/useFriends'
import { SearchInput, Grid, EmptyState, PageContainer } from '../components/common'
import { useAuth } from '../hooks/useAuth'
import {useRegisterPlayer} from "../hooks/useRegisterPlayer.ts";
import AddFriendSection from '../components/friends/AddFriendSection'

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
        <AddFriendSection
          usernameSearch={usernameSearch}
          onUsernameSearchChange={setUsernameSearch}
          players={players}
          searchingPlayers={searchingPlayers}
          sendingRequest={sendingRequest}
          sendRequestError={sendRequestError}
          sentRequests={sentRequests}
          onSendFriendRequest={handleSendFriendRequest}
        />

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
