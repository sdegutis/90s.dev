import type MarkdownIt from "markdown-it"
import { oshost } from "../../static.ts"
import { defaultRender } from "./mdhelper.ts"

const escaped = encodeURI('${OSHOST}')


export function checkForOsHost(md: MarkdownIt) {
  // console.log(md.core.ruler.getRules(''))

  // console.log(md.core.ruler.before('', 'hi', state => {
  //   console.log(state)
  // }))

  const linkopen = md.renderer.rules["link_open"] ?? defaultRender
  md.renderer.rules["link_open"] = (tokens, idx, opts, env, self) => {
    const tok = tokens[idx]
    const href = tok.attrGet('href')!

    if (href.startsWith(escaped)) {
      tok.attrSet('href', href.replace(escaped, oshost))
    }

    return linkopen(tokens, idx, opts, env, self)
  }
}
