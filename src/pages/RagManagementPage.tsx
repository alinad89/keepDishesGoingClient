import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import Button from '../components/ui/Button';
import { getRagVault, updateRagVault } from '../api/chats';
import type { RagVaultContent } from '../types/chat.types';

function RagManagementPage() {
  const [content, setContent] = useState<string>('');
  const [autoChunk, setAutoChunk] = useState<boolean>(true);
  const [currentChunks, setCurrentChunks] = useState<string[]>([]);
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch current RAG vault content on mount
  useEffect(() => {
    fetchRagContent();
  }, []);

  const fetchRagContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: RagVaultContent = await getRagVault();
      setCurrentChunks(data.content);
      setTotalChunks(data.total_chunks);
      // Join chunks with double newline for editing
      setContent(data.content.join('\n\n'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load RAG content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await updateRagVault({
        content,
        auto_chunk: autoChunk,
      });
      setSuccess(`${response.message} (${response.chunks_added} chunks added)`);
      // Refresh the content to see the updated chunks
      await fetchRagContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update RAG content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: '95%', width: '100%', mx: 'auto', py: 6, px: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '95%', width: '100%', mx: 'auto', py: 6, px: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h1"
          sx={(theme) => ({
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 200,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '100px',
              height: '2px',
              background: theme.palette.primary.main,
              mx: 'auto',
              mt: 2,
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            },
          })}
        >
          Modify RAG Vault
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            fontSize: { xs: '0.9rem', md: '1rem' },
            fontWeight: 100,
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            mx: 'auto',
            mb: 2,
          })}
        >
          Manage the knowledge base content for the chatbot
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Editor Section */}
        <Paper
          sx={(theme) => ({
            p: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Edit Content
          </Typography>
          <TextField
            multiline
            fullWidth
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter RAG vault content here..."
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={autoChunk}
                onChange={(e) => setAutoChunk(e.target.checked)}
              />
            }
            label="Auto-chunk content (recommended)"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving || !content.trim()}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              onClick={fetchRagContent}
              disabled={saving}
            >
              Refresh
            </Button>
          </Box>
        </Paper>

        {/* Preview Section */}
        <Paper
          sx={(theme) => ({
            p: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Current Chunks ({totalChunks})
          </Typography>
          <Box
            sx={{
              maxHeight: '600px',
              overflowY: 'auto',
              '& > *:not(:last-child)': {
                mb: 2,
              },
            }}
          >
            {currentChunks.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                No chunks available. Add content to get started.
              </Typography>
            ) : (
              currentChunks.map((chunk, index) => (
                <Box key={index}>
                  <Paper
                    sx={(theme) => ({
                      p: 2,
                      backgroundColor: theme.palette.background.default,
                      border: `1px solid ${theme.palette.divider}`,
                    })}
                  >
                    <Typography
                      variant="caption"
                      sx={(theme) => ({
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        display: 'block',
                        mb: 1,
                      })}
                    >
                      Chunk {index + 1}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {chunk}
                    </Typography>
                  </Paper>
                  {index < currentChunks.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default RagManagementPage;
