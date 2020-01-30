/* global DOMParser */
import Readability from './lib/Readability'
import Stutter from './lib/stutter'
import UI from './lib/ui'

function playStutter (text, locale) {
  if (stutter) {
    stutter.destroy()
  }

  stutter = new Stutter(ui, locale)
  stutter.setText(text)
  stutter.play()
}

function onMessage (request) {
  switch (request.functiontoInvoke) {
    case 'stutterSelectedText':
      // pass selection to Stutter
      playStutter(request.selectedText, request.locale)
      break
    case 'stutterFullPage':
      let selection = getSelectionText()
      if (selection) {
        console.log('Selection:', selection)
        playStutter(selection, request.locale)
      } else {
        // close document switch Readability is destructive
        var documentClone = document.cloneNode(true)
        var article = new Readability(documentClone).parse()
        // Readability gives html output. strip it to plain text
        var div = document.createElement('div')
        var dom = new DOMParser().parseFromString('<template>' + article.content + '</template>', 'text/html').head
        div.appendChild(dom.firstElementChild.content)
        var pureText = div.textContent
        // Pass article content to Stutter
        playStutter(pureText, request.locale)
      }
      break
    default:
      break
  }
}

function getSelectionText () {
  var text = ''
  var activeEl = document.activeElement
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null
  if ((activeElTagName === 'textarea') || ((activeElTagName === 'input' && /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) && (typeof activeEl.selectionStart === 'number'))) {
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
  var browser = require('webextension-polyfill')
  var stutter
  var ui = new UI()
  browser.runtime.onMessage.addListener(onMessage)
}
