import MarkdownIt from "markdown-it"
import containers from 'markdown-it-container'
import { shiki } from "./shiki.ts"


export const md = new MarkdownIt({ html: true, })
md.use(shiki)
containers(md, 'note', {})
containers(md, 'features', {})
// containers(md, 'tsx', {
//   marker: '`',
//   render: (tokens, i) => {
//     const tok = tokens[i]

//     if (tok.nesting === 1) {
//       return `<textarea class='tsx'>`
//     }
//     else {
//       return `</textarea>`
//     }

//     console.log(tok)
//     return `hi world`
//   }
// })


console.log('Done.')
