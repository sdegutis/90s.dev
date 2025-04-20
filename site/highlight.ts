import ShikiMarkdownIt from '@shikijs/markdown-it'
import MarkdownIt from "markdown-it"
import containers from 'markdown-it-container'

console.log('Loading syntax highlighter stuff...')

export const md = new MarkdownIt({ html: true, })
containers(md, 'note', {})
containers(md, 'features', {})

md.use(await ShikiMarkdownIt({
  theme: 'dark-plus',
}))

console.log('Done.')
