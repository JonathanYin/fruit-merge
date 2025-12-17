import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import {
  Bodies,
  Body,
  Engine,
  Events,
  World,
  type IEventCollision,
  type Vector,
} from 'matter-js'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FAIL_LINE,
  FRUITS,
  SPAWN_GUTTER,
  clamp,
  randomSpawnTier,
} from '../game/constants'

type FruitInstance = {
  body: Body
  tier: number
  hasClearedSpawn: boolean
}

export function useFruitGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const playfieldRef = useRef<HTMLDivElement | null>(null)
  const engineRef = useRef<Engine | null>(null)
  const animationRef = useRef<number | null>(null)
  const fruitsRef = useRef<Map<number, FruitInstance>>(new Map())
  const mergingRef = useRef<Set<number>>(new Set())
  const gameOverRef = useRef(false)
  const lastFrameRef = useRef<number | null>(null)

  const [score, setScore] = useState(0)
  const [currentTier, setCurrentTier] = useState(randomSpawnTier)
  const [nextTier, setNextTier] = useState(randomSpawnTier)
  const [dropX, setDropX] = useState(CANVAS_WIDTH / 2)
  const [gameOver, setGameOver] = useState(false)

  const currentFruit = FRUITS[currentTier]
  const nextFruit = FRUITS[nextTier]
  const dropPercent = useMemo(() => (dropX / CANVAS_WIDTH) * 100, [dropX])

  const spawnFruit = useCallback(
    (
      tier: number,
      position: { x: number; y: number },
      velocity?: Vector,
      options?: { settled?: boolean }
    ) => {
      const engine = engineRef.current
      if (!engine) {
        return null
      }

      const fruit = FRUITS[tier]
      const body = Bodies.circle(position.x, position.y, fruit.radius, {
        label: 'fruit',
        restitution: 0.2,
        friction: 0.4,
        frictionAir: 0.01,
      })

      if (velocity) {
        Body.setVelocity(body, velocity)
      }

      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3)

      World.add(engine.world, body)
      fruitsRef.current.set(body.id, {
        body,
        tier,
        hasClearedSpawn: Boolean(options?.settled),
      })
      return body
    },
    []
  )

  const resetGame = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return

    fruitsRef.current.forEach(({ body }) => {
      World.remove(engine.world, body)
    })
    fruitsRef.current.clear()
    mergingRef.current.clear()
    lastFrameRef.current = null
    setScore(0)
    setCurrentTier(randomSpawnTier())
    setNextTier(randomSpawnTier())
    setDropX(CANVAS_WIDTH / 2)
    setGameOver(false)
    gameOverRef.current = false
  }, [])

  const updateDropFromClient = useCallback(
    (clientX: number) => {
      const bounds = playfieldRef.current?.getBoundingClientRect()
      if (!bounds) return

      const relative = ((clientX - bounds.left) / bounds.width) * CANVAS_WIDTH
      const radius = currentFruit.radius
      const minX = radius + SPAWN_GUTTER
      const maxX = CANVAS_WIDTH - radius - SPAWN_GUTTER
      setDropX(clamp(relative, minX, maxX))
    },
    [currentFruit.radius]
  )

  const handleDrop = useCallback(() => {
    if (gameOver || !engineRef.current) return
    const spawnY = 40 + currentFruit.radius
    const body = spawnFruit(currentTier, { x: dropX, y: spawnY })
    if (!body) return

    setCurrentTier(nextTier)
    setNextTier(randomSpawnTier())
  }, [currentFruit.radius, currentTier, dropX, gameOver, nextTier, spawnFruit])

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch') {
        event.preventDefault()
      }
      updateDropFromClient(event.clientX)
    },
    [updateDropFromClient]
  )

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch') {
        event.preventDefault()
      }
      updateDropFromClient(event.clientX)
    },
    [updateDropFromClient]
  )

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch') {
        event.preventDefault()
      }
      updateDropFromClient(event.clientX)
      handleDrop()
    },
    [handleDrop, updateDropFromClient]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const engine = Engine.create()
    engine.gravity.y = 1
    engineRef.current = engine

    const world = engine.world
    const ground = Bodies.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT + 30,
      CANVAS_WIDTH,
      60,
      { isStatic: true, label: 'ground' }
    )
    const leftWall = Bodies.rectangle(-30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT * 2, {
      isStatic: true,
      label: 'wall',
    })
    const rightWall = Bodies.rectangle(
      CANVAS_WIDTH + 30,
      CANVAS_HEIGHT / 2,
      60,
      CANVAS_HEIGHT * 2,
      {
        isStatic: true,
        label: 'wall',
      }
    )
    World.add(world, [ground, leftWall, rightWall])

    const drawWorld = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, '#ffe9d6')
      gradient.addColorStop(1, '#fffaf1')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.moveTo(0, FAIL_LINE)
      ctx.lineTo(CANVAS_WIDTH, FAIL_LINE)
      ctx.stroke()
      ctx.setLineDash([])

      let shouldLose = false

      fruitsRef.current.forEach((entry) => {
        const { body, tier } = entry
        const fruit = FRUITS[tier]
        ctx.save()
        ctx.translate(body.position.x, body.position.y)
        ctx.rotate(body.angle)
        ctx.fillStyle = fruit.color
        ctx.beginPath()
        ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.lineWidth = 3
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.stroke()
        ctx.restore()

        if (
          !entry.hasClearedSpawn &&
          body.position.y - fruit.radius > FAIL_LINE + fruit.radius * 0.4
        ) {
          entry.hasClearedSpawn = true
        }

        if (entry.hasClearedSpawn && body.position.y - fruit.radius <= FAIL_LINE) {
          shouldLose = true
        }
      })

      if (shouldLose && !gameOverRef.current) {
        gameOverRef.current = true
        setGameOver(true)
      }
    }

    const handleCollision = (event: IEventCollision<Engine>) => {
      if (gameOverRef.current) return
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair
        const fruitA = fruitsRef.current.get(bodyA.id)
        const fruitB = fruitsRef.current.get(bodyB.id)
        if (!fruitA || !fruitB) return
        if (!fruitA.hasClearedSpawn || !fruitB.hasClearedSpawn) return
        if (fruitA.tier !== fruitB.tier) return
        if (fruitA.tier >= FRUITS.length - 1) return
        if (mergingRef.current.has(bodyA.id) || mergingRef.current.has(bodyB.id)) return

        mergingRef.current.add(bodyA.id)
        mergingRef.current.add(bodyB.id)

        const nextTier = fruitA.tier + 1
        const newX = (bodyA.position.x + bodyB.position.x) / 2
        const newY = (bodyA.position.y + bodyB.position.y) / 2
        const mergedVelocity = {
          x: (bodyA.velocity.x + bodyB.velocity.x) / 2,
          y: (bodyA.velocity.y + bodyB.velocity.y) / 2,
        }

        World.remove(world, bodyA)
        World.remove(world, bodyB)
        fruitsRef.current.delete(bodyA.id)
        fruitsRef.current.delete(bodyB.id)
        mergingRef.current.delete(bodyA.id)
        mergingRef.current.delete(bodyB.id)

        spawnFruit(nextTier, { x: newX, y: newY }, mergedVelocity, { settled: true })
        setScore((value) => value + 1)
      })
    }

    Events.on(engine, 'collisionStart', handleCollision)

    const loop = (time: number) => {
      const previous = lastFrameRef.current ?? time
      const delta = Math.min(time - previous, 1000 / 30)
      lastFrameRef.current = time
      Engine.update(engine, delta)
      drawWorld()
      animationRef.current = requestAnimationFrame(loop)
    }

    animationRef.current = requestAnimationFrame(loop)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
      Events.off(engine, 'collisionStart', handleCollision)
      World.clear(world, false)
      Engine.clear(engine)
      fruitsRef.current.clear()
      mergingRef.current.clear()
    }
  }, [spawnFruit])

  return {
    canvasRef,
    playfieldRef,
    score,
    gameOver,
    currentFruit,
    nextFruit,
    dropPercent,
    resetGame,
    pointerHandlers: {
      onPointerMove: handlePointerMove,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    },
  }
}
