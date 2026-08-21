import { executeCommand, writeFile } from '@lvce-editor/api'
import { liveTreeCss, liveTreeHtml, liveTreeJavaScript } from './LiveTreeDocuments.ts'

export interface OpenLiveTreeDependencies {
  readonly executeCommand: (command: string, ...parameters: readonly unknown[]) => Promise<unknown>
  readonly writeFile: (uri: string, content: string) => Promise<void>
}

const defaultDependencies: OpenLiveTreeDependencies = {
  executeCommand,
  writeFile,
}

export const workspaceUri = 'memfs:///inventing-on-principle'
export const liveTreeHtmlUri = `${workspaceUri}/inventing-on-principle.html`
export const liveTreeCssUri = `${workspaceUri}/inventing-on-principle.css`
export const liveTreeJavaScriptUri = `${workspaceUri}/inventing-on-principle.js`

export const openLiveTree = async (dependencies: OpenLiveTreeDependencies = defaultDependencies): Promise<void> => {
  await dependencies.executeCommand('Main.closeAllEditors')
  await dependencies.writeFile(liveTreeHtmlUri, liveTreeHtml)
  await dependencies.writeFile(liveTreeCssUri, liveTreeCss)
  await dependencies.writeFile(liveTreeJavaScriptUri, liveTreeJavaScript)
  await dependencies.executeCommand('Layout.showMain')
  await dependencies.executeCommand('Main.openUri', liveTreeHtmlUri)
  await dependencies.executeCommand('Layout.showPreview', liveTreeHtmlUri)
  await dependencies.executeCommand('Main.openUri', liveTreeJavaScriptUri)
  await dependencies.executeCommand('Layout.hidePanel')
  await dependencies.executeCommand('Layout.hideSideBar')
  await dependencies.executeCommand('Layout.hideActivityBar')
  await dependencies.executeCommand('Layout.hideStatusBar')
  await dependencies.executeCommand('Layout.hideTitleBar')
}
