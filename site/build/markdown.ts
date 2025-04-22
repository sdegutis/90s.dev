import MarkdownIt from "markdown-it"
import containers from 'markdown-it-container'

export const md = new MarkdownIt({ html: true, })
containers(md, 'note', {})
containers(md, 'features', {})

containers(md, 'runcode', {
  render: (tokens, i) => {
    const tok = tokens[i]
    const isOpen = tok.nesting === 1
    const opener = tokens[isOpen ? i : i - 2]

    const m = opener.info.match(/(\d+) *(\d+)( +.+)?/)
    const w = +m![1] * 2
    const h = +m![2] * 2
    const classes = m![3] ?? ''

    if (isOpen) {
      let line = `<div class='runcode${classes}'>\n`
      return line
    }
    else {
      const useConsole = classes.includes('console')
      let line = `<iframe width="${w}" height="${h}"></iframe>\n`
      if (useConsole) {
        line += `<div class="code-output" style="width:${w}px;height:${h}px"></div>\n`
      }
      line += `</div>\n`
      return line
    }
  }
})
