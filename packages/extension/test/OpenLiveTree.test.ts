import assert from 'node:assert/strict'
import test from 'node:test'
import { liveTreeDocument } from '../src/LiveTreeDocument.ts'
import { getLiveTreeUri, openLiveTree } from '../src/OpenLiveTree.ts'

void test('getLiveTreeUri appends the demo file without duplicating a slash', () => {
  assert.equal(getLiveTreeUri('memfs:///workspace/'), 'memfs:///workspace/inventing-on-principle.html')
})

void test('openLiveTree creates a native HTML editor and preview pair', async () => {
  const calls: unknown[][] = []
  await openLiveTree({
    executeCommand: async (...parameters) => {
      calls.push(['executeCommand', ...parameters])
    },
    getWorkspaceUri: async () => 'memfs:///workspace',
    writeFile: async (...parameters) => {
      calls.push(['writeFile', ...parameters])
    },
  })

  const uri = 'memfs:///workspace/inventing-on-principle.html'
  assert.deepEqual(calls, [
    ['writeFile', uri, liveTreeDocument],
    ['executeCommand', 'Layout.showMain'],
    ['executeCommand', 'Main.openUri', uri],
    ['executeCommand', 'Layout.showPreview', uri],
  ])
})

void test('liveTreeDocument exposes a small editable recursive Canvas program', () => {
  assert.match(liveTreeDocument, /const depth = 8/)
  assert.match(liveTreeDocument, /const spread = 0\.48/)
  assert.match(liveTreeDocument, /drawBranch\(remaining - 1/)
  assert.match(liveTreeDocument, /<canvas id="tree" width="960" height="640"/)
})
