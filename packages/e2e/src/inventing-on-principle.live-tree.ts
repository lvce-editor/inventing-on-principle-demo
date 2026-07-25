import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'inventing-on-principle.live-tree'

const waitForText = async (expect: any, locator: any, value: string): Promise<void> => {
  let lastError: unknown
  for (let i = 0; i < 40; i++) {
    try {
      await expect(locator).toContainText(value)
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw lastError
}

export const test: Test = async ({ Command, Editor, expect, Extension, Locator }) => {
  await Extension.activateByEvent('onCommand:inventingOnPrinciple.openLiveTree', '', 2)
  await Command.executeExtensionCommand('inventingOnPrinciple.openLiveTree')

  const preview = Locator('.Viewlet.Preview')
  const canvas = preview.locator('#tree')
  const status = preview.locator('#status')
  await expect(preview).toBeVisible()
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('width', '960')
  await expect(canvas).toHaveAttribute('height', '640')
  await expect(status).toContainText('511 branches')

  const source = await Editor.getText()
  await Editor.setText(source.replace('const depth = 8', 'const depth = 9'))
  await waitForText(expect, status, '1023 branches')
}
