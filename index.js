const browser = window.msBrowser || window.browser || window.chrome

const Stutter = require('./lib/stutter')

var stutter // stutter Object
var stutterOptions = {
  'wpm': 700,
  'slowStartCount': 5,
  'sentenceDelay': 2.5,
  'otherPuncDelay': 1.5,
  'shortWordDelay': 1.3,
  'longWordDelay': 1.4
}

browser.extension.onMessage.addListener(request => {
  switch (request.functiontoInvoke) {
    case 'stutterSelectedText':
      playStutter(request.selectedText)
      break
    case 'stutterFullPage':
      playStutter('This is just a test.')
      break
    default:
      break
  }
})

function playStutter (text) {
  stutter = new Stutter(stutterOptions)
  stutter.setText(text)
  stutter.play()
}
