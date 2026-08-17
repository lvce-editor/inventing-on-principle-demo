import assert from 'node:assert/strict'
import test from 'node:test'
import { liveTreeDocument } from '../src/LiveTreeDocument.ts'
import { liveTreeUri, openLiveTree } from '../src/OpenLiveTree.ts'

void test('openLiveTree creates a focused native HTML editor and preview workspace', async () => {
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
    ['executeCommand', 'GetActiveEditor.getOpenEditorUris'],
    ['writeFile', liveTreeUri, liveTreeDocument],
    ['executeCommand', 'Layout.showMain'],
    ['executeCommand', 'Main.openUri', liveTreeUri],
    ['executeCommand', 'Layout.showPreview', liveTreeUri],
    ['executeCommand', 'Layout.hideSideBar'],
    ['executeCommand', 'Layout.hideActivityBar'],
    ['executeCommand', 'Layout.hideStatusBar'],
    ['executeCommand', 'Layout.hideTitleBar'],
  ])
})

void test('openLiveTree replaces a restored stale live tree editor', async () => {
  const calls: unknown[][] = []
  await openLiveTree({
    executeCommand: async (...parameters) => {
      calls.push(['executeCommand', ...parameters])
      if (parameters[0] === 'GetActiveEditor.getOpenEditorUris') {
        return [liveTreeUri]
      }
    },
    writeFile: async (...parameters) => {
      calls.push(['writeFile', ...parameters])
    },
  })

  assert.deepEqual(calls.slice(0, 4), [
    ['executeCommand', 'GetActiveEditor.getOpenEditorUris'],
    ['executeCommand', 'Main.openUri', liveTreeUri],
    ['executeCommand', 'Main.closeActiveEditor'],
    ['writeFile', liveTreeUri, liveTreeDocument],
  ])
})

void test('liveTreeDocument exposes a small editable recursive Canvas program', () => {
  assert.match(liveTreeDocument, /const depth = 8/)
  assert.match(liveTreeDocument, /const spread = 0\.48/)
  assert.match(liveTreeDocument, /drawBranch\(remaining - 1/)
  assert.match(liveTreeDocument, /<canvas id="tree" width="960" height="640"/)
})
