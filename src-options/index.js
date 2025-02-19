import './main.scss'
import StutterOptions from '../src-common/stutterOptions'
const options = new StutterOptions()
options.addListener(StutterOptions.UPDATE, () => { drawSettings() })
const resetbtn = document.getElementById('reset')
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
  document.getElementById('maxWordLength').value = options.getProp('maxWordLength')
  document.getElementById('skipCount').value = options.getProp('skipCount')
  document.getElementById('theme').value = options.getProp('theme')
  document.getElementById('showFlankers').checked = options.getProp('showFlankers')
  document.getElementById('keybindPauseModifier').value = options.getProp('keybindPauseModifier') ? options.getProp('keybindPauseModifier') : ''
  document.getElementById('keybindRestartModifier').value = options.getProp('keybindRestartModifier') ? options.getProp('keybindRestartModifier') : ''
  document.getElementById('keybindPreviousModifier').value = options.getProp('keybindPreviousModifier') ? options.getProp('keybindPreviousModifier') : ''
  document.getElementById('keybindForwardModifier').value = options.getProp('keybindForwardModifier') ? options.getProp('keybindForwardModifier') : ''
  document.getElementById('keybindSpeedUpModifier').value = options.getProp('keybindSpeedUpModifier') ? options.getProp('keybindSpeedUpModifier') : ''
  document.getElementById('keybindSpeedDownModifier').value = options.getProp('keybindSpeedDownModifier') ? options.getProp('keybindSpeedDownModifier') : ''
  document.getElementById('keybindCloseModifier').value = options.getProp('keybindCloseModifier') ? options.getProp('keybindCloseModifier') : ''
  document.getElementById('keybindPauseKey').value = options.getProp('keybindPauseKey')
  document.getElementById('keybindRestartKey').value = options.getProp('keybindRestartKey')
  document.getElementById('keybindPreviousKey').value = options.getProp('keybindPreviousKey')
  document.getElementById('keybindForwardKey').value = options.getProp('keybindForwardKey')
  document.getElementById('keybindSpeedUpKey').value = options.getProp('keybindSpeedUpKey')
  document.getElementById('keybindSpeedDownKey').value = options.getProp('keybindSpeedDownKey')
  document.getElementById('keybindCloseKey').value = options.getProp('keybindCloseKey')
}

document.addEventListener('DOMContentLoaded', () => {
  drawSettings()
  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    clearListeners()
    const settings = {}
    settings.wpm = parseInt(document.getElementById('wpm').value, 10)
    settings.slowStartCount = parseFloat(document.getElementById('slowStartCount').value)
    settings.sentenceDelay = parseFloat(document.getElementById('sentenceDelay').value)
    settings.otherPuncDelay = parseFloat(document.getElementById('otherPuncDelay').value)
    settings.shortWordDelay = parseFloat(document.getElementById('shortWordDelay').value)
    settings.longWordDelay = parseFloat(document.getElementById('longWordDelay').value)
    settings.numericDelay = parseFloat(document.getElementById('numericDelay').value)
    settings.maxWordLength = parseInt(document.getElementById('maxWordLength').value, 10)
    settings.skipCount = parseInt(document.getElementById('skipCount').value, 10)
    settings.theme = document.getElementById('theme').value
    settings.showFlankers = document.getElementById('showFlankers').checked
    settings.keybindPauseModifier = document.getElementById('keybindPauseModifier').value
    settings.keybindRestartModifier = document.getElementById('keybindRestartModifier').value
    settings.keybindPreviousModifier = document.getElementById('keybindPreviousModifier').value
    settings.keybindForwardModifier = document.getElementById('keybindForwardModifier').value
    settings.keybindSpeedUpModifier = document.getElementById('keybindSpeedUpModifier').value
    settings.keybindSpeedDownModifier = document.getElementById('keybindSpeedDownModifier').value
    settings.keybindCloseModifier = document.getElementById('keybindCloseModifier').value
    settings.keybindPauseKey = document.getElementById('keybindPauseKey').value
    settings.keybindRestartKey = document.getElementById('keybindRestartKey').value
    settings.keybindPreviousKey = document.getElementById('keybindPreviousKey').value
    settings.keybindForwardKey = document.getElementById('keybindForwardKey').value
    settings.keybindSpeedUpKey = document.getElementById('keybindSpeedUpKey').value
    settings.keybindSpeedDownKey = document.getElementById('keybindSpeedDownKey').value
    settings.keybindCloseKey = document.getElementById('keybindCloseKey').value
    options.settings = settings
  })
  document.getElementById('keybindPause').addEventListener('click', updateKey)
  document.getElementById('keybindRestart').addEventListener('click', updateKey)
  document.getElementById('keybindPrevious').addEventListener('click', updateKey)
  document.getElementById('keybindForward').addEventListener('click', updateKey)
  document.getElementById('keybindSpeedUp').addEventListener('click', updateKey)
  document.getElementById('keybindSpeedDown').addEventListener('click', updateKey)
  document.getElementById('keybindClose').addEventListener('click', updateKey)
})

function updateKey (e) {
  const label = e.target
  const mod = label.querySelector('.modifier')
  const key = label.querySelector('.key')
  if (label.classList.contains('update')) {
    clearListeners()
    return
  }
  clearListeners()
  label.classList.add('update')
  mod.dataset.value = mod.value
  key.dataset.value = key.value
  mod.value = ''
  key.value = ''
  document.addEventListener('keydown', listenForKey, true)
}

function clearListeners () {
  document.querySelectorAll('.update').forEach(el => {
    const mod = el.querySelector('.modifier')
    const key = el.querySelector('.key')
    if (mod.value === '' && mod.dataset.value !== '') {
      mod.value = mod.dataset.value
      mod.dataset.value = ''
    }
    if (key.value === '' && key.dataset.value !== '') {
      key.value = key.dataset.value
      key.dataset.value = ''
    }
    el.classList.remove('update')
  })
  document.removeEventListener('keydown', listenForKey, true)
}

function listenForKey (keyboardEvent) {
  keyboardEvent.stopPropagation()
  const key = keyboardEvent.key || ''
  if (['Alt', 'OS', 'Control', 'Meta', 'Shift'].some(s => key === s)) return
  let modifier = ''
  switch (true) {
    case keyboardEvent.getModifierState('OS'):
      modifier = 'OS'
      break
    case keyboardEvent.getModifierState('Alt'):
      modifier = 'Alt'
      break
    case keyboardEvent.getModifierState('Control'):
      modifier = 'Control'
      break
    case keyboardEvent.getModifierState('Meta'):
      modifier = 'Meta'
      break
  }
  if (key) {
    const label = document.querySelector('.update')
    const modEl = label.querySelector('.modifier')
    const keyEl = label.querySelector('.key')
    modEl.value = modifier
    modEl.dataset.value = ''
    keyEl.value = key
    keyEl.dataset.value = ''
    clearListeners()
  }
}
