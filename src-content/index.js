import Readability from './lib/Readability.cjs'
import Stutter from './lib/stutter'
import UI from './lib/ui'
const { convert } = require('html-to-text')
let stutter
let ui

function playStutter (text) {
  if (stutter) {
    stutter.destroy()
  }

  stutter = new Stutter(ui)
  stutter.setText(text)
  stutter.play()
}

function onMessage (request) {
  let selection
  switch (request.functiontoInvoke) {
    case 'stutterSelectedText':
      // pass selection to Stutter
      playStutter(request.selectedText)
      break
    case 'stutterFullPage':
      selection = getSelectionText()
      if (selection) {
        // console.log('Selection:', selection)
        playStutter(selection)
      } else {
        // close document switch Readability is destructive
        const documentClone = document.cloneNode(true)
        const article = new Readability(documentClone).parse()
        const pureText = convert(article.content, {
          selectors: [
            {
              selector: 'a',
              options: {
                ignoreHref: true,
                noAnchorUrl: true,
                noLinkBrackets: true
              }
            },
            {
              selector: 'img',
              format: 'skip'
            }
          ],
          wordwrap: false
        })
        // Pass article content to Stutter
        playStutter(pureText)
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
  if (activeElTagName === 'textarea') {
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
