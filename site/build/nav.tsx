import mdattrs from 'markdown-it-attrs'
import navMd from './nav.md'
import { markdown, renameMarkdownLinks } from "./plugins/markdown.ts"

const md = markdown({}, [
  renameMarkdownLinks,
  mdattrs,
])

const navHtml = md.render(navMd)

export const Nav = () => navHtml
