import { executeCommand, writeFile } from '@lvce-editor/api'
import { liveTreeDocument } from './LiveTreeDocument.ts'

export interface OpenLiveTreeDependencies {
  readonly executeCommand: (command: string, ...parameters: readonly unknown[]) => Promise<unknown>
  readonly writeFile: (uri: string, content: string) => Promise<void>
}

const defaultDependencies: OpenLiveTreeDependencies = {
  executeCommand,
  writeFile,
}

export const workspaceUri = 'memfs:///inventing-on-principle'
export const liveTreeUri = `${workspaceUri}/inventing-on-principle.html`

const closeRestoredLiveTreeEditor = async (dependencies: OpenLiveTreeDependencies): Promise<void> => {
  const openEditorUris = await dependencies.executeCommand('GetActiveEditor.getOpenEditorUris')
  if (!Array.isArray(openEditorUris) || !openEditorUris.includes(liveTreeUri)) {
    return
  }
  await dependencies.executeCommand('Main.openUri', liveTreeUri)
  await dependencies.executeCommand('Main.closeActiveEditor')
}

export const openLiveTree = async (dependencies: OpenLiveTreeDependencies = defaultDependencies): Promise<void> => {
  await closeRestoredLiveTreeEditor(dependencies)
  await dependencies.writeFile(liveTreeUri, liveTreeDocument)
  await dependencies.executeCommand('Layout.showMain')
  await dependencies.executeCommand('Main.openUri', liveTreeUri)
  await dependencies.executeCommand('Layout.showPreview', liveTreeUri)
  await dependencies.executeCommand('Layout.hideSideBar')
  await dependencies.executeCommand('Layout.hideActivityBar')
  await dependencies.executeCommand('Layout.hideStatusBar')
  await dependencies.executeCommand('Layout.hideTitleBar')
}
