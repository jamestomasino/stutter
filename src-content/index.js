/* global browser */

import Readability from './lib/Readability'
import Stutter from './lib/stutter'
import { ui } from './lib/ui'

var stutter

function playStutter (text) {
  if (stutter) {
    stutter.destroy()
  }

  browser.storage.local.get('stutterOptions').then(result => {
    if (result.stutterOptions) {
      stutter = new Stutter(ui, result.stutterOptions)
    } else {
      stutter = new Stutter(ui)
    }
    stutter.setText(text)
    stutter.play()
  },
  () => {
    console.log('No settings found, use defaults')
    stutter = new Stutter(ui)
    stutter.setText(text)
    stutter.play()
  })
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
      var pureText = div.innerText
      // Pass article content to Stutter
      playStutter(pureText)
      break
    default:
      break
  }
}
browser.runtime.onMessage.addListener(onMessage)
