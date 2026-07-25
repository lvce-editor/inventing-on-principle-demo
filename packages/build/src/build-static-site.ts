import { cp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

const sharedProcessPath = join(root, 'node_modules', '@lvce-editor', 'shared-process', 'index.js')
const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()
const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/inventing-on-principle-demo'
const { commitHash } = await sharedProcess.exportStatic({
  extensionPath: 'packages/extension',
  root,
  testPath: 'packages/e2e',
})

const extensionId = 'builtin.inventing-on-principle-demo'
await cp(join(root, 'packages', 'extension', 'dist'), join(root, 'dist', commitHash, 'extensions', extensionId, 'dist'), {
  force: true,
  recursive: true,
})

const staticDirectory = join(root, '.tmp', 'static')
await rm(staticDirectory, { force: true, recursive: true })
await cp(join(root, 'dist'), staticDirectory, { recursive: true })
