const initialSource = `// Change a value. Watch the idea respond.
const depth = 7
const spread = 22
const lengthRatio = 0.72
const wind = 0
const blossomCount = 18
const leafColor = '#718355'`

const maximumBranches = 20_000

const createDemoDom = () => {
  const header = document.createElement('header')
  header.className = 'DemoHeader'
  header.innerHTML =
    '<strong>Immediate connection</strong><span>Edit the program. The tree answers before you save, run, or leave the thought.</span>'

  const main = document.createElement('main')
  main.className = 'DemoMain'
  main.innerHTML = `<section class="DemoSection SourcePane" aria-label="Tree source">
    <div class="PaneTitle">
      <span>live-tree.js</span>
      <span class="LiveIndicator">LIVE</span>
    </div>
    <textarea class="Source" aria-label="Editable tree program" autocomplete="off" spellcheck="false"></textarea>
    <div class="Error" role="status">Try changing one number.</div>
  </section>
  <section class="DemoSection Stage" aria-label="Live tree preview">
    <output class="TreeStatus" aria-live="polite"></output>
    <canvas class="Tree" width="960" height="640" role="img" aria-label="A recursively drawn tree"></canvas>
    <div class="TryThis">Try depth 7 → 10, spread 22 → 38, or wind 0 → 0.14</div>
  </section>`

  document.body.append(header, main)

  return {
    canvas: document.querySelector('.Tree'),
    error: document.querySelector('.Error'),
    source: document.querySelector('.Source'),
    status: document.querySelector('.TreeStatus'),
  }
}

const numberValue = (text, name, minimum, maximum) => {
  const match = text.match(new RegExp(`^\\s*const\\s+${name}\\s*=\\s*(-?\\d+(?:\\.\\d+)?)\\s*$`, 'm'))
  if (!match) {
    throw new Error(`Finish the ${name} assignment to continue`)
  }
  const value = Number(match[1])
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be between ${minimum} and ${maximum}`)
  }
  return value
}

const colorValue = (text, name) => {
  const match = text.match(new RegExp(`^\\s*const\\s+${name}\\s*=\\s*['"](#(?:[\\da-f]{3}|[\\da-f]{6}))['"]\\s*$`, 'im'))
  if (!match) {
    throw new Error(`${name} needs a quoted hex color`)
  }
  return match[1]
}

const parse = (text) => ({
  blossomCount: Math.floor(numberValue(text, 'blossomCount', 0, 2_048)),
  depth: Math.floor(numberValue(text, 'depth', 1, 12)),
  leafColor: colorValue(text, 'leafColor'),
  lengthRatio: numberValue(text, 'lengthRatio', 0.5, 0.84),
  spread: numberValue(text, 'spread', 0, 70),
  wind: numberValue(text, 'wind', -1, 1),
})

const noise = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43_758.5453
  return value - Math.floor(value)
}

const createDraw = (canvas, status) => {
  const context = canvas.getContext('2d')

  return ({ blossomCount, depth, leafColor, lengthRatio, spread, wind }) => {
    let branches = 0
    let blossoms = 0
    const availableTips = 2 ** (depth - 1)
    const safeBlossomCount = Math.min(blossomCount, availableTips)

    context.fillStyle = '#f3efe5'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#d8d0bb'
    context.beginPath()
    context.ellipse(480, 613, 390, 18, 0, 0, Math.PI * 2)
    context.fill()

    const drawTip = (x, y, seed) => {
      context.fillStyle = leafColor
      for (const [offsetX, offsetY, radius] of [
        [-6, 2, 8],
        [5, 4, 9],
        [0, -5, 10],
      ]) {
        context.beginPath()
        context.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2)
        context.fill()
      }
      if (noise(seed + 91) * availableTips >= safeBlossomCount) {
        return
      }
      context.fillStyle = '#d9868c'
      context.beginPath()
      context.arc(x + 2, y - 3, 4, 0, Math.PI * 2)
      context.fill()
      blossoms++
    }

    const grow = (x, y, length, angle, level, seed) => {
      if (++branches > maximumBranches) {
        throw new Error('This tree has too many branches to draw safely')
      }
      const heading = angle + wind * 12
      const radians = (heading * Math.PI) / 180
      const nextX = x + Math.cos(radians) * length
      const nextY = y + Math.sin(radians) * length
      context.strokeStyle = level > 2 ? '#403a31' : '#5a5145'
      context.lineWidth = Math.max(1.2, level * 1.35)
      context.lineCap = 'round'
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(nextX, nextY)
      context.stroke()
      if (level === 1) {
        return drawTip(nextX, nextY, seed)
      }
      const variation = (noise(seed) - 0.5) * 5
      grow(nextX, nextY, length * lengthRatio, heading - spread + variation, level - 1, seed * 2)
      grow(nextX, nextY, length * lengthRatio, heading + spread + variation, level - 1, seed * 2 + 1)
    }

    grow(480, 608, 112, -90, depth, 1)
    status.dataset.depth = String(depth)
    status.dataset.branchcount = String(branches)
    status.dataset.blossomcount = String(blossoms)
    status.textContent = `${branches.toLocaleString()} branches · ${blossoms} blossoms`
    canvas.setAttribute('aria-label', `A recursive tree with ${branches} branches and ${blossoms} blossoms`)
  }
}

const initialize = async () => {
  if (document.querySelector('.DemoMain')) {
    return {}
  }

  const { canvas, error, source, status } = createDemoDom()
  const draw = createDraw(canvas, status)
  source.value = initialSource

  const render = () => {
    try {
      draw(parse(source.value))
      source.setAttribute('aria-invalid', 'false')
      error.dataset.state = 'valid'
      error.textContent = 'Live — keep shaping it.'
    } catch (cause) {
      source.setAttribute('aria-invalid', 'true')
      error.dataset.state = 'error'
      error.textContent = cause instanceof Error ? cause.message : String(cause)
    }
  }

  source.addEventListener('input', render)
  source.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') {
      return
    }
    event.preventDefault()
    source.setRangeText('  ', source.selectionStart, source.selectionEnd, 'end')
    render()
  })

  render()
  source.focus()
  const depthStart = source.value.indexOf('7')
  source.setSelectionRange(depthStart, depthStart + 1)
  return {}
}

globalThis.lvceRpc({
  initialize,
})
