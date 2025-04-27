import type { Options, Renderer, Token } from "markdown-it"
import MarkdownIt from "markdown-it"
import anchors from 'markdown-it-anchor'
import containers from 'markdown-it-container'
import { oshost } from "../../isdev.ts"
import { highlightCode } from "./shiki.ts"

export type Toc = { level: number, id: string, text: string }[]

export function makeRenderer<T>(opts: MarkdownIt.Options, plugins: MarkdownIt.PluginWithOptions[]) {
  const md = new MarkdownIt({ html: true, ...opts })
  plugins.forEach(fn => md.use(fn))
  return md
}

const md = new MarkdownIt({
  html: true,
})

md.use(renameMarkdownLinks)
md.use(tableOfContents)
md.use(highlightCode)
md.use(anchorLinks)
md.use(checkForIframes(oshost))
md.use(sectionMacro)
md.use(runcodeMacro)

export function renameMarkdownLinks(md: MarkdownIt) {
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
}

export function checkForIframes(oshost: string) {
  return (md: MarkdownIt) => {
    const linkopen = md.renderer.rules["link_open"] ?? defaultRender
    md.renderer.rules["link_open"] = (tokens, idx, opts, env, self) => {
      let href = tokens[idx].attrGet('href')!
      if (href.startsWith(oshost + '/#')) {
        env.iframes = true
      }
      return linkopen(tokens, idx, opts, env, self)
    }
  }
}

export function tableOfContents(md: MarkdownIt) {
  const heading_open = md.renderer.rules['heading_open'] ?? defaultRender
  md.renderer.rules['heading_open'] = (tokens, idx, opts, env, self) => {
    const toc: Toc = env.toc ??= []
    const tok = tokens[idx]
    const level = tok.markup.length
    const id = tok.attrGet('id')!
    const text = md.renderInline(tokens[idx + 1].content, env)
    toc.push({ level, id, text })
    return heading_open(tokens, idx, opts, env, self)
  }
}

export function anchorLinks(md: MarkdownIt) {
  anchors(md, {
    permalink: anchors.permalink.linkInsideHeader({
      placement: 'before',
    }),
    slugify,
  })
}


export function sectionMacro(md: MarkdownIt) {
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

export function runcodeMacro(md: MarkdownIt) {
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
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ +/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function defaultRender(tokens: Token[], idx: number, opts: Options, env: any, self: Renderer) {
  return self.renderToken(tokens, idx, opts)
}
