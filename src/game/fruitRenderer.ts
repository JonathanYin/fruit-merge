import type { Body } from 'matter-js'
import type { FruitTier } from './constants'

type FruitRenderer = (ctx: CanvasRenderingContext2D, fruit: FruitTier) => void

const PI2 = Math.PI * 2

const defaultRenderer: FruitRenderer = (ctx, fruit) => {
  const { radius } = fruit
  const gradient = ctx.createRadialGradient(-radius * 0.4, -radius * 0.4, radius * 0.2, 0, 0, radius)
  gradient.addColorStop(0, fruit.accent ?? '#fff5f5')
  gradient.addColorStop(1, fruit.color)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, PI2)
  ctx.fill()

  ctx.lineWidth = Math.max(2, radius * 0.08)
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.stroke()

  drawHighlight(ctx, radius)
}

const leafFruit: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  drawLeaf(ctx, fruit.secondary ?? '#4caf50', fruit.radius)
}

const blueberryRenderer: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  drawCrown(ctx, fruit.secondary ?? '#363a8b', fruit.radius)
}

const lemonRenderer: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  drawStem(ctx, '#dcb845', fruit.radius)
}

const orangeRenderer: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  drawLeaf(ctx, fruit.secondary ?? '#3eb84b', fruit.radius, { angle: -0.6 })
  drawSpeckles(ctx, fruit.radius, '#ffc784')
}

const peachRenderer: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = fruit.radius * 0.12
  ctx.beginPath()
  ctx.moveTo(-fruit.radius * 0.2, -fruit.radius)
  ctx.quadraticCurveTo(-fruit.radius * 0.5, 0, 0, fruit.radius)
  ctx.stroke()
}

const coconutRenderer: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  const holeRadius = fruit.radius * 0.12
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath()
    ctx.arc(i * holeRadius * 1.9, -fruit.radius * 0.2, holeRadius, 0, PI2)
    ctx.fill()
  }
}

const dragonRenderer: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  drawDragonLeaves(ctx, fruit.radius, fruit.secondary ?? '#6ce0a2')
}

const pineappleRenderer: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  drawPineappleLeaves(ctx, fruit.secondary ?? '#4ca743', fruit.radius)
  drawPineappleGrid(ctx, fruit.radius)
}

const watermelonRenderer: FruitRenderer = (ctx, fruit) => {
  defaultRenderer(ctx, fruit)
  drawWatermelonStripes(ctx, fruit.radius, fruit.secondary ?? '#1c8a46')
}

const rendererByName: Record<string, FruitRenderer> = {
  Apple: leafFruit,
  'Green Apple': leafFruit,
  'Blue Berry': blueberryRenderer,
  Lemon: lemonRenderer,
  Grape: leafFruit,
  Orange: orangeRenderer,
  Peach: peachRenderer,
  Coconut: coconutRenderer,
  Dragonfruit: dragonRenderer,
  Pineapple: pineappleRenderer,
  Watermelon: watermelonRenderer,
}

export function renderFruit(ctx: CanvasRenderingContext2D, fruit: FruitTier, body: Body) {
  ctx.save()
  ctx.translate(body.position.x, body.position.y)
  ctx.rotate(body.angle)
  const renderer = rendererByName[fruit.name] ?? defaultRenderer
  renderer(ctx, fruit)
  ctx.restore()
}

function drawHighlight(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.beginPath()
  ctx.ellipse(-radius * 0.35, -radius * 0.45, radius * 0.35, radius * 0.18, -0.6, 0, PI2)
  ctx.fill()
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  color: string,
  radius: number,
  options: { angle?: number; offsetX?: number; offsetY?: number } = {}
) {
  const angle = options.angle ?? -0.4
  const offsetX = options.offsetX ?? radius * 0.1
  const offsetY = options.offsetY ?? -radius * 0.8

  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.rotate(angle)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(radius * 0.4, -radius * 0.3, radius * 0.7, 0)
  ctx.quadraticCurveTo(radius * 0.4, radius * 0.3, 0, 0)
  ctx.fill()
  ctx.restore()
}

function drawCrown(ctx: CanvasRenderingContext2D, color: string, radius: number) {
  ctx.fillStyle = color
  const width = radius * 0.4
  const height = radius * 0.25
  ctx.beginPath()
  ctx.moveTo(-width, -radius + height)
  ctx.lineTo(-width * 0.5, -radius - height * 0.3)
  ctx.lineTo(0, -radius + height)
  ctx.lineTo(width * 0.5, -radius - height * 0.3)
  ctx.lineTo(width, -radius + height)
  ctx.closePath()
  ctx.fill()
}

function drawStem(ctx: CanvasRenderingContext2D, color: string, length: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(2, length * 0.08)
  ctx.beginPath()
  ctx.moveTo(0, -length * 0.6)
  ctx.lineTo(0, -length)
  ctx.stroke()
}

function drawSpeckles(ctx: CanvasRenderingContext2D, radius: number, color: string) {
  ctx.fillStyle = color
  for (let i = 0; i < 8; i += 1) {
    const angle = (PI2 / 8) * i + 0.4
    const r = radius * 0.65
    ctx.beginPath()
    ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, radius * 0.06, 0, PI2)
    ctx.fill()
  }
}

function drawDragonLeaves(ctx: CanvasRenderingContext2D, radius: number, color: string) {
  ctx.fillStyle = color
  const count = 7
  const inner = radius * 0.6
  const outer = radius * 1.05
  const step = PI2 / count
  for (let i = 0; i < count; i += 1) {
    const angle = step * i
    const nextAngle = angle + step * 0.7
    ctx.beginPath()
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
    ctx.quadraticCurveTo(
      Math.cos((angle + nextAngle) / 2) * outer,
      Math.sin((angle + nextAngle) / 2) * outer,
      Math.cos(nextAngle) * inner,
      Math.sin(nextAngle) * inner
    )
    ctx.closePath()
    ctx.fill()
  }
}

function drawPineappleLeaves(ctx: CanvasRenderingContext2D, color: string, radius: number) {
  ctx.fillStyle = color
  for (let i = 0; i < 4; i += 1) {
    ctx.save()
    ctx.rotate(-0.2 + i * 0.15)
    ctx.beginPath()
    ctx.moveTo(0, -radius * 1.1)
    ctx.quadraticCurveTo(radius * 0.3, -radius * 1.5, 0, -radius * 1.9)
    ctx.quadraticCurveTo(-radius * 0.3, -radius * 1.5, 0, -radius * 1.1)
    ctx.fill()
    ctx.restore()
  }
}

function drawPineappleGrid(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.strokeStyle = 'rgba(150,90,20,0.35)'
  ctx.lineWidth = radius * 0.08
  const step = radius * 0.6
  ctx.save()
  ctx.beginPath()
  ctx.arc(0, 0, radius - ctx.lineWidth * 0.5, 0, PI2)
  ctx.clip()
  for (let y = -radius * 1.2; y <= radius; y += step) {
    ctx.beginPath()
    ctx.moveTo(-radius * 2, y)
    ctx.lineTo(radius * 2, y + radius * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-radius * 2, y)
    ctx.lineTo(radius * 2, y - radius * 2)
    ctx.stroke()
  }
  ctx.restore()
}

function drawWatermelonStripes(ctx: CanvasRenderingContext2D, radius: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = radius * 0.18
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath()
    ctx.arc(0, 0, radius * (0.4 + i * 0.1), -Math.PI / 2, Math.PI / 2)
    ctx.stroke()
  }
}
