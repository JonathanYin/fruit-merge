import './App.css'
import { FruitHierarchy } from './components/FruitHierarchy'
import { FruitPreview } from './components/FruitPreview'
import { Playfield } from './components/Playfield'
import { FRUITS } from './game/constants'
import { useFruitGame } from './hooks/useFruitGame'

function App() {
  const {
    canvasRef,
    playfieldRef,
    score,
    gameOver,
    currentFruit,
    nextFruit,
    dropPercent,
    resetGame,
    pointerHandlers,
  } = useFruitGame()

  return (
    <div className="app-shell">
      <header className="hud">
        <div className="score-card">
          <span className="label">Score</span>
          <span className="score">{score}</span>
        </div>
        <div className="hud-previews">
          <FruitPreview label="Current" fruit={currentFruit} />
          <FruitPreview label="Next" fruit={nextFruit} />
        </div>
        <button type="button" className="restart-button hud-restart" onClick={resetGame}>
          Restart
        </button>
      </header>

      <Playfield
        canvasRef={canvasRef}
        playfieldRef={playfieldRef}
        dropPercent={dropPercent}
        currentFruit={currentFruit}
        gameOver={gameOver}
        {...pointerHandlers}
      />

      <div className="controls">
        <p className="instructions">
          Move your cursor (or finger) to aim, then click to drop the fruit. Merge identical
          fruits to climb the ladder all the way to the watermelon. Keep the pile below the
          dashed line! Use the restart button above for a quick reset.
        </p>
        <FruitHierarchy fruits={FRUITS} />
      </div>
    </div>
  )
}

export default App
