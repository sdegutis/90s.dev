import MarkdownIt from "markdown-it"
import containers from 'markdown-it-container'
import { shiki } from "./shiki.ts"

export const md = new MarkdownIt({ html: true, })
md.use(shiki)
containers(md, 'note', {})
containers(md, 'features', {})

containers(md, 'placeholder', {
  render: (tokens, i) => {
    const tok = tokens[i]
    const m = tok.info.match(/\w+ (\d+) (\d+)/)

    if (tok.nesting === 1) {
      const w = +m![1]
      const h = +m![2]
      return `<iframe width="${w}" height="${h}>"`
    }
    else {
      return `</textarea>`
    }
  }
})
