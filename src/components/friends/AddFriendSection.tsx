import { Box, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import Button from '../ui/Button';
import type { Player } from '../../hooks/useFriends';

interface AddFriendSectionProps {
  usernameSearch: string;
  onUsernameSearchChange: (value: string) => void;
  players: Player[];
  searchingPlayers: boolean;
  sendingRequest: boolean;
  sendRequestError: Error | null;
  sentRequests: Set<string>;
  onSendFriendRequest: (player: Player) => void;
}

function AddFriendSection({
  usernameSearch,
  onUsernameSearchChange,
  players,
  searchingPlayers,
  sendingRequest,
  sendRequestError,
  sentRequests,
  onSendFriendRequest,
}: AddFriendSectionProps) {
  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        border: 2,
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 300,
          color: 'text.primary',
        }}
      >
        Add Friend
      </Typography>

      {sendRequestError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {sendRequestError.message}
        </Alert>
      )}

      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          value={usernameSearch}
          onChange={(e) => onUsernameSearchChange(e.target.value)}
          placeholder="Search players by username..."
          variant="outlined"
          size="medium"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
            },
          }}
        />

        {usernameSearch.length >= 2 && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              bgcolor: 'background.paper',
              border: 2,
              borderColor: 'divider',
              borderRadius: 1,
              maxHeight: 300,
              overflowY: 'auto',
              zIndex: 10,
            }}
          >
            {searchingPlayers ? (
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress size={24} />
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>
                  Searching...
                </Typography>
              </Box>
            ) : players.length > 0 ? (
              players.map((player) => (
                <Box
                  key={player.id}
                  sx={{
                    p: 2,
                    borderBottom: 2,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    '&:last-child': {
                      borderBottom: 0,
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 300,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {player.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      ID: {player.id}
                    </Typography>
                  </Box>
                  <Button
                    variant="small"
                    onClick={() => onSendFriendRequest(player)}
                    disabled={sendingRequest || sentRequests.has(player.id)}
                  >
                    {sentRequests.has(player.id)
                      ? 'Request Sent ✓'
                      : sendingRequest
                      ? 'Sending...'
                      : 'Add'}
                  </Button>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  p: 2,
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ color: 'text.secondary' }}>
                  No players found
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AddFriendSection;
