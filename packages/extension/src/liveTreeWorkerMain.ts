interface WebViewPort {
  invoke(method: string, ...parameters: unknown[]): Promise<unknown>
}

interface CreateOptions {
  port: WebViewPort
}

const create = async ({ port }: CreateOptions): Promise<Record<string, never>> => {
  await port.invoke('initialize')
  return {}
}

export const commandMap = {
  'WebView.create': create,
}
