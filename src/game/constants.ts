export const CANVAS_WIDTH = 480
export const CANVAS_HEIGHT = 640
export const FAIL_LINE = 80
export const SPAWN_GUTTER = 18
export const SPAWNABLE_MAX_INDEX = 4 // oranges are the largest random spawn

export type FruitTier = {
  name: string
  color: string
  radius: number
}

export const FRUITS: FruitTier[] = [
  { name: 'Apple', color: '#ff6b6b', radius: 14 },
  { name: 'Blue Berry', color: '#6574ff', radius: 18 },
  { name: 'Lemon', color: '#ffe066', radius: 21 },
  { name: 'Grape', color: '#a259ff', radius: 26 },
  { name: 'Orange', color: '#ffa142', radius: 30 },
  { name: 'Green Apple', color: '#7ed957', radius: 34 },
  { name: 'Peach', color: '#ff8fb6', radius: 38 },
  { name: 'Coconut', color: '#8c593b', radius: 44 },
  { name: 'Dragonfruit', color: '#ff3f72', radius: 48 },
  { name: 'Pineapple', color: '#f9c74f', radius: 55 },
  { name: 'Watermelon', color: '#41b883', radius: 62 },
]

export const randomSpawnTier = () =>
  Math.floor(Math.random() * (SPAWNABLE_MAX_INDEX + 1))

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
