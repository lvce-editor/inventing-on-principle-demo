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

const waitForWorkspaceUri = async (Command: any, expected: string): Promise<void> => {
  for (let i = 0; i < 40; i++) {
    const actual = await Command.execute('Workspace.getUri')
    if (actual === expected) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  const actual = await Command.execute('Workspace.getUri')
  throw new Error(`expected workspace uri ${expected}, received ${actual}`)
}

export const test: Test = async ({ Command, Editor, expect, Extension, Locator }) => {
  await Extension.activateByEvent('onCommand:inventingOnPrinciple.openLiveTree', '', 2)
  await Command.executeExtensionCommand('inventingOnPrinciple.openLiveTree')

  await waitForWorkspaceUri(Command, 'memfs:///inventing-on-principle')

  const sideBar = Locator('.SideBar:not(.SecondarySideBar)')
  const activityBar = Locator('.ActivityBar')
  const statusBar = Locator('.StatusBar')
  const titleBar = Locator('.TitleBar')
  await expect(sideBar).toBeHidden()
  await expect(activityBar).toBeHidden()
  await expect(statusBar).toBeHidden()
  await expect(titleBar).toBeHidden()

  const preview = Locator('.Viewlet.Preview')
  const canvas = preview.locator('#tree')
  const status = preview.locator('#status')
  await expect(preview).toBeVisible()
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('width', '960')
  await expect(canvas).toHaveAttribute('height', '640')
  await expect(status).toContainText('511 branches')

  await Editor.setCursor(63, 20)
  await Editor.selectCharacterRight()
  await Editor.type('9')
  await waitForText(expect, status, '1023 branches')
}
