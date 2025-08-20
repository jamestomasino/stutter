import Readability from './lib/Readability.cjs'
import Stutter from './lib/stutter'
import UI from './lib/ui'
import { normalizeExtractedText } from './lib/text.mjs'

let stutter
let ui

function normalizeText (text) {
  return text ? text.replace(/\s+/g, ' ').trim() : ''
}

function playStutter (text) {
  if (stutter) {
    stutter.destroy()
  }

  stutter = new Stutter(ui)
  stutter.setText(text)
  stutter.play()
}

function safePlayStutter (text) {
  const normalized = normalizeText(text)
  if (!normalized) {
    return false
  }

  try {
    playStutter(normalized)
    return true
  } catch (error) {
    console.error('Stutter failed to start playback.', error)
    return false
  }
}

function getFallbackPageText () {
  return normalizeText(document.body?.innerText)
}

async function onMessage (request) {
  let selection
  switch (request.functiontoInvoke) {
    case 'stutterSelectedText':
      // pass selection to Stutter
      safePlayStutter(request.selectedText)
      break
    case 'stutterFullPage':
      selection = getSelectionText()
      if (selection) {
        safePlayStutter(selection)
      } else {
        try {
          // close document switch Readability is destructive
          const doc = document.cloneNode(true)

          const supTags = doc.querySelectorAll('sup')
          supTags.forEach(sup => sup.remove())

          // Add a space after certain block-level elements to prevent word collisions
          const blockElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'dt', 'dd', 'br']
          blockElements.forEach(tag => {
            doc.querySelectorAll(tag).forEach(el => {
              // Only if it doesn't already end in whitespace
              if (!/\s$/.test(el.textContent)) {
                el.textContent += '\n\n'
              }
            })
          })

          let article = new Readability(doc).parse()
          if (!article || !article.textContent) {
            throw new Error('Readability returned no article content.')
          }

          article = normalizeExtractedText(article.textContent)
          if (!safePlayStutter(article)) {
            throw new Error('Playback failed after article extraction.')
          }
        } catch (error) {
          console.error('Stutter failed to extract article content.', error)
          safePlayStutter(getFallbackPageText())
        }
      }
      break
    default:
      break
  }
}

function getSelectionText () {
  let text = ''
  const activeEl = document.activeElement
  const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null
  if (activeElTagName === 'textarea' || activeElTagName === 'input') {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd)
  } else if (window.getSelection) {
    text = window.getSelection().toString()
  }
  return text
}
/* This check avoids duplicating the DOM and listeners in case we
 * are running stutter more than once. The first call to inject
 * this code from the background script will enter this condition
 * and create everything needed on the page. Subsequent calls to
 * inject will hit this condition and fail, avoiding double UI
 *
 * Unfortunately this does not stop CSS from being injected twice,
 * or the actual JS content from being injected multiple times. It
 * would be better to not inject more than once at all, but the
 * background script has no knowledge of whether the tab has loaded
 * stutter before or not on any given page.
 *
 * Consider this solution the "least bad" for now.
 */
if (!UI.INIT && !window.__stutter) {
  window.__stutter = true
  const browser = require('webextension-polyfill')
  ui = new UI()
  browser.runtime.onMessage.addListener(onMessage)
}
