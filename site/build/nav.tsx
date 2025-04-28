import mdattrs from 'markdown-it-attrs'
import navMd from './nav.md'
import { markdown, renameMarkdownLinks } from "./plugins/markdown.ts"

const renderer = markdown({}, [
  renameMarkdownLinks,
  mdattrs,
])

const navHtml = renderer.render(navMd)

export const Nav = () => navHtml
