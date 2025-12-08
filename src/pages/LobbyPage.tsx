import { useState, useEffect, useRef } from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import Card from '../components/Card';
import { PageContainer, Grid } from '../components/common';
import { useGames } from '../hooks/useGames';
import {
  useCreateLobby,
  useRegisterPlayer,
  useMyLobby,
  useSendLobbyInvitation,
  useMyLobbyInvitations,
  useAcceptLobbyInvitation,
  useChangeLobbyStatus,
  useLeaveLobby,
  useAllPlayers,
} from '../hooks/useLobbies';
import { useAuth } from '../hooks/useAuth';
import { useGameSessionWebSocket, type ExternalSessionMessage } from '../hooks/useGameSessionWebSocket';

function LobbyPage() {
  const { games, loading: gamesLoading } = useGames();
  const { createLobbyAsync, loading: creatingLobby, error: lobbyError } = useCreateLobby();
  const { registerPlayerAsync } = useRegisterPlayer();
  const { lobby, loading: lobbyLoading, error: lobbyFetchError, refetch: refetchLobby } = useMyLobby();
  const { invitations } = useMyLobbyInvitations();
  const { acceptInvitationAsync, loading: acceptingInvitation } = useAcceptLobbyInvitation();
  const { sendInvitationAsync, loading: sendingInvitation } = useSendLobbyInvitation();
  const { changeLobbyStatusAsync, loading: startingGame } = useChangeLobbyStatus();
  const { leaveLobbyAsync, loading: leavingLobby } = useLeaveLobby();
  const { players: allPlayers, loading: playersLoading } = useAllPlayers();
  const { isAuthenticated, userEmail, username } = useAuth();

  // Filter out current user and players already in the lobby from invite list
  const availablePlayers = allPlayers.filter(player => {
    // Don't show current user (match by email or username)
    if (player.email === userEmail || player.username === username) {
      return false;
    }

    // Don't show players already in the lobby
    if (lobby?.otherParticipants?.some(p => p.id === player.id)) {
      return false;
    }

    return true;
  });


  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showGameStartedModal, setShowGameStartedModal] = useState(false);
  const [showJoinedLobbyModal, setShowJoinedLobbyModal] = useState(false);
  const [waitingForSession, setWaitingForSession] = useState(false);
  const [sessionLink, setSessionLink] = useState<string | null>(null);
  const [externalSession, setExternalSession] = useState<ExternalSessionMessage | null>(null);
  const [sessionSocketError, setSessionSocketError] = useState<string | null>(null);

  const previousLobbyStatusRef = useRef<string | null>(null);
  const playerRegistrationAttempted = useRef(false);

  // Ensure user is registered as a player (runs once)
  useEffect(() => {
    if (isAuthenticated && !playerRegistrationAttempted.current) {
      playerRegistrationAttempted.current = true;
      registerPlayerAsync().catch(() => {
        // Ignore errors - user might already be registered
      });
    }
  }, [isAuthenticated, registerPlayerAsync]);

  useEffect(() => {
    if (!lobby) {
      setSessionLink(null);
      setExternalSession(null);
      setWaitingForSession(false);
      return;
    }

    setSessionLink(lobby.gameSessionLink || null);
  }, [lobby?.lobbyId]);

  useEffect(() => {
    if (lobby?.gameSessionLink) {
      setSessionLink(lobby.gameSessionLink);
    }
  }, [lobby?.gameSessionLink]);

  // Show modal when user first joins a lobby as non-owner
  useEffect(() => {
    if (lobby && !lobby.isOwner && lobby.status === 'WAITING') {
      setShowJoinedLobbyModal(true);
    }
  }, [lobby?.lobbyId]); // Only runs when lobbyId changes (user joins a lobby)

  // Show modal when game starts for non-owners
  useEffect(() => {
    if (!lobby) {
      previousLobbyStatusRef.current = null;
      return;
    }

    if (!lobby.isOwner && previousLobbyStatusRef.current === 'WAITING' && lobby.status === 'IN_GAME') {
      setShowGameStartedModal(true);
    }

    previousLobbyStatusRef.current = lobby.status;
  }, [lobby?.status, lobby?.isOwner]);

  useEffect(() => {
    if (lobby && !lobby.isOwner && (externalSession || sessionLink)) {
      setShowGameStartedModal(true);
    }
  }, [externalSession, lobby?.isOwner, lobby?.lobbyId, sessionLink]);

  const { isConnected: sessionSocketConnected } = useGameSessionWebSocket({
    enabled: Boolean(lobby?.lobbyId),
    lobbyId: lobby?.lobbyId || null,
    onSessionLink: (link: string) => {
      setSessionSocketError(null);
      setExternalSession(null);
      setSessionLink(link);
      setWaitingForSession(false);
      refetchLobby();
    },
    onExternalSession: (payload: ExternalSessionMessage) => {
      setSessionSocketError(null);
      setSessionLink(null);
      setExternalSession(payload);
      setWaitingForSession(false);
      refetchLobby();
    },
    onFinished: () => {
      setWaitingForSession(false);
      setExternalSession(null);
      setSessionLink(null);
      refetchLobby();
    },
    onError: (message) => setSessionSocketError(message),
  });

  const handleCreateLobby = async (gameId: string) => {
    if (!isAuthenticated) {
      alert('Please login to create a lobby');
      return;
    }

    try {
      setSelectedGameId(gameId);
      await createLobbyAsync({ gameId });
    } catch (error) {
      const apiError = error as any;
      const errorMessage = apiError?.apiMessage || 'Failed to create lobby';

      if (errorMessage.includes('already has a lobby')) {
        alert('You already have an active lobby. Please leave your current lobby first before creating a new one.');
      } else {
        alert(`Failed to create lobby: ${errorMessage}`);
      }
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await acceptInvitationAsync(invitationId);
    } catch (error) {
      alert('Failed to accept invitation');
    }
  };

  const handleInvitePlayer = async (playerId: string) => {
    if (!lobby) return;

    try {
      await sendInvitationAsync({
        receiver: playerId,
        lobby: lobby.lobbyId,
      });
      alert('Invitation sent!');
      setShowInviteDialog(false);
    } catch (error) {
      alert('Failed to send invitation');
    }
  };

  const handleStartGame = async () => {
    try {
      setWaitingForSession(true);
      setSessionSocketError(null);
      setSessionLink(null);
      setExternalSession(null);
      await changeLobbyStatusAsync({ action: 'START_GAME' });
    } catch (error) {
      const apiError = error as any;
      setWaitingForSession(false);
      alert(`Failed to start game: ${apiError?.apiMessage || 'Unknown error'}`);
    }
  };

  const handleLeaveLobby = async () => {
    if (!confirm('Are you sure you want to leave this lobby?')) {
      return;
    }

    try {
      await leaveLobbyAsync();
    } catch (error) {
      const apiError = error as any;
      alert(`Failed to leave lobby: ${apiError?.apiMessage || 'Unknown error'}`);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <Section
          title="Game Lobby"
          subtitle="Please login to create or join lobbies"
          centered
        />
      </PageContainer>
    );
  }

  if (gamesLoading || lobbyLoading) {
    return (
      <PageContainer>
        <Section
          title="Game Lobby"
          subtitle="Loading..."
          centered
        />
      </PageContainer>
    );
  }

  // Show active lobby if player is in one
  if (lobby) {
    const sessionLinkToUse = sessionLink || lobby.gameSessionLink || null;
    const hasSessionInfo = Boolean(sessionLinkToUse || externalSession);
    const isGameStarted = lobby.status === 'IN_GAME' || hasSessionInfo;
    const isOwner = lobby.isOwner;

    if (waitingForSession) {
      return (
        <PageContainer>
          <Section
            title={`Starting ${lobby.game.name}`}
            subtitle="Preparing your game session..."
            centered
          >
            <div style={{
              padding: '2rem',
              background: 'var(--card-bg)',
              borderRadius: '12px',
              border: '2px dashed var(--accent)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                Waiting for the game session details to arrive...
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                WebSocket status: {sessionSocketConnected ? 'connected' : 'connecting...'}
              </p>
              {sessionSocketError && (
                <p style={{ color: '#ff6666' }}>
                  {sessionSocketError}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="secondary"
                  onClick={handleLeaveLobby}
                  disabled={leavingLobby}
                >
                  {leavingLobby ? 'Leaving...' : 'Leave Lobby'}
                </Button>
              </div>
            </div>
          </Section>
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <Section
          title={`Lobby: ${lobby.game.name}`}
          subtitle={`Status: ${lobby.status}`}
          centered
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {externalSession && (
              <div style={{
                padding: '2rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--accent)',
                borderRadius: '8px'
              }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>
                  Game Session Ready
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  To play this game one of you should use the link, then copy and paste both userIds inside the game before starting
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ minWidth: '80px', color: 'var(--text-secondary)' }}>User ID 1</span>
                    <input
                      type="text"
                      value={externalSession.playerId1}
                      readOnly
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'var(--bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '4px',
                        color: 'var(--text)',
                        fontFamily: 'monospace'
                      }}
                    />
                    <Button
                      variant="primary"
                      onClick={() => handleCopy(externalSession.playerId1, 'externalPlayer1')}
                    >
                      {copiedField === 'externalPlayer1' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ minWidth: '80px', color: 'var(--text-secondary)' }}>User ID 2</span>
                    <input
                      type="text"
                      value={externalSession.playerId2}
                      readOnly
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'var(--bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '4px',
                        color: 'var(--text)',
                        fontFamily: 'monospace'
                      }}
                    />
                    <Button
                      variant="primary"
                      onClick={() => handleCopy(externalSession.playerId2, 'externalPlayer2')}
                    >
                      {copiedField === 'externalPlayer2' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => window.open(externalSession.url, '_blank')}
                >
                  Go to Game
                </Button>
              </div>
            )}

            {!externalSession && sessionLinkToUse && (
              <div style={{
                padding: '2rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--accent)',
                borderRadius: '8px'
              }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>
                  Game Session Ready
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Click start to jump into the match.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Button
                    variant="primary"
                    onClick={() => window.location.href = sessionLinkToUse}
                  >
                    Start Game
                  </Button>
                </div>

                {isOwner && (
                  <>
                    <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                      Share this session link with other players:
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <input
                        type="text"
                        value={sessionLinkToUse}
                        readOnly
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'var(--bg)',
                          border: '1px solid var(--card-border)',
                          borderRadius: '4px',
                          color: 'var(--text)',
                          fontFamily: 'monospace'
                        }}
                      />
                      <Button
                        variant="primary"
                        onClick={() => handleCopy(sessionLinkToUse, 'link')}
                      >
                        {copiedField === 'link' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>

                    {lobby.playerIds && lobby.playerIds.length > 0 && (
                      <div>
                        <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                          Player IDs:
                        </p>
                        {lobby.playerIds.map((playerId, index) => (
                          <div
                            key={playerId}
                            style={{
                              display: 'flex',
                              gap: '0.5rem',
                              alignItems: 'center',
                              marginBottom: '0.5rem'
                            }}
                          >
                            <input
                              type="text"
                              value={playerId}
                              readOnly
                              style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: 'var(--bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '4px',
                                color: 'var(--text)',
                                fontFamily: 'monospace'
                              }}
                            />
                            <Button
                              variant="primary"
                              onClick={() => handleCopy(playerId, `player${index}`)}
                            >
                              {copiedField === `player${index}` ? 'Copied!' : 'Copy'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {!externalSession && !sessionLinkToUse && isGameStarted && (
              <div style={{
                padding: '2rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--accent)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>
                  Game Started!
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {isOwner
                    ? 'Waiting for the session link to arrive from the server...'
                    : 'The lobby owner will share the game link and player IDs with you shortly.'}
                </p>
              </div>
            )}

            {/* Waiting State */}
            {!isGameStarted && (
              <>
                {/* Players */}
                <div style={{
                  padding: '1.5rem',
                  background: 'var(--card-bg)',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ marginBottom: '1rem' }}>Players:</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ padding: '0.5rem', color: 'var(--accent)' }}>
                      You {isOwner && '(Host)'}
                    </li>
                    {lobby.otherParticipants && lobby.otherParticipants.length > 0 ? (
                      lobby.otherParticipants.map((player) => (
                        <li key={player.id} style={{ padding: '0.5rem' }}>
                          {player.username}
                        </li>
                      ))
                    ) : (
                      <li style={{ padding: '0.5rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        No other players yet
                      </li>
                    )}
                  </ul>
                </div>

                {/* Actions (only for owner) */}
                {isOwner && (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button
                      variant="primary"
                      onClick={() => setShowInviteDialog(!showInviteDialog)}
                    >
                      Invite Player
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleStartGame}
                      disabled={startingGame}
                    >
                      {startingGame ? 'Starting...' : 'Start Game'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleLeaveLobby}
                      disabled={leavingLobby}
                    >
                      {leavingLobby ? 'Leaving...' : 'Leave Lobby'}
                    </Button>
                  </div>
                )}

                {/* Non-owner waiting message */}
                {!isOwner && (
                  <>
                    <div style={{
                      padding: '1rem',
                      background: 'var(--card-bg)',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        Waiting for host to start the game...
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Button
                        variant="secondary"
                        onClick={handleLeaveLobby}
                        disabled={leavingLobby}
                      >
                        {leavingLobby ? 'Leaving...' : 'Leave Lobby'}
                      </Button>
                    </div>

                    {/* Modal when user joins lobby */}
                    {showJoinedLobbyModal && (
                      <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                      }}>
                        <div style={{
                          background: 'var(--card-bg)',
                          border: '3px solid var(--accent)',
                          borderRadius: '12px',
                          padding: '2.5rem',
                          maxWidth: '500px',
                          textAlign: 'center',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                        }}>
                          <h2 style={{
                            color: 'var(--accent)',
                            marginBottom: '1.5rem',
                            fontSize: '1.8rem'
                          }}>
                            Welcome to the Lobby!
                          </h2>
                          <p style={{
                            color: 'var(--text)',
                            marginBottom: '1rem',
                            fontSize: '1.1rem'
                          }}>
                            You've successfully joined the lobby.
                          </p>
                          <p style={{
                            color: 'var(--text-secondary)',
                            marginBottom: '2rem'
                          }}>
                            The host will start the game and share the game link and player IDs with you.
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => setShowJoinedLobbyModal(false)}
                          >
                            Got it!
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Invite Dialog */}
                {showInviteDialog && isOwner && (
                  <div style={{
                    padding: '1.5rem',
                    background: 'var(--card-bg)',
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ marginBottom: '1rem' }}>Invite a Player:</h3>
                    {playersLoading ? (
                      <p>Loading players...</p>
                    ) : availablePlayers.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)' }}>
                        No other players available to invite
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {availablePlayers.map((player) => (
                          <div
                            key={player.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.5rem',
                              background: 'var(--bg)',
                              borderRadius: '4px'
                            }}
                          >
                            <div>
                              <span>{player.username}</span>
                              {player.email && (
                                <span style={{
                                  marginLeft: '0.5rem',
                                  fontSize: '0.85rem',
                                  color: 'var(--text-secondary)'
                                }}>
                                  ({player.email})
                                </span>
                              )}
                            </div>
                            <Button
                              variant="small"
                              onClick={() => handleInvitePlayer(player.id)}
                              disabled={sendingInvitation}
                            >
                              {sendingInvitation ? 'Sending...' : 'Invite'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {!isOwner && showGameStartedModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: 'var(--card-bg)',
                  border: '3px solid var(--accent)',
                  borderRadius: '12px',
                  padding: '2.5rem',
                  maxWidth: '500px',
                  textAlign: 'center',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                }}>
                  <h2 style={{
                    color: 'var(--accent)',
                    marginBottom: '1.5rem',
                    fontSize: '1.8rem'
                  }}>
                    Game Started!
                  </h2>
                  <p style={{
                    color: 'var(--text)',
                    marginBottom: '1rem',
                    fontSize: '1.1rem'
                  }}>
                    The lobby owner has received the game link and player IDs that need to be copied.
                  </p>
                  <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem'
                  }}>
                    They will share these details with you so you can join the game.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowGameStartedModal(false)}
                  >
                    Got it!
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Section>
      </PageContainer>
    );
  }

  // Show invitations
  if (invitations.length > 0) {
    return (
      <PageContainer>
        <Section
          title="Lobby Invitations"
          subtitle="You have pending invitations"
          centered
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                style={{
                  padding: '1.5rem',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {invitation.sender.username} invited you to a lobby
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(invitation.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleAcceptInvitation(invitation.id)}
                  disabled={acceptingInvitation}
                >
                  {acceptingInvitation ? 'Accepting...' : 'Accept'}
                </Button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Or create a new lobby:
            </p>
          </div>
        </Section>
      </PageContainer>
    );
  }

  // Show game selection (default view)
  return (
    <PageContainer>
      <Section
        title="Game Lobby"
        subtitle="Select a game to create a new lobby"
        centered
      >
        {lobbyFetchError && (
          <div style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            background: '#ff000020',
            border: '2px solid #ff0000',
            borderRadius: '8px',
            color: '#ff6666',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#ff6666' }}>Lobby Error</h3>
            <p style={{ marginBottom: '1rem' }}>
              There's an issue with your lobby data. This is likely a backend synchronization problem.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#ff9999' }}>
              Technical details: {lobbyFetchError.apiMessage || 'Failed to fetch lobby data'}
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              Please contact support or wait for the backend to resolve the issue.
            </p>
          </div>
        )}

        {lobbyError && (
          <div style={{
            padding: '1rem',
            marginBottom: '2rem',
            background: '#ff000020',
            border: '1px solid #ff0000',
            borderRadius: '4px',
            color: '#ff6666'
          }}>
            Error: {lobbyError.apiMessage}
          </div>
        )}

        {games.filter(game => game.status === 'ONLINE').length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No online games available yet
          </p>
        ) : (
          <Grid>
            {games.filter(game => game.status === 'ONLINE').map((game) => (
              <Card
                key={game.id}
                title={game.name}
                description={game.shortDescription}
              >
                <div style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '2px solid var(--card-border)'
                }}>
                  <Button
                    variant="primary"
                    onClick={() => handleCreateLobby(game.id)}
                    disabled={creatingLobby && selectedGameId === game.id}
                  >
                    {creatingLobby && selectedGameId === game.id
                      ? 'Creating...'
                      : 'Create Lobby'}
                  </Button>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </Section>
    </PageContainer>
  );
}

export default LobbyPage;
