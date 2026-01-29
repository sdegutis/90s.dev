import MarkdownIt from "markdown-it"
import anchors from 'markdown-it-anchor'
import inlineAttrs from 'markdown-it-attrs'
import containers from 'markdown-it-container'
import footnotes from 'markdown-it-footnote'
import { highlightCode } from "./highlighter.ts"
import { generateToc } from "./toc.ts"

export const md = new MarkdownIt({
  html: true,
  typographer: true,
})

md.use(inlineAttrs)
md.use(generateToc)
md.use(footnotes)
md.use(highlightCode)
md.use(addHeaderPermalinks)
md.use(sectionMacro)

function addHeaderPermalinks(md: MarkdownIt) {
  anchors(md, {
    permalink: anchors.permalink.linkInsideHeader({
      placement: 'before',
    }),
    slugify,
  })
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ +/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function sectionMacro(md: MarkdownIt) {
  containers(md, 'section', {
    render: (tokens, i) => {
      const tok = tokens[i]
      const classes = tok.info.match(/^ *section *(.+)$/)?.[1]
      return tok.nesting === 1
        ? `<section class='${classes}'>\n`
        : `</section>\n`
    }
  })
}
