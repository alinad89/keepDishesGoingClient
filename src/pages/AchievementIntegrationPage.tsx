import { Link } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import './DeveloperDocsPage.css';

export default function AchievementIntegrationPage() {
  return (
    <div className="dev-docs-page">
      <div className="dev-docs-container">
        {/* Hero */}
        <section className="dev-docs-hero">
          <EmojiEventsIcon sx={{ fontSize: 60, color: 'var(--accent)', mb: 2 }} />
          <h1 className="dev-docs-title">Achievement Integration</h1>
          <p className="dev-docs-subtitle">
            Reward players for milestones and accomplishments
          </p>
        </section>

        {/* Setup */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Setup Requirements</h2>

          <h3 className="subsection-heading">1. Add API Key to Environment</h3>
          <p className="section-text">
            Add your Developer API Key to your <code className="inline-code">.env</code> file:
          </p>
          <pre className="code-block">
            <code>DEVELOPER_API_KEY=your-uuid-here</code>
          </pre>
          <p className="section-text">
            This key is generated when you register your game on the platform.
          </p>

          <h3 className="subsection-heading">2. Import Required Components</h3>
          <pre className="code-block">
            <code>from game_sdk import EventPublisher, EventPublisherConfig</code>
          </pre>
        </section>

        {/* Publishing Methods */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Publishing Achievements</h2>

          <h3 className="subsection-heading">Method 1: EventPublisher (Recommended)</h3>
          <pre className="code-block">
{`# Initialize the publisher (reads DEVELOPER_API_KEY from environment)
publisher = EventPublisher(EventPublisherConfig())

# When a player unlocks an achievement
publisher.publish_achievement_unlocked(
    subject_id="player-123",           # The player's ID
    achievement_name="FIRST_WIN"        # Achievement identifier
)`}
          </pre>

          <h3 className="subsection-heading">Method 2: Manual Event Creation</h3>
          <pre className="code-block">
{`from game_sdk import create_achievement_unlocked_event, EventPublisher

# Create the event manually
event = create_achievement_unlocked_event(
    subject_id="player-123",
    achievement_name="WIN_10_MATCHES",
    developer_api_key="your-uuid-here"  # Or use from config
)

# Publish it
publisher = EventPublisher()
publisher.publish(event)`}
          </pre>

          <h3 className="subsection-heading">Method 3: Using Context Manager</h3>
          <pre className="code-block">
{`# Automatically handles connection cleanup
with EventPublisher(EventPublisherConfig()) as publisher:
    publisher.publish_achievement_unlocked(
        subject_id="player-456",
        achievement_name="PERFECT_GAME"
    )`}
          </pre>
        </section>

        {/* Example */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Example: Tracking Win Streaks</h2>
          <pre className="code-block">
{`class YourGame:
    def __init__(self):
        self.publisher = EventPublisher(EventPublisherConfig())
        self.win_counts = {}  # Track wins per player

    def on_game_end(self, winner_id):
        # Increment win counter
        self.win_counts[winner_id] = self.win_counts.get(winner_id, 0) + 1

        # Check for achievement milestones
        wins = self.win_counts[winner_id]

        if wins == 1:
            self.publisher.publish_achievement_unlocked(
                subject_id=winner_id,
                achievement_name="FIRST_WIN"
            )
        elif wins == 10:
            self.publisher.publish_achievement_unlocked(
                subject_id=winner_id,
                achievement_name="WIN_10_MATCHES"
            )
        elif wins == 100:
            self.publisher.publish_achievement_unlocked(
                subject_id=winner_id,
                achievement_name="CENTURION"
            )`}
          </pre>
        </section>

        {/* Important Notes */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Important Notes</h2>

          <div className="warning-box">
            <strong><WarningIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> CRITICAL:</strong> Achievement names in your code MUST exactly match
            the names configured on the platform. Any mismatch will prevent awarding.
          </div>

          <div className="tips-grid">
            <div className="tip-card">
              <h4><EditIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Unique Names</h4>
              <p>All achievements must have unique names across your game.</p>
            </div>
            <div className="tip-card">
              <h4><TextFieldsIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Naming Convention</h4>
              <p>Use ALL_CAPS with underscores: <code>FIRST_WIN</code>, <code>PERFECT_GAME</code></p>
            </div>
            <div className="tip-card">
              <h4><VpnKeyIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> API Key Required</h4>
              <p>The API key is a UUID that uniquely identifies your game.</p>
            </div>
            <div className="tip-card">
              <h4><FlashOnIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Offline Mode</h4>
              <p>If RabbitMQ is unavailable, events print to stdout for local dev.</p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Best Practices</h2>

          <h3 className="subsection-heading">1. Define Achievement Constants</h3>
          <p className="section-text">
            Avoid typos by defining achievement names as constants:
          </p>
          <pre className="code-block">
{`class Achievements:
    FIRST_WIN = "FIRST_WIN"
    WIN_10_MATCHES = "WIN_10_MATCHES"
    PERFECT_GAME = "PERFECT_GAME"
    FLAWLESS_VICTORY = "FLAWLESS_VICTORY"

# Use in your code
publisher.publish_achievement_unlocked(
    subject_id=player_id,
    achievement_name=Achievements.FIRST_WIN
)`}
          </pre>

          <h3 className="subsection-heading">2. Track Achievement State</h3>
          <p className="section-text">
            Prevent duplicate events by tracking which achievements have been unlocked:
          </p>
          <pre className="code-block">
{`class AchievementTracker:
    def __init__(self):
        self.unlocked = {}  # player_id -> set of achievement names

    def unlock(self, player_id, achievement_name):
        if player_id not in self.unlocked:
            self.unlocked[player_id] = set()

        if achievement_name not in self.unlocked[player_id]:
            self.unlocked[player_id].add(achievement_name)
            publisher.publish_achievement_unlocked(
                subject_id=player_id,
                achievement_name=achievement_name
            )
            return True
        return False  # Already unlocked`}
          </pre>

          <h3 className="subsection-heading">3. Publish Immediately</h3>
          <div className="info-box">
            <strong>Timing:</strong>
            Publish achievements immediately when conditions are met. Don't batch or delay -
            players expect instant feedback!
          </div>

          <h3 className="subsection-heading">4. Descriptive Names</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4><CheckCircleIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Good</h4>
              <p><code>FIRST_WIN</code></p>
              <p><code>WIN_STREAK_5</code></p>
              <p><code>PERFECT_GAME</code></p>
            </div>
            <div className="tip-card">
              <h4><CancelIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Bad</h4>
              <p><code>ACH1</code></p>
              <p><code>ACHIEVEMENT_A</code></p>
              <p><code>test_ach</code></p>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Error Handling</h2>

          <div className="deployment-card">
            <h4>Missing API Key</h4>
            <p>
              If no API key is configured, publishing will raise a <code>ValueError</code> with instructions.
            </p>
          </div>

          <div className="deployment-card">
            <h4>Connection Issues</h4>
            <p>
              If RabbitMQ is unavailable, events will be printed to stdout instead of published.
              Useful for local development without message broker.
            </p>
          </div>

          <pre className="code-block">
{`try:
    publisher.publish_achievement_unlocked(
        subject_id=player_id,
        achievement_name="FIRST_WIN"
    )
except ValueError as e:
    print(f"Configuration error: {e}")
except Exception as e:
    print(f"Failed to publish achievement: {e}")`}
          </pre>
        </section>

        {/* Back Link */}
        <section className="dev-docs-section">
          <Link to="/developer/docs" className="link-button">
            ← Back to Documentation
          </Link>
        </section>
      </div>
    </div>
  );
}
