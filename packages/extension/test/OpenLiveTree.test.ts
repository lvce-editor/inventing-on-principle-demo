import assert from 'node:assert/strict'
import test from 'node:test'
import { liveTreeCss, liveTreeHtml, liveTreeJavaScript } from '../src/LiveTreeDocuments.ts'
import { liveTreeCssUri, liveTreeHtmlUri, liveTreeJavaScriptUri, openLiveTree } from '../src/OpenLiveTree.ts'

void test('openLiveTree creates separate source files, previews the HTML, and opens JavaScript last', async () => {
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
    ['writeFile', liveTreeHtmlUri, liveTreeHtml],
    ['writeFile', liveTreeCssUri, liveTreeCss],
    ['writeFile', liveTreeJavaScriptUri, liveTreeJavaScript],
    ['executeCommand', 'Layout.showMain'],
    ['executeCommand', 'Main.openUri', liveTreeHtmlUri],
    ['executeCommand', 'Layout.showPreview', liveTreeHtmlUri],
    ['executeCommand', 'Main.openUri', liveTreeJavaScriptUri],
    ['executeCommand', 'Layout.hidePanel'],
    ['executeCommand', 'Layout.hideSideBar'],
    ['executeCommand', 'Layout.hideActivityBar'],
    ['executeCommand', 'Layout.hideStatusBar'],
    ['executeCommand', 'Layout.hideTitleBar'],
  ])
})

void test('live tree documents expose a small editable recursive Canvas program', () => {
  assert.match(liveTreeHtml, /href="\.\/inventing-on-principle\.css"/)
  assert.match(liveTreeHtml, /src="\.\/inventing-on-principle\.js"/)
  assert.match(liveTreeHtml, /<canvas id="tree" width="960" height="640"/)
  assert.match(liveTreeCss, /canvas \{/)
  assert.match(liveTreeJavaScript, /const depth = 8/)
  assert.match(liveTreeJavaScript, /const spread = 0\.48/)
  assert.match(liveTreeJavaScript, /drawBranch\(remaining - 1/)
})
