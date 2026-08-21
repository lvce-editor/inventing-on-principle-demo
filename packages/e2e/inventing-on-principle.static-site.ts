import { expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { chromium } from 'playwright'

const pathPrefix = '/inventing-on-principle-demo'
const staticRoot = join(import.meta.dirname, '..', '..', '.tmp', 'static')
const contentTypes: Readonly<Record<string, string>> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

const getFilePath = (requestUrl: string): string | undefined => {
  const url = new URL(requestUrl, 'http://localhost')
  let pathname = decodeURIComponent(url.pathname)
  if (pathname === pathPrefix || pathname === `${pathPrefix}/`) {
    pathname = '/index.html'
  } else if (pathname.startsWith(`${pathPrefix}/`)) {
    pathname = pathname.slice(pathPrefix.length)
  } else {
    return undefined
  }
  const relativePath = normalize(pathname).replace(/^[/\\]+/, '')
  const filePath = join(staticRoot, relativePath)
  if (!filePath.startsWith(`${staticRoot}${sep}`)) {
    return undefined
  }
  return filePath
}

const handleRequest = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  const filePath = getFilePath(request.url || '')
  if (!filePath) {
    response.writeHead(404)
    response.end('Not Found')
    return
  }
  try {
    const content = await readFile(filePath)
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
    })
    response.end(content)
  } catch {
    response.writeHead(404)
    response.end('Not Found')
  }
}

const server = createServer((request, response) => {
  void handleRequest(request, response)
})

await new Promise<void>((resolve) => {
  server.listen(0, '127.0.0.1', resolve)
})

const address = server.address()
if (!address || typeof address === 'string') {
  throw new Error('Failed to start static test server')
}

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  const url = `http://127.0.0.1:${address.port}${pathPrefix}/`
  const sourceFirstLine = page.locator('.Main .EditorRow', { hasText: '// Try depth:' })
  const previewCanvas = page.locator('.Viewlet.Preview #tree')

  await page.goto(url)
  await expect(sourceFirstLine).toBeVisible()
  await expect(previewCanvas).toBeVisible()

  await page.reload()
  await expect(sourceFirstLine).toBeVisible()
  await expect(previewCanvas).toBeVisible()
} finally {
  await browser.close()
  server.close()
}
