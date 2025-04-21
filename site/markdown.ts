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
    const m = tok.info.match(/(\d+) *(\d+)( +.+)?/)

    if (tok.nesting === 1) {
      const w = +m![1] * 2
      const h = +m![2] * 2
      const classes = m![3] ?? ''
      return `<iframe class='runcode${classes}' width="${w}" height="${h}">\n`
    }
    else {
      return `</iframe>\n`
    }
  }
})
