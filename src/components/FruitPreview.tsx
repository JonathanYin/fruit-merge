import type { FruitTier } from '../game/constants'

type Props = {
  label: string
  fruit: FruitTier
}

export function FruitPreview({ label, fruit }: Props) {
  return (
    <div className="fruit-preview">
      <span className="fruit-preview-label">{label}</span>
      <div
        className="fruit-preview-circle"
        style={{ backgroundColor: fruit.color }}
        aria-hidden="true"
      />
      <span className="fruit-preview-name">{fruit.name}</span>
    </div>
  )
}
