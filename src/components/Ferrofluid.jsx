import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './Ferrofluid.css'

const MAX_COLORS = 8

const hexToRgb = (hex) => {
  const color = hex.replace('#', '').padEnd(6, '0')
  return [
    Number.parseInt(color.slice(0, 2), 16) / 255,
    Number.parseInt(color.slice(2, 4), 16) / 255,
    Number.parseInt(color.slice(4, 6), 16) / 255,
  ]
}

const prepareColors = (input) => {
  const source = (input?.length ? input : ['#b8f36b']).slice(0, MAX_COLORS)
  const values = Array.from({ length: MAX_COLORS }, (_, index) => (
    hexToRgb(source[Math.min(index, source.length - 1)])
  ))
  return { values, count: source.length }
}

const getFlow = (direction) => {
  if (direction === 'up') return [0, 1]
  if (direction === 'left') return [-1, 0]
  if (direction === 'right') return [1, 0]
  return [0, -1]
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform vec3 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform vec3 uColor6;
uniform vec3 uColor7;
uniform int uColorCount;
uniform vec2 uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;
#define PI 3.14159265

vec3 palette(float height) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int index = int(floor(clamp(height, 0.0, 0.999999) * float(count)));
  if (index <= 0) return uColor0;
  if (index == 1) return uColor1;
  if (index == 2) return uColor2;
  if (index == 3) return uColor3;
  if (index == 4) return uColor4;
  if (index == 5) return uColor5;
  if (index == 6) return uColor6;
  return uColor7;
}

float hash(vec3 point) {
  point = fract(point * 0.1031);
  point += dot(point, point.zyx + 33.33);
  return fract((point.x + point.y) * point.z);
}

float smoothMin(float a, float b, float amount) {
  float result = exp2(-a / amount) + exp2(-b / amount);
  return -amount * log2(result);
}

float sineLerp(float a, float b, float weight) {
  return mix(a, b, (sin(weight * PI - PI / 2.0) + 1.0) / 2.0);
}

float valueNoise(vec2 point, float size, float seed) {
  vec2 cell = floor(point / size);
  vec2 relative = mod(point, size);
  float a = hash(vec3(cell, seed));
  float b = hash(vec3(cell.x + 1.0, cell.y, seed));
  float c = hash(vec3(cell.x + 1.0, cell.y + 1.0, seed));
  float d = hash(vec3(cell.x, cell.y + 1.0, seed));
  return sineLerp(sineLerp(a, b, relative.x / size), sineLerp(d, c, relative.x / size), relative.y / size);
}

