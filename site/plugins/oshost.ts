import type MarkdownIt from "markdown-it"
import { oshost } from "../../globals.ts"
import { defaultRender, type Env } from "./markdown.ts"

export function checkForOsHost(md: MarkdownIt) {
  const linkopen = md.renderer.rules["link_open"] ?? defaultRender
  md.renderer.rules["link_open"] = (tokens, idx, opts, env: Env, self) => {
    const tok = tokens[idx]
    const href = tok.attrGet('href')!
    const escaped = encodeURI('${OSHOST}')

    if (href.startsWith(escaped)) {
      tok.attrSet('href', href.replace(escaped, oshost))
    }

    return linkopen(tokens, idx, opts, env, self)
  }
}
