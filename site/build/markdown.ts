import MarkdownIt from "markdown-it"
import anchors from 'markdown-it-anchor'
import containers from 'markdown-it-container'
import type * as Toc from 'markdown-it-toc-done-right'
import toc from 'markdown-it-toc-done-right'

let currenttoc: string
export function render(text: string) {
  return {
    html: md.render(text),
    toc: currenttoc,
  }
}

const md = new MarkdownIt({
  html: true,
})

toc(md, {
  callback(html, ast) { currenttoc = html },
  containerClass: 'toc',
  level: 2,
} satisfies Partial<Toc.TocOptions>)

anchors(md, {
  permalink: anchors.permalink.ariaHidden({}),
})

containers(md, 'section', {
  render: (tokens, i) => {
    const tok = tokens[i]
    const classes = tok.info.match(/^ *section *(.+)$/)?.[1]
    return tok.nesting === 1
      ? `<section class='${classes}'>\n`
      : `</section>\n`
  }
})

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
      let line = `<div class='fullrow runcode${classes}'>\n`
      return line
    }
    else {
      let line = `<iframe class='embedded' width="${w}" height="${h}"></iframe>\n`
      line += `</div>\n`
      return line
    }
  }
})
