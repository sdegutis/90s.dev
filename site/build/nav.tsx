import inlineAttrs from 'markdown-it-attrs'
import { markdown, renameMarkdownLinks } from "../plugins/markdown.ts"
import { checkForOsHost } from '../plugins/oshost.ts'
import navMd from './nav.md'

const md = markdown({}, [
  checkForOsHost,
  renameMarkdownLinks,
  inlineAttrs,
])

const navHtml = md.render(navMd)

export const Nav = () => navHtml
