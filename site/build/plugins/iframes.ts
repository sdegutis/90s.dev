import type MarkdownIt from "markdown-it"
import { oshost } from "../../../data.ts"
import { defaultRender, type Env } from "./markdown.ts"

declare module "./markdown.ts" {
  interface Env {
    iframes?: boolean
  }
}

export function checkForIframes(md: MarkdownIt) {
  const linkopen = md.renderer.rules["link_open"] ?? defaultRender
  md.renderer.rules["link_open"] = (tokens, idx, opts, env: Env, self) => {
    let href = tokens[idx].attrGet('href')!
    if (href.startsWith(oshost + '/#')) {
      env.iframes = true
    }
    return linkopen(tokens, idx, opts, env, self)
  }
}
