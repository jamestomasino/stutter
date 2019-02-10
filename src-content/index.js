/* global browser */

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
      playStutter('This is just a test. Eventually this method will be replaced with a parser of page content to extract all the readable text on page.')
      break
    default:
      break
  }
}

browser.runtime.onMessage.addListener(onMessage)
