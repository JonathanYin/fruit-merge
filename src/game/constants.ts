export const CANVAS_WIDTH = 480
export const CANVAS_HEIGHT = 640
export const FAIL_LINE = 80
export const SPAWN_GUTTER = 18
export const SPAWNABLE_MAX_INDEX = 4 // oranges are the largest random spawn

export type FruitTier = {
  name: string
  color: string
  radius: number
  accent?: string
  secondary?: string
}

export const FRUITS: FruitTier[] = [
  { name: 'Apple', color: '#ff6f6f', accent: '#ffd4d4', radius: 18, secondary: '#37a44d' },
  { name: 'Blue Berry', color: '#5e64ff', accent: '#c5ccff', radius: 20, secondary: '#3a3ea4' },
  { name: 'Lemon', color: '#ffe066', accent: '#fff6b3', radius: 26 },
  { name: 'Grape', color: '#a55bff', accent: '#e2c7ff', radius: 30, secondary: '#3bb25f' },
  { name: 'Orange', color: '#ffa142', accent: '#ffddb2', radius: 35, secondary: '#4bb543' },
  { name: 'Green Apple', color: '#76d95b', accent: '#d2ffbf', radius: 40, secondary: '#3a9a36' },
  { name: 'Peach', color: '#ff94be', accent: '#ffe1ec', radius: 46 },
  { name: 'Coconut', color: '#7a4b2c', accent: '#ad7d5c', radius: 52 },
  { name: 'Dragonfruit', color: '#ff3f72', accent: '#ffd7e6', radius: 60, secondary: '#6ce0a2' },
  { name: 'Pineapple', color: '#f6bb42', accent: '#ffe59c', radius: 74, secondary: '#59b349' },
  { name: 'Watermelon', color: '#3cb672', accent: '#a7f0c7', radius: 90, secondary: '#1d8646' },
]

export const FRUIT_POINTS = FRUITS.map((_, index) => (index + 1) * 5)

export const randomSpawnTier = () =>
  Math.floor(Math.random() * (SPAWNABLE_MAX_INDEX + 1))

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
