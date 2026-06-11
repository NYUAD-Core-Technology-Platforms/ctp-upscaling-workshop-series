import { defineMermaidSetup } from '@slidev/types'

// 'loose' lets Mermaid `click` directives open links (e.g. the CTPSS booking
// portal node on the "Book an instrument" slide). Safe here: the deck only links
// to trusted internal URLs we author ourselves.
export default defineMermaidSetup(() => ({
  securityLevel: 'loose',
}))
