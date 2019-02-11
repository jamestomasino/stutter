/* global browser */
import './main.scss'
import StutterOptions from './lib/stutterOptions'

var options = new StutterOptions()

function drawSettings () {
  document.getElementById('wpm').value = options.wpm
  document.getElementById('slowStartCount').value = options.slowStartCount
  document.getElementById('sentenceDelay').value = options.sentenceDelay
  document.getElementById('otherPuncDelay').value = options.otherPuncDelay
  document.getElementById('shortWordDelay').value = options.shortWordDelay
  document.getElementById('longWordDelay').value = options.longWordDelay
  document.getElementById('numericDelay').value = options.numericDelay
}

document.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get('stutterOptions').then(result => {
    if (result && result.stutterOptions) {
      options.settings = result.stutterOptions
    }
    drawSettings()
  },
  () => {
    drawSettings()
  })

  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    options.wpm = document.getElementById('wpm').value
    options.slowStartCount = document.getElementById('slowStartCount').value
    options.sentenceDelay = document.getElementById('sentenceDelay').value
    options.otherPuncDelay = document.getElementById('otherPuncDelay').value
    options.shortWordDelay = document.getElementById('shortWordDelay').value
    options.longWordDelay = document.getElementById('longWordDelay').value
    options.numericDelay = document.getElementById('numericDelay').value
    drawSettings()
    browser.storage.local.set({
      stutterOptions: options.settings
    })
  })
})
