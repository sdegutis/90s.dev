import MarkdownIt from "markdown-it"
import anchors from 'markdown-it-anchor'
import inlineAttrs from 'markdown-it-attrs'
import containers from 'markdown-it-container'
import type MdTypes from "markdown-it/index.js"
import { oshost, tree } from "../../static.ts"
import { highlightCode } from "./highlighter.ts"
import { defaultRender } from "./mdhelper.ts"
import { runcodeMacro } from "./runcode.ts"
import { generateToc } from "./toc.ts"

export const md = markdown({}, [
  renameMarkdownLinks,
  inlineAttrs,
  generateToc,
  highlightCode,
  addHeaderPermalinks,
  checkForOsHost,
  sectionMacro,
  runcodeMacro,
])

function markdown(opts: MdTypes.Options, plugins: MdTypes.PluginWithOptions[]) {
  const md = new MarkdownIt({ html: true, ...opts })
  plugins.forEach(fn => md.use(fn))
  return md
}

function checkForOsHost(md: MarkdownIt) {
  md.core.ruler.after('normalize', 'hi', state => {
    state.src = state.src.replaceAll('${OSHOST}', oshost)
  })
}

function renameMarkdownLinks(md: MarkdownIt) {
  const linkopen = md.renderer.rules["link_open"] ?? defaultRender
  md.renderer.rules["link_open"] = (tokens, idx, opts, env, self) => {
    let href = tokens[idx].attrGet('href')!
    let hash = ''
    const hashi = href.indexOf('#')
    if (hashi !== -1) {
      hash = href.slice(hashi)
      href = href.slice(0, hashi)
    }

    const prefix = `/${tree.path}/public`
    if (href.startsWith(prefix)) href = href.slice(prefix.length)

    href = href.replace(/\.md$/, '.html')
    href += hash

    tokens[idx].attrSet('href', href)

    return linkopen(tokens, idx, opts, env, self)
  }
}

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
