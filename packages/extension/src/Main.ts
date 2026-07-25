import { activate as activateExtensionApi, registerCommand } from '@lvce-editor/api'
import { openLiveTree } from './OpenLiveTree.ts'

const commandId = 'inventingOnPrinciple.openLiveTree'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    execute: openLiveTree,
    id: commandId,
  })
}

export const deactivate = (): void => {}
