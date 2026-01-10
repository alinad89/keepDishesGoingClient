import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './DeveloperDocsPage.css';

export default function DeveloperDocsPage() {
  const [abcModalOpen, setAbcModalOpen] = useState(false);

  return (
    <div className="dev-docs-page">
      <div className="dev-docs-container">
        {/* Hero Section */}
        <section className="dev-docs-hero">
          <CodeIcon sx={{ fontSize: 60, color: 'var(--accent)', mb: 2 }} />
          <h1 className="dev-docs-title">Welcome to Hexagon SDK</h1>
          <p className="dev-docs-subtitle">
            Build amazing turn-based games with AI capabilities
          </p>
        </section>

        {/* Getting Started */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Getting Started</h2>
          <p className="section-text">
            To become a contributor and add your own game to our platform, follow these integration guidelines.
          </p>
        </section>

        {/* SDK Installation */}
        <section className="dev-docs-section">
          <h2 className="section-heading">1. Install the SDK</h2>
          <p className="section-text">
            Import version <code className="inline-code">1.2.0</code> of our SDK:
          </p>
          <pre className="code-block">
            <code>pip install game-client==1.2.0</code>
          </pre>
        </section>

        {/* Implement ABC */}
        <section className="dev-docs-section">
          <h2 className="section-heading">2. Implement the Game Interface</h2>
          <p className="section-text">
            Your game must implement the following abstract base class:
          </p>
          <pre className="code-block">
            <code>from game_sdk.ai_client import TurnBasedGame</code>
          </pre>

          <button
            className="view-interface-btn"
            onClick={() => setAbcModalOpen(true)}
          >
            <CodeIcon sx={{ mr: 1 }} />
            View Full Interface
          </button>

          <div className="info-box">
            <strong>Required Methods:</strong>
            <ul>
              <li><code>current_player()</code> - Returns current player index</li>
              <li><code>get_legal_actions()</code> - Returns list of legal moves</li>
              <li><code>is_game_over()</code> - Returns True if game ended</li>
              <li><code>game_result()</code> - Returns outcome from current player's perspective</li>
              <li><code>move(action)</code> - Applies move and returns new game state</li>
            </ul>
          </div>
        </section>

        {/* Optional Methods */}
        <section className="dev-docs-section">
          <h2 className="section-heading">3. Optional: Enhanced AI Performance</h2>

          <h3 className="subsection-heading">Heuristic Evaluation</h3>
          <p className="section-text">
            Implement <code className="inline-code">get_heuristic()</code> for better AI performance:
          </p>
          <pre className="code-block">
{`def get_heuristic(self) -> Optional[float]:
    """
    Return heuristic evaluation of current state.
    Positive = favorable, Negative = unfavorable
    """
    return self.count_player_pieces(0) - self.count_player_pieces(1)`}
          </pre>

          <h3 className="subsection-heading">State Comparison (Tree Reuse)</h3>
          <p className="section-text">
            Implement these methods for faster MCTS with tree reuse:
          </p>
          <pre className="code-block">
{`def __eq__(self, other):
    if not isinstance(other, YourGame):
        return False
    return self.board == other.board and self.player == other.player

def __hash__(self):
    return hash((tuple(self.board), self.player))`}
          </pre>
        </section>

        {/* AI Integration */}
        <section className="dev-docs-section">
          <h2 className="section-heading">4. AI Integration</h2>
          <p className="section-text">
            Learn how to implement AI agents with different MCTS strategies.
          </p>
          <Link to="/developer/docs/ai-integration" className="link-button">
            View AI Integration Guide →
          </Link>
        </section>

        {/* Deployment */}
        <section className="dev-docs-section">
          <h2 className="section-heading">5. Deploy Your Game</h2>
          <p className="section-text">
            Choose your deployment method:
          </p>
          <div className="deployment-options">
            <div className="deployment-card">
              <h4>Backend ZIP</h4>
              <p>Let us host your game. Upload your game as a ZIP file.</p>
            </div>
            <div className="deployment-card">
              <h4>External URL</h4>
              <p>Self-host your game and provide a URL endpoint.</p>
            </div>
          </div>
          <Link to="/developer/games/new" className="link-button">
            Add Your Game →
          </Link>
        </section>

        {/* Achievements */}
        <section className="dev-docs-section">
          <h2 className="section-heading">6. Achievement Integration</h2>

          <div className="warning-box">
            <strong><WarningIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> IMPORTANT:</strong> All achievements must have unique names and match exactly
            between your code and the platform configuration.
          </div>

          <h3 className="subsection-heading">Setup API Key</h3>
          <p className="section-text">
            Add your Developer API Key to your <code className="inline-code">.env</code> file:
          </p>
          <pre className="code-block">
            <code>DEVELOPER_API_KEY=your-uuid-here</code>
          </pre>
          <p className="section-text">
            Generate your API key when registering your game on the platform.
          </p>

          <h3 className="subsection-heading">Publishing Achievements</h3>
          <pre className="code-block">
{`from game_sdk import EventPublisher, EventPublisherConfig

# Initialize publisher (reads API key from environment)
publisher = EventPublisher(EventPublisherConfig())

# Publish achievement
publisher.publish_achievement_unlocked(
    subject_id="player-123",
    achievement_name="FIRST_WIN"
)`}
          </pre>

          <Link to="/developer/docs/achievements" className="link-button">
            Full Achievement Guide →
          </Link>
        </section>

        {/* Best Practices */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Best Practices</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h4><EditIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Consistent Naming</h4>
              <p>Use uppercase with underscores for achievement names: <code>FIRST_WIN</code></p>
            </div>
            <div className="tip-card">
              <h4><VpnKeyIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> API Key Security</h4>
              <p>Never commit your API key to version control. Use environment variables.</p>
            </div>
            <div className="tip-card">
              <h4><ScienceIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Test Locally</h4>
              <p>Test your game thoroughly before deployment. Check all edge cases.</p>
            </div>
            <div className="tip-card">
              <h4><MenuBookIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Clear Documentation</h4>
              <p>Document your game rules and available actions for players.</p>
            </div>
          </div>
        </section>
      </div>

      {/* ABC Interface Modal */}
      <Dialog
        open={abcModalOpen}
        onClose={() => setAbcModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          TurnBasedGame Interface
          <IconButton
            onClick={() => setAbcModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <pre className="code-block" style={{ maxHeight: '60vh', overflow: 'auto' }}>
{`class TurnBasedGame(ABC):
    """
    Generic interface that any turn-based game must implement.

    This interface matches the GameEnv Protocol, meaning any TurnBasedGame
    can be used directly with MCTS without adapters!

    Subclasses must implement:
    - current_player() - Returns current player index (0, 1, etc.)
    - get_legal_actions() - Returns list of legal moves
    - is_game_over() - Returns True if game ended
    - game_result() - Returns outcome from current player's perspective
    - move(action) - Applies move and returns new game state
    """

    @abstractmethod
    def current_player(self) -> int:
        """
        Return the index of the player whose turn it is.
        Typically 0 or 1 for two-player games.
        """
        ...

    @abstractmethod
    def get_legal_actions(self) -> List[Move]:
        """Return list of legal moves in the current state."""
        ...

    @abstractmethod
    def is_game_over(self) -> bool:
        """Return True if the game has ended."""
        ...

    @abstractmethod
    def game_result(self) -> float:
        """
        Return game result from the perspective of the current player.
        Typically 1.0 (win), 0.0 (draw), or -1.0 (loss).
        """
        ...

    @abstractmethod
    def move(self, action: Move) -> "TurnBasedGame":
        """
        Apply an action and return a NEW game state.
        """
        ...

    def get_heuristic(self) -> Optional[float]:
        """
        Optional: Return a heuristic evaluation of the current game state.

        The heuristic should be from the perspective of the current player,
        where positive values are favorable and negative values are unfavorable.

        Returns:
            float: Heuristic value, or None if not implemented

        Example:
            def get_heuristic(self) -> Optional[float]:
                return self.count_pieces(0) - self.count_pieces(1)
        """
        return None`}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
