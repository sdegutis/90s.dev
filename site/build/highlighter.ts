import * as ShikiMd from '@shikijs/markdown-it'
import type MarkdownIt from 'markdown-it'
import * as Shiki from 'shiki'
import { tree } from '../../static.ts'
import { defaultRender } from './mdhelper.ts'

const highlighter = await Shiki.createHighlighter({
  themes: ['dark-plus'],
  langs: ['typescript', 'tsx', 'ini'],
})

const bettertsx = ['ts', 'tsx', 'typescript']

export const highlightCode = (md: MarkdownIt) => {
  md.use(ShikiMd.fromHighlighter(highlighter, { theme: 'dark-plus' }))

  const oldfence = md.renderer.rules.fence ?? defaultRender
  md.renderer.rules.fence = (toks, idx, opts, env, self) => {
    let html = oldfence(toks, idx, opts, env, self)
    if (bettertsx.includes(toks[idx].info)) {
      html += '<script type="module" src="/script/bettertsx.js"></script>\n'
    }
    return html
  }
}

tree.onModuleInvalidated(import.meta.url, () => {
  highlighter.dispose()
})
