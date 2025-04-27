import MarkdownIt, { type Renderer } from "markdown-it"
import anchors from 'markdown-it-anchor'
import containers from 'markdown-it-container'
import type * as Toc from 'markdown-it-toc-done-right'
import toc from 'markdown-it-toc-done-right'
import { shiki } from "./shiki.ts"

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

md.use(md => {
  const defaultRender: Renderer.RenderRule = (tokens, idx, opts, env, self) => {
    return self.renderToken(tokens, idx, opts)
  }

  const linkopen = md.renderer.rules["link_open"] ?? defaultRender

  md.renderer.rules["link_open"] = (tokens, idx, opts, env, self) => {
    let href = tokens[idx].attrGet('href')!
    let hash = ''
    const hashi = href.indexOf('#')
    if (hashi !== -1) {
      hash = href.slice(hashi)
      href = href.slice(0, hashi)
    }

    href = href.replace(/\.md$/, '.html')
    href += hash

    tokens[idx].attrSet('href', href)

    return linkopen(tokens, idx, opts, env, self)
  }
})

shiki(md)

const slugify = (s: string) => s
  .toLowerCase()
  .replace(/ +/g, '-')
  .replace(/[^a-z0-9-]/g, '')

toc(md, {
  callback(html, ast) { currenttoc = html },
  slugify,
  listType: 'ul',
  format: s => '# ' + s,
  containerId: 'toc',
  level: 1,
} satisfies Partial<Toc.TocOptions>)

anchors(md, {
  permalink: anchors.permalink.linkInsideHeader({
    placement: 'before',
  }),
  slugify,
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
