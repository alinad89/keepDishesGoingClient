import { Link } from 'react-router-dom';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StarIcon from '@mui/icons-material/Star';
import './DeveloperDocsPage.css';

export default function AIIntegrationPage() {
  return (
    <div className="dev-docs-page">
      <div className="dev-docs-container">
        {/* Hero */}
        <section className="dev-docs-hero">
          <PsychologyIcon sx={{ fontSize: 60, color: 'var(--accent)', mb: 2 }} />
          <h1 className="dev-docs-title">AI Integration Guide</h1>
          <p className="dev-docs-subtitle">
            Configure MCTS strategies for optimal AI performance
          </p>
        </section>

        {/* Overview */}
        <section className="dev-docs-section">
          <h2 className="section-heading">MCTS Strategies Overview</h2>
          <p className="section-text">
            The MCTS engine supports pluggable strategies for each phase:
          </p>
          <div className="info-box">
            <ul>
              <li><strong>Selection:</strong> <code>"ucb"</code> or <code>"rave"</code></li>
              <li><strong>Expansion:</strong> <code>"default"</code> or <code>"progressive_widening"</code></li>
              <li><strong>Simulation:</strong> <code>"random"</code> or <code>"heuristic"</code></li>
              <li><strong>Backpropagation:</strong> <code>"default"</code>, <code>"rave"</code>, or <code>"solver"</code></li>
            </ul>
          </div>
        </section>

        {/* Quick Start */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Quick Start</h2>
          <p className="section-text">
            Simple configuration with AIGameClient:
          </p>
          <pre className="code-block">
{`from game_sdk import AIGameClient

return AIGameClient(
    game_id="tictactoe",
    api_key="your-api-key",
    apply_move_fn=apply_move_fn,
    selection_strategy="rave",
    expansion_strategy="progressive_widening",
    simulation_strategy="random",
    backpropagation_strategy="solver",
)`}
          </pre>
        </section>

        {/* Selection Strategies */}
        <section className="dev-docs-section">
          <h2 className="section-heading">1. Selection Strategies</h2>

          <h3 className="subsection-heading">UCB (Upper Confidence Bound)</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>Standard UCB1 balances exploitation (high reward) and exploration (low visits).</p>
            <h4>Parameters</h4>
            <ul>
              <li><code>exploration_c</code> - Controls exploration aggressiveness</li>
              <li><code>fpu_reduction</code> - First Play Urgency adjustment</li>
            </ul>
          </div>

          <h3 className="subsection-heading">RAVE (Rapid Action Value Estimation)</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>UCB + RAVE combines normal stats with move-level stats (AMAF) for faster learning from rollouts.</p>
            <h4>Benefits</h4>
            <ul>
              <li>Learns faster from random rollouts</li>
              <li>Respects solved nodes</li>
              <li>Better for games with many similar positions</li>
            </ul>
          </div>
        </section>

        {/* Expansion Strategies */}
        <section className="dev-docs-section">
          <h2 className="section-heading">2. Expansion Strategies</h2>

          <h3 className="subsection-heading">Default Expansion</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>Always expands one unexpanded move when selected.</p>
            <h4>Best For</h4>
            <p>Small branching factors, simple games</p>
          </div>

          <h3 className="subsection-heading">Progressive Widening</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>Expands more children as node is visited more often.</p>
            <h4>Parameters</h4>
            <ul>
              <li><code>base</code> - Base number of expansions</li>
              <li><code>widening_constant</code> - Growth rate</li>
              <li><code>alpha</code> - Widening exponent</li>
            </ul>
            <h4>Best For</h4>
            <p>Games with many legal moves (e.g., Go, Chess)</p>
          </div>

          <pre className="code-block">
{`expansion_strategy = get_expansion_strategy(
    "progressive_widening",
    base=1,
    widening_constant=1.0,
    alpha=0.5
)`}
          </pre>
        </section>

        {/* Simulation Strategies */}
        <section className="dev-docs-section">
          <h2 className="section-heading">3. Simulation Strategies</h2>

          <h3 className="subsection-heading">Random Simulation</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>Plays uniformly random legal moves until game ends.</p>
            <h4>Benefits</h4>
            <ul>
              <li>Game-agnostic</li>
              <li>Simple and fast</li>
              <li>Works well with RAVE</li>
            </ul>
          </div>

          <h3 className="subsection-heading">Heuristic Simulation</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>Uses custom move evaluator for smarter rollouts.</p>
          </div>

          <pre className="code-block">
{`def move_evaluator(state, moves, env):
    # Custom game-specific logic
    # Return the best move based on heuristics
    return best_move

simulation = get_simulation_strategy(
    "heuristic",
    move_evaluator=move_evaluator
)`}
          </pre>
        </section>

        {/* Backpropagation Strategies */}
        <section className="dev-docs-section">
          <h2 className="section-heading">4. Backpropagation Strategies</h2>

          <h3 className="subsection-heading">Default Backpropagation</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>Standard MCTS backprop: updates visits and value sums.</p>
          </div>

          <h3 className="subsection-heading">RAVE Backpropagation</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>Updates both normal stats AND RAVE stats for all moves seen in simulation.</p>
            <h4>Required For</h4>
            <p>Must use with RAVE selection strategy</p>
          </div>

          <h3 className="subsection-heading">Solver Backpropagation</h3>
          <div className="deployment-card">
            <h4>Use Case</h4>
            <p>MCTS Solver: marks nodes as proven win/loss/draw based on children.</p>
            <h4>Benefits</h4>
            <ul>
              <li>Prunes losing branches</li>
              <li>Locks in winning lines</li>
              <li>Perfect play when fully solved</li>
            </ul>
          </div>
        </section>

        {/* Recommended Setup */}
        <section className="dev-docs-section">
          <h2 className="section-heading">Recommended Configuration</h2>
          <div className="warning-box">
            <strong><StarIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> Recommended for Tic-Tac-Toe:</strong>
            This configuration provides excellent performance for most turn-based games.
          </div>

          <pre className="code-block">
{`return AIGameClient(
    game_id="tictactoe",
    api_key="your-api-key",
    apply_move_fn=apply_move_fn,
    selection_strategy="rave",              # RAVE with FPU
    expansion_strategy="progressive_widening", # Progressive Widening
    simulation_strategy="random",            # Random simulation
    backpropagation_strategy="solver",       # Solver
)`}
          </pre>

          <p className="section-text">
            This combination provides:
          </p>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Fast Learning</h4>
              <p>RAVE selection learns quickly from rollouts</p>
            </div>
            <div className="tip-card">
              <h4>Smart Expansion</h4>
              <p>Progressive widening handles large action spaces</p>
            </div>
            <div className="tip-card">
              <h4>Game-Agnostic</h4>
              <p>Random simulation works for any game</p>
            </div>
            <div className="tip-card">
              <h4>Perfect Play</h4>
              <p>Solver finds guaranteed wins/draws</p>
            </div>
          </div>
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
