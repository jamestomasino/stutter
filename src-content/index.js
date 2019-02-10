/* global browser */

import Readability from './lib/Readability'
import Stutter from './lib/stutter'

var stutter // stutter Object
var stutterOptions = {
  'wpm': 700,
  'slowStartCount': 5,
  'sentenceDelay': 2.5,
  'otherPuncDelay': 1.5,
  'shortWordDelay': 1.3,
  'longWordDelay': 1.4
}

function playStutter (text) {
  if (stutter) {
    stutter.destroy()
  }
  stutter = new Stutter(stutterOptions)
  stutter.setText(text)
  stutter.play()
}

function onMessage (request) {
  switch (request.functiontoInvoke) {
    case 'stutterSelectedText':
      playStutter(request.selectedText)
      break
    case 'stutterFullPage':
      var documentClone = document.cloneNode(true)
      var article = new Readability(documentClone).parse()
      var div = document.createElement('div')
      div.innerHTML = article.content
      var pureText = div.innerText
      playStutter(pureText)
      break
    default:
      break
  }
}

browser.runtime.onMessage.addListener(onMessage)
