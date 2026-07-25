import * as esbuild from 'esbuild'
import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const extensionPath = join(root, 'packages', 'extension')
const outputDirectory = join(extensionPath, 'dist')

await rm(outputDirectory, { force: true, recursive: true })
await mkdir(outputDirectory, { recursive: true })

await esbuild.build({
  bundle: true,
  entryPoints: {
    extensionMain: join(extensionPath, 'src', 'extensionMain.ts'),
    liveTreeWorkerMain: join(extensionPath, 'src', 'liveTreeWorkerMain.ts'),
  },
  external: ['electron', 'node:*'],
  format: 'esm',
  outdir: outputDirectory,
  platform: 'browser',
  sourcemap: true,
  target: 'esnext',
})
