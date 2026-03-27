export const DEFAULT_FONT_ID = 'atkinson-hyperlegible'

export const STUTTER_FONTS = [
  {
    id: 'atkinson-hyperlegible',
    label: 'Atkinson Hyperlegible (Default)',
    family: '"Stutter Atkinson Hyperlegible", Arial, sans-serif'
  },
  {
    id: 'system-ui',
    label: 'System UI',
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  {
    id: 'sans-serif',
    label: 'Sans Serif',
    family: 'Arial, Helvetica, sans-serif'
  },
  {
    id: 'serif',
    label: 'Serif',
    family: 'Georgia, "Times New Roman", serif'
  },
  {
    id: 'monospace',
    label: 'Monospace',
    family: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace'
  },
  {
    id: 'ibm-plex-sans',
    label: 'IBM Plex Sans',
    family: '"IBM Plex Sans", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap'
  },
  {
    id: 'source-sans-3',
    label: 'Source Sans 3',
    family: '"Source Sans 3", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;700&display=swap'
  },
  {
    id: 'source-serif-4',
    label: 'Source Serif 4',
    family: '"Source Serif 4", serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;700&display=swap'
  },
  {
    id: 'noto-sans',
    label: 'Noto Sans',
    family: '"Noto Sans", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap'
  },
  {
    id: 'noto-serif',
    label: 'Noto Serif',
    family: '"Noto Serif", serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&display=swap'
  },
  {
    id: 'literata',
    label: 'Literata',
    family: '"Literata", serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Literata:wght@400;700&display=swap'
  },
  {
    id: 'merriweather-sans',
    label: 'Merriweather Sans',
    family: '"Merriweather Sans", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&display=swap'
  },
  {
    id: 'fira-sans',
    label: 'Fira Sans',
    family: '"Fira Sans", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700&display=swap'
  },
  {
    id: 'lexend',
    label: 'Lexend',
    family: '"Lexend", sans-serif',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap'
  }
]

export function getFontOption(fontId) {
  return STUTTER_FONTS.find(font => font.id === fontId) || STUTTER_FONTS[0]
}

export function getFontFamilyStack(fontId) {
  return getFontOption(fontId).family
}

export function getFontStylesheet(fontId) {
  return getFontOption(fontId).stylesheet || null
}
