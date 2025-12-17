import type { MutableRefObject, PointerEventHandler } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH, type FruitTier } from '../game/constants'

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
  playfieldRef: MutableRefObject<HTMLDivElement | null>
  dropPercent: number
  currentFruit: FruitTier
  gameOver: boolean
  onPointerMove: PointerEventHandler<HTMLDivElement>
  onPointerDown: PointerEventHandler<HTMLDivElement>
  onPointerUp: PointerEventHandler<HTMLDivElement>
}

export function Playfield({
  canvasRef,
  playfieldRef,
  dropPercent,
  currentFruit,
  gameOver,
  onPointerMove,
  onPointerDown,
  onPointerUp,
}: Props) {
  return (
    <div
      className="playfield"
      ref={playfieldRef}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      <div className="drop-preview" style={{ left: `${dropPercent}%` }}>
        <div
          className="drop-preview-fruit"
          style={{ backgroundColor: currentFruit.color }}
        />
        <span className="drop-preview-label">{currentFruit.name}</span>
      </div>
      {gameOver && (
        <div className="game-over-banner">
          <p>Basket overflow!</p>
          <p>Tap restart to try again.</p>
        </div>
      )}
    </div>
  )
}
