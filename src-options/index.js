import './main.scss'
import StutterOptions from '../src-common/stutterOptions'
var options = new StutterOptions()
options.addListener(StutterOptions.UPDATE, () => { drawSettings() })
var resetbtn = document.getElementById('reset')
resetbtn.addEventListener('click', () => {
  options.reset()
})

function drawSettings () {
  document.getElementById('wpm').value = options.getProp('wpm')
  document.getElementById('slowStartCount').value = options.getProp('slowStartCount')
  document.getElementById('sentenceDelay').value = options.getProp('sentenceDelay')
  document.getElementById('otherPuncDelay').value = options.getProp('otherPuncDelay')
  document.getElementById('shortWordDelay').value = options.getProp('shortWordDelay')
  document.getElementById('longWordDelay').value = options.getProp('longWordDelay')
  document.getElementById('numericDelay').value = options.getProp('numericDelay')
  document.getElementById('lightMode').checked = options.getProp('light')
}

document.addEventListener('DOMContentLoaded', () => {
  drawSettings()

  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    options.setProp('wpm', document.getElementById('wpm').value)
    options.setProp('slowStartCount', document.getElementById('slowStartCount').value)
    options.setProp('sentenceDelay', document.getElementById('sentenceDelay').value)
    options.setProp('otherPuncDelay', document.getElementById('otherPuncDelay').value)
    options.setProp('shortWordDelay', document.getElementById('shortWordDelay').value)
    options.setProp('longWordDelay', document.getElementById('longWordDelay').value)
    options.setProp('numericDelay', document.getElementById('numericDelay').value)
    options.setProp('light', document.getElementById('lightMode').checked)
  })
})
