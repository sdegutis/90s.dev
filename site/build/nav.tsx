import mdattrs from 'markdown-it-attrs'
import { oshost } from '../../globals.ts'
import navMd from './nav.md'
import { markdown, renameMarkdownLinks } from "./plugins/markdown.ts"

const md = markdown({}, [
  renameMarkdownLinks,
  mdattrs,
])

const navHtml = md.render(navMd.replaceAll('${OSHOST}', oshost))

export const Nav = () => navHtml
