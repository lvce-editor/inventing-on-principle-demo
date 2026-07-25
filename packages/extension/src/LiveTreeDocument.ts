export const liveTreeDocument = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Inventing on Principle · Live Tree</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        min-height: 100vh;
        margin: 0;
        padding: 32px;
        color: #26352b;
        background: #f2efe7;
        font: 16px system-ui, sans-serif;
      }

      main {
        width: min(100%, 960px);
        margin: 0 auto;
      }

      h1 {
        margin: 0 0 8px;
        font: 500 28px Georgia, serif;
      }

      p {
        margin: 0 0 20px;
        color: #647067;
      }

      canvas {
        display: block;
        width: 100%;
        height: auto;
        border: 1px solid #d7d1c3;
        border-radius: 18px;
        background: #fbfaf5;
        box-shadow: 0 18px 60px rgba(58, 66, 54, 0.12);
      }

      output {
        display: block;
        margin-top: 14px;
        color: #69736b;
        font: 13px ui-monospace, monospace;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>A little world that answers while you type</h1>
      <p>Change the constants near the top of the script. There is no Run button.</p>
      <canvas id="tree" width="960" height="640" role="img" aria-label="A recursively drawn tree"></canvas>
      <output id="status" aria-live="polite"></output>
    </main>

    <script>
      // Try depth: 7 → 10, spread: 0.42 → 0.7, or wind: 0 → 0.12.
      const depth = 8
      const spread = 0.48
      const lengthRatio = 0.73
      const wind = 0.025
      const leafColor = '#718355'
      const blossomColor = '#e8aeb7'

      const canvas = document.getElementById('tree')
      const context = canvas.getContext('2d')
      const status = document.getElementById('status')

      const drawCircle = (x, y, radius, color) => {
        context.beginPath()
        context.fillStyle = color
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fill()
      }

      const drawBranch = (remaining, length, thickness) => {
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, -length)
        context.lineWidth = thickness
        context.strokeStyle = remaining < 3 ? leafColor : '#66513d'
        context.stroke()
        context.translate(0, -length)

        if (remaining === 0) {
          drawCircle(0, 0, 5, blossomColor)
          return
        }

        context.save()
        context.rotate(-spread + wind)
        drawBranch(remaining - 1, length * lengthRatio, thickness * 0.72)
        context.restore()

        context.save()
        context.rotate(spread + wind)
        drawBranch(remaining - 1, length * lengthRatio, thickness * 0.72)
        context.restore()
      }

      context.fillStyle = '#fbfaf5'
      context.fillRect(0, 0, canvas.width, canvas.height)

      drawCircle(790, 112, 48, '#f1c75b')

      context.save()
      context.translate(canvas.width / 2, canvas.height - 48)
      context.lineCap = 'round'
      drawBranch(depth, 142, 15)
      context.restore()

      context.fillStyle = '#dce4d5'
      context.fillRect(0, canvas.height - 48, canvas.width, 48)

      const branches = 2 ** (depth + 1) - 1
      status.textContent = branches + ' branches · spread ' + spread + ' · wind ' + wind
      canvas.setAttribute('aria-label', 'A recursive tree with ' + branches + ' branches')
    </script>
  </body>
</html>
`
