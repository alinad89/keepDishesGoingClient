import { CreateGameForm } from '../components/game/CreateGameForm';

export function CreateGamePage() {
  return (
    <div className="create-game-page">
      <div className="page-header">
        <h1 className="page-title">Register a New Game</h1>
        <p className="page-subtitle">
          Fill out the form below to register your game with the Hexagon platform
        </p>
      </div>

      <CreateGameForm />
    </div>
  );
}
