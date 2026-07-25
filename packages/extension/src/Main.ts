import { activate as activateExtensionApi, executeCommand, registerCommand } from '@lvce-editor/api'

const commandId = 'inventingOnPrinciple.openLiveTree'
const openLiveTree = async (): Promise<void> => {
  await executeCommand('Layout.showMain')
  await executeCommand('Main.openUri', 'inventing-on-principle.live-tree')
}

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    execute: openLiveTree,
    id: commandId,
  })
}

export const deactivate = (): void => {}
