import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/common';
import Section from '../components/Section';
import Button from '../components/Button';
import { useMyLobbyInvitations, useAcceptLobbyInvitation, useRegisterPlayer } from '../hooks/useLobbies';
import { useAuth } from '../hooks/useAuth';

function InvitationsPage() {
  const navigate = useNavigate();
  const { invitations, loading, error: invitationsError } = useMyLobbyInvitations();
  const { acceptInvitationAsync, loading: acceptingInvitation } = useAcceptLobbyInvitation();
  const { registerPlayerAsync } = useRegisterPlayer();
  const { isAuthenticated } = useAuth();

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const playerRegistrationAttempted = useRef(false);

  // Auto-register user as player when page loads (runs once)
  useEffect(() => {
    if (isAuthenticated && !playerRegistrationAttempted.current) {
      playerRegistrationAttempted.current = true;
      registerPlayerAsync().catch(() => {
        // Ignore errors - user might already be registered
      });
    }
  }, [isAuthenticated, registerPlayerAsync]);

  const handleAcceptInvitation = async (invitationId: string) => {
    setAcceptingId(invitationId);

    try {
      await acceptInvitationAsync(invitationId);
      // Successfully accepted - navigate to lobby page
      setTimeout(() => {
        navigate('/lobby');
      }, 500); // Small delay to let cache invalidate
    } catch (error) {
      const apiError = error as any;
      const errorMessage = apiError?.apiMessage || 'Failed to accept invitation';

      if (errorMessage.includes('already accepted')) {
        alert('This invitation has already been accepted. Redirecting to lobby...');
        navigate('/lobby');
      } else {
        alert(`Failed to accept invitation: ${errorMessage}`);
      }
    } finally {
      setAcceptingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <Section
          title="My Invitations"
          subtitle="Please login to view your invitations"
          centered
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <Section
          title="My Invitations"
          subtitle="Loading..."
          centered
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section
        title="My Invitations"
        subtitle={invitations.length > 0 ? "You have pending lobby invitations" : "No pending invitations"}
        centered
      >
        {invitationsError && (
          <div style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            background: '#ff000020',
            border: '2px solid #ff0000',
            borderRadius: '8px',
            color: '#ff6666',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#ff6666' }}>Error Loading Invitations</h3>
            <p style={{ marginBottom: '0.5rem' }}>
              There was a problem loading your invitations from the server.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#ff9999' }}>
              Technical details: {invitationsError.apiMessage || 'Internal Server Error'}
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              Please try refreshing the page. If the problem persists, contact support.
            </p>
          </div>
        )}

        {!invitationsError && invitations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-secondary)'
          }}>
            <p>You don't have any lobby invitations at the moment.</p>
            <p style={{ marginTop: '1rem' }}>When someone invites you to a lobby, it will appear here.</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                style={{
                  padding: '1.5rem',
                  background: 'var(--card-bg)',
                  border: '2px solid var(--accent)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem',
                    color: 'var(--accent)'
                  }}>
                    {invitation.sender.username} invited you to a lobby
                  </p>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}>
                    {new Date(invitation.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleAcceptInvitation(invitation.id)}
                  disabled={acceptingInvitation || acceptingId === invitation.id}
                >
                  {acceptingId === invitation.id ? 'Accepting...' : 'Accept'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageContainer>
  );
}

export default InvitationsPage;
