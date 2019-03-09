import Readability from './lib/Readability'
import Stutter from './lib/stutter'
import UI from './lib/ui'

function playStutter (text) {
  if (stutter) {
    stutter.destroy()
  }

  stutter = new Stutter(ui)
  stutter.setText(text)
  stutter.play()
}

function onMessage (request) {
  switch (request.functiontoInvoke) {
    case 'stutterSelectedText':
      // pass selection to Stutter
      playStutter(request.selectedText)
      break
    case 'stutterFullPage':
      // close document switch Readability is destructive
      var documentClone = document.cloneNode(true)
      var article = new Readability(documentClone).parse()
      // Readability gives html output. strip it to plain text
      var div = document.createElement('div')
      div.innerHTML = article.content
      var pureText = div.textContent
      // textContent collapses some sentences which were separated by DOM
      // elements alone. We attempt to restore spaces between paragraphs.
      pureText = pureText.replace(/([.?!,:;])(?=\w)/ig, '$1 ')
      pureText = pureText.replace(/([.?!,:;])"(?=")/ig, '$1" ')
      pureText = pureText.replace(/([.?!,:;])"(?=\w)/ig, '$1 "')
      // Pass article content to Stutter
      playStutter(pureText)
      break
    default:
      break
  }
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