float layeredNoise(vec2 point, float size, float seed) {
  float offset = size / 2.0;
  float n0 = valueNoise(point, size, seed);
  float n1 = valueNoise(point + vec2(offset), size, seed + 0.1);
  float n2 = valueNoise(point + vec2(-offset, offset), size, seed + 0.2);
  float n3 = valueNoise(point + vec2(offset, -offset), size, seed + 0.3);
  float n4 = valueNoise(point - vec2(offset), size, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void main() {
  vec2 fragment = vUv * iResolution.xy;
  float reference = 700.0 / max(uScale, 0.05);
  vec2 point = fragment / iResolution.y * reference;
  float velocity = 200.0 * uSpeed;
  vec2 direction = uFlow;
  vec2 perpendicular = vec2(-direction.y, direction.x);

  float distortionA = valueNoise(point + perpendicular * (iTime * velocity), 60.0, 10.0) * 50.0 * uTurbulence;
  float distortionB = valueNoise(point - perpendicular * (iTime * velocity), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaksA = layeredNoise(point + distortionA + direction * (iTime * velocity * 0.5), 40.0, 1.0);
  float peaksB = layeredNoise(point + distortionB - direction * (iTime * velocity * 0.5), 40.0, 0.0);
  float surface = smoothMin(peaksA, peaksB, max(uFluidity, 0.001));

  vec2 uv = fragment / iResolution.xy;
  vec2 centered = uv - 0.5;
  centered.x *= iResolution.x / iResolution.y;
  vec2 mousePosition = (iMouse - iResolution.xy * 0.5) / iResolution.y;
  float mouseInfluence = uMouseEnabled > 0.5 ? clamp(uMouseStrength * 0.055, 0.0, 0.08) : 0.0;
  vec2 fieldCenter = mix(vec2(0.0), mousePosition, mouseInfluence);
  vec2 fieldPoint = centered - fieldCenter;
  float fieldRadiusSquared = dot(fieldPoint, fieldPoint) + max(uMouseRadius * 0.16, 0.045);

  float dipoleFlux = fieldPoint.y / fieldRadiusSquared;
  float broadWarp = (surface - 0.43) * (3.1 + uTurbulence * 0.45);
  float slowDrift = iTime * uSpeed * 0.32;
  float filamentPhase = broadWarp + dipoleFlux * 0.34 + slowDrift;
  float filamentDistance = abs(sin(filamentPhase * PI));
  float thicknessNoise = valueNoise(point + direction * iTime * velocity * 0.08, 190.0, 31.0);
  float filamentWidth = clamp(uRimWidth * mix(0.16, 0.34, thicknessNoise), 0.018, 0.065);
  float filament = 1.0 - smoothstep(filamentWidth, filamentWidth * 2.15, filamentDistance);
  float softEdge = 1.0 - smoothstep(filamentWidth * 2.0, filamentWidth * 5.0, filamentDistance);

  float distanceToEdge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  float edgePresence = 1.0 - smoothstep(0.035, 0.34, distanceToEdge);
  float centerDistance = length((uv - 0.5) * vec2(1.0, 1.25));
  float quietCenter = smoothstep(0.2, 0.56, centerDistance);
  float visibility = edgePresence * mix(0.12, 1.0, quietCenter);

  float concentration = pow(valueNoise(point - direction * iTime * velocity * 0.04, 230.0, 43.0), 7.0);
  float light = (filament + softEdge * 0.12 + filament * concentration * 0.32) * visibility;
  light = pow(clamp(light, 0.0, 1.0), max(uSharpness, 1.0)) * uGlow;
  float height = clamp(0.46 + uv.y * 0.2 + thicknessNoise * 0.22, 0.0, 1.0);
  vec3 color = palette(height) * light;
  float alpha = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
  gl_FragColor = vec4(color, alpha * uOpacity);
}
`

function Ferrofluid({
  className = '',
  colors = ['#b8f36b'],
  speed = 0.5,
  scale = 1.6,
  turbulence = 1,
  fluidity = 0.1,
  rimWidth = 0.2,
  sharpness = 2.5,
  shimmer = 1.5,
  glow = 2,
  flowDirection = 'down',
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 1,
  mouseRadius = 0.35,
  mouseDampening = 0.15,
  paused = false,
  dpr,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const renderer = new Renderer({
      dpr: dpr ?? Math.min(window.devicePixelRatio || 1, coarsePointer ? 1 : 1.25),
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    })
    const { gl } = renderer
    const canvas = gl.canvas
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(canvas)

    const { values, count } = prepareColors(colors)
    const uniforms = {
      iResolution: { value: [1, 1, 1] },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uColor0: { value: values[0] },
      uColor1: { value: values[1] },
      uColor2: { value: values[2] },
      uColor3: { value: values[3] },
      uColor4: { value: values[4] },
      uColor5: { value: values[5] },
      uColor6: { value: values[6] },
      uColor7: { value: values[7] },
      uColorCount: { value: count },
      uFlow: { value: getFlow(flowDirection) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uTurbulence: { value: turbulence },
      uFluidity: { value: fluidity },
      uRimWidth: { value: rimWidth },
      uSharpness: { value: sharpness },
      uShimmer: { value: shimmer },
      uGlow: { value: glow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius },
    }
    const program = new Program(gl, { vertex: vertexShader, fragment: fragmentShader, uniforms })
    const geometry = new Triangle(gl)
    const mesh = new Mesh(gl, { geometry, program })
    let frameId = null
    let lastTime = 0
    let isIntersecting = false
    let isDocumentVisible = !document.hidden
    let containerRect = container.getBoundingClientRect()
    const mouseTarget = [0, 0]

    const resize = () => {
      containerRect = container.getBoundingClientRect()
      renderer.setSize(Math.max(containerRect.width, 1), Math.max(containerRect.height, 1))
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1]
      if (mouseTarget[0] === 0 && mouseTarget[1] === 0) {
        mouseTarget[0] = gl.drawingBufferWidth * 0.65
        mouseTarget[1] = gl.drawingBufferHeight * 0.5
        uniforms.iMouse.value = [...mouseTarget]
      }
      renderer.render({ scene: mesh })
    }

    const handlePointerMove = (event) => {
      if (event.clientX < containerRect.left || event.clientX > containerRect.right || event.clientY < containerRect.top || event.clientY > containerRect.bottom) return
      const ratio = renderer.dpr || 1
      mouseTarget[0] = (event.clientX - containerRect.left) * ratio
      mouseTarget[1] = (containerRect.height - (event.clientY - containerRect.top)) * ratio
    }

    const canAnimate = () => isIntersecting && isDocumentVisible && !paused && !reducedMotion

    const render = (time) => {
      frameId = null
      if (!canAnimate()) return

      uniforms.iTime.value = time * 0.001
      const delta = lastTime ? (time - lastTime) / 1000 : 0
      lastTime = time
      const factor = mouseDampening <= 0 ? 1 : Math.min(1, 1 - Math.exp(-delta / Math.max(mouseDampening, 0.0001)))
      uniforms.iMouse.value[0] += (mouseTarget[0] - uniforms.iMouse.value[0]) * factor
      uniforms.iMouse.value[1] += (mouseTarget[1] - uniforms.iMouse.value[1]) * factor

      renderer.render({ scene: mesh })
      frameId = window.requestAnimationFrame(render)
    }

    const syncAnimation = () => {
      if (canAnimate()) {
        if (frameId === null) {
          lastTime = 0
          frameId = window.requestAnimationFrame(render)
        }
        return
      }

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    const handleDocumentVisibility = () => {
      isDocumentVisible = !document.hidden
      syncAnimation()
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting
      syncAnimation()
    }, { threshold: 0.01 })

    resize()
    resizeObserver.observe(container)
    visibilityObserver.observe(container)
    document.addEventListener('visibilitychange', handleDocumentVisibility)
    if (mouseInteraction && !coarsePointer) window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', handleDocumentVisibility)
      window.removeEventListener('pointermove', handlePointerMove)
      canvas.remove()
      geometry.remove?.()
      program.remove?.()
      renderer.destroy?.()
    }
  }, [colors, dpr, flowDirection, fluidity, glow, mouseDampening, mouseInteraction, mouseRadius, mouseStrength, opacity, paused, rimWidth, scale, sharpness, shimmer, speed, turbulence])

  return <div ref={containerRef} className={`ferrofluid-container ${className}`.trim()} aria-hidden="true" />
}

export default Ferrofluid
