/* global browser */

import Readability from './lib/Readability'
import Stutter from './lib/stutter'
import StutterOptions from './lib/stutterOptions'

var stutter
var stutterOptions = new StutterOptions()

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

// Logic belonging to front-end display
// var before = word.substr(0, this.currentWord.index)
// var letter = word.substr(this.currentWord.index, 1)
// var $before = this.options.element.find('._read_before').html(before).css('opacity', '0')
// var $letter = this.options.element.find('._read_letter').html(letter).css('opacity', '0')
// var calc = $before.textWidth() + Math.round($letter.textWidth() / 2)
// if (!word.match(/[\n\r\s]/)) {
//   this.displayElement.html(this.currentWord.val)
//   this.displayElement.css('margin-left', -calc)
// }

browser.runtime.onMessage.addListener(onMessage)
