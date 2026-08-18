import assert from 'node:assert/strict'
import test from 'node:test'
import { liveTreeDocument } from '../src/LiveTreeDocument.ts'
import { liveTreeUri, openLiveTree } from '../src/OpenLiveTree.ts'

void test('openLiveTree closes existing editors and creates a focused HTML editor and preview workspace', async () => {
  const calls: unknown[][] = []
  await openLiveTree({
    executeCommand: async (...parameters) => {
      calls.push(['executeCommand', ...parameters])
    },
    writeFile: async (...parameters) => {
      calls.push(['writeFile', ...parameters])
    },
  })

  assert.deepEqual(calls, [
    ['executeCommand', 'Main.closeAllEditors'],
    ['writeFile', liveTreeUri, liveTreeDocument],
    ['executeCommand', 'Layout.showMain'],
    ['executeCommand', 'Main.openUri', liveTreeUri],
    ['executeCommand', 'Layout.showPreview', liveTreeUri],
    ['executeCommand', 'Layout.hidePanel'],
    ['executeCommand', 'Layout.hideSideBar'],
    ['executeCommand', 'Layout.hideActivityBar'],
    ['executeCommand', 'Layout.hideStatusBar'],
    ['executeCommand', 'Layout.hideTitleBar'],
  ])
})

void test('liveTreeDocument exposes a small editable recursive Canvas program', () => {
  assert.match(liveTreeDocument, /const depth = 8/)
  assert.match(liveTreeDocument, /const spread = 0\.48/)
  assert.match(liveTreeDocument, /drawBranch\(remaining - 1/)
  assert.match(liveTreeDocument, /<canvas id="tree" width="960" height="640"/)
})
