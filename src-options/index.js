import './main.scss'
import StutterOptions from '../src-common/stutterOptions'

(function () {
  var options = new StutterOptions()
  options.addListener(StutterOptions.UPDATE, () => { drawSettings() })

  function drawSettings () {
    console.log('drawSettings')
    document.getElementById('wpm').value = options.wpm
    document.getElementById('slowStartCount').value = options.slowStartCount
    document.getElementById('sentenceDelay').value = options.sentenceDelay
    document.getElementById('otherPuncDelay').value = options.otherPuncDelay
    document.getElementById('shortWordDelay').value = options.shortWordDelay
    document.getElementById('longWordDelay').value = options.longWordDelay
    document.getElementById('numericDelay').value = options.numericDelay
  }

  document.addEventListener('DOMContentLoaded', () => {
    drawSettings()

    document.querySelector('form').addEventListener('submit', e => {
      e.preventDefault()
      options.wpm = document.getElementById('wpm').value
      options.slowStartCount = document.getElementById('slowStartCount').value
      options.sentenceDelay = document.getElementById('sentenceDelay').value
      options.otherPuncDelay = document.getElementById('otherPuncDelay').value
      options.shortWordDelay = document.getElementById('shortWordDelay').value
      options.longWordDelay = document.getElementById('longWordDelay').value
      options.numericDelay = document.getElementById('numericDelay').value
    })
  })
})()
