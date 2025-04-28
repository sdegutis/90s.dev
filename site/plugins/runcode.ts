import type MarkdownIt from "markdown-it"
import containers from 'markdown-it-container'
import type { Env } from "./markdown.ts"

declare module "./markdown.ts" {
  interface Env {
    runcode?: boolean,
  }
}

export function runcodeMacro(md: MarkdownIt) {
  containers(md, 'runcode', {
    render: (tokens, i, opts, env: Env, self) => {
      const tok = tokens[i]
      const isOpen = tok.nesting === 1
      const opener = tokens[isOpen ? i : i - 2]

      env.runcode = true

      const m = opener.info.match(/(\d+) *(\d+)( +.+)?/)
      const w = +m![1] * 2
      const h = +m![2] * 2
      const classes = m![3] ?? ''

      if (isOpen) {
        let line = `<div class='runcode${classes}'>\n`
        return line
      }
      else {
        let line = `<iframe class='embedded' width="${w}" height="${h}"></iframe>\n`
        line += `</div>\n`
        return line
      }
    }
  })
}
