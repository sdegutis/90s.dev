import Shiki from '@shikijs/markdown-it'
import type MarkdownIt from 'markdown-it'
import { defaultRender, type Env } from './markdown.ts'

export const shiki = await Shiki({ theme: 'dark-plus' })

const tsx = ['ts', 'tsx', 'typescript']

export const highlightCode = (md: MarkdownIt) => {
  md.use(shiki)

  const oldfence = md.renderer.rules.fence ?? defaultRender
  md.renderer.rules.fence = (toks, idx, opts, env: Env, self) => {
    let html = oldfence(toks, idx, opts, env, self)
    if (tsx.includes(toks[idx].info)) {
      html += '<script type="module" src="/script/bettertsx.js"></script>\n'
    }
    return html
  }
}
