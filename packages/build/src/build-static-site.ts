import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const siteDirectory = join(root, 'dist', 'site')
const mediaDirectory = join(root, 'packages', 'extension', 'media')
const pageSource = join(root, 'demo', 'live-tree.html')

await rm(siteDirectory, { force: true, recursive: true })
await mkdir(siteDirectory, { recursive: true })

const sourceHtml = await readFile(pageSource, 'utf8')
const publishedHtml = sourceHtml.replaceAll('../packages/extension/media/', './')

await Promise.all([
  writeFile(join(siteDirectory, 'index.html'), publishedHtml),
  copyFile(join(mediaDirectory, 'index.css'), join(siteDirectory, 'index.css')),
  copyFile(join(mediaDirectory, 'index.js'), join(siteDirectory, 'index.js')),
])
