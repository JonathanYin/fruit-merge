import type { FruitTier } from '../game/constants'

type Props = {
  fruits: FruitTier[]
}

export function FruitHierarchy({ fruits }: Props) {
  if (fruits.length === 0) {
    return null
  }

  const firstFruit = fruits[0]
  const lastFruit = fruits[fruits.length - 1]

  return (
    <div className="fruit-hierarchy">
      <p className="fruit-hierarchy-label">Fruit Ladder</p>
      <p className="fruit-hierarchy-description">
        Merge each pair to move up the ladder. Start with the humble {firstFruit.name} and keep
        going until you unlock the {lastFruit.name}.
      </p>
      <div className="fruit-hierarchy-track" role="list" aria-label="Fruit hierarchy">
        {fruits.map((fruit, index) => (
          <div className="fruit-hierarchy-entry" key={fruit.name} role="listitem">
            <div className="fruit-symbol" style={{ backgroundColor: fruit.color }} aria-hidden="true" />
            <span className="fruit-symbol-name">{fruit.name}</span>
            {index < fruits.length - 1 && (
              <span className="fruit-hierarchy-arrow" aria-hidden="true">
                &gt;
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
