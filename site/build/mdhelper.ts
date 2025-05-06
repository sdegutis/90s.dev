import type MdTypes from "markdown-it/index.js"

export function defaultRender(tokens: MdTypes.Token[], idx: number, opts: MdTypes.Options, env: any, self: MdTypes.Renderer) {
  return self.renderToken(tokens, idx, opts)
}
