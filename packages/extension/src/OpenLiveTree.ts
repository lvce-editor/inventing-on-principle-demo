import { executeCommand, getWorkspaceUri, writeFile } from '@lvce-editor/api'
import { liveTreeDocument } from './LiveTreeDocument.ts'

export interface OpenLiveTreeDependencies {
  readonly executeCommand: (command: string, ...parameters: readonly unknown[]) => Promise<unknown>
  readonly getWorkspaceUri: () => Promise<string | null>
  readonly writeFile: (uri: string, content: string) => Promise<void>
}

const defaultDependencies: OpenLiveTreeDependencies = {
  executeCommand,
  getWorkspaceUri,
  writeFile,
}

export const getLiveTreeUri = (workspaceUri: string | null): string => {
  return workspaceUri ? `${workspaceUri.replace(/\/$/, '')}/inventing-on-principle.html` : 'memfs:///inventing-on-principle.html'
}

export const openLiveTree = async (dependencies: OpenLiveTreeDependencies = defaultDependencies): Promise<void> => {
  const workspaceUri = await dependencies.getWorkspaceUri()
  const uri = getLiveTreeUri(workspaceUri)
  await dependencies.writeFile(uri, liveTreeDocument)
  await dependencies.executeCommand('Layout.showMain')
  await dependencies.executeCommand('Main.openUri', uri)
  await dependencies.executeCommand('Layout.showPreview', uri)
}
