import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'inventing-on-principle.live-tree'

export const test: Test = async ({ Command, expect, Extension, Locator }) => {
  await Extension.activateByEvent('onCommand:inventingOnPrinciple.openLiveTree', '', 2)
  await Command.executeExtensionCommand('inventingOnPrinciple.openLiveTree')

  const webView = Locator('.WebViewIframe')
  await expect(webView).toBeVisible()
}
