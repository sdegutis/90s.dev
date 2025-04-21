import MarkdownIt from "markdown-it"
import containers from 'markdown-it-container'
import { shiki } from "./shiki.ts"

export const md = new MarkdownIt({ html: true, })
md.use(shiki)
containers(md, 'note', {})
containers(md, 'features', {})

containers(md, 'runcode', {
  render: (tokens, i) => {
    const tok = tokens[i]
    const isOpen = tok.nesting === 1
    const opener = tokens[isOpen ? i : i - 1]

    const m = opener.info.match(/(\d+) *(\d+)( +.+)?/)
    const w = +m![1] * 2
    const h = +m![2] * 2
    const classes = m![3] ?? ''

    if (isOpen) {
      return `<iframe class='runcode${classes}' width="${w}" height="${h}">\n`
    }
    else {
      const useConsole = classes.includes('console')
      let line = `</iframe>\n`
      if (useConsole) {
        line += `<div class="code-output" style="width:${w}px;height:${h}px"></div>\n`
      }
      return line
    }
  }
})
