/* global DOMParser */
import '../style.scss'
import { EventEmitter } from 'events'
import StutterOptions from '../../src-common/stutterOptions'
import { parseFragmentDirectives, processFragmentDirectives, removeMarks } from './text-fragment-utils'
var browser = require('webextension-polyfill')

var template = `
  <div class="__stutter_screen"></div>
  <div class="__stutter_text">
    <span class="__stutter_pausebtn"></span>
    <span class="__stutter_drag">&#x2195;</span>
    <span class="__stutter_pause"></span>
    <span class="__stutter_options">&#x2699;</span>
    <span class="__stutter_left"></span>
    <span class="__stutter_right">
      <span class="__stutter_center"></span><span class="__stutter_remainder"></span><span class="__stutter_flanker"></span>
    </span>
    <span class="__stutter_duration">
      <span class="__stutter_duration_time"></span><span class="__stutter_duration_wpm"></span>
    </span>
    <span class="__stutter_close">&#x24e7;</span>
  </div>`

function toHHMMSS (t) {
  t = Math.round(t / 1000)
  let hours = Math.floor(t / 3600)
  let minutes = Math.floor((t - (hours * 3600)) / 60)
  let seconds = t - (hours * 3600) - (minutes * 60)

  if (hours) {
    if (hours < 10) {
      hours = '0' + hours
    }
    hours += ':'
  } else {
    hours = ''
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  minutes += ':'
  if (seconds < 10) { seconds = '0' + seconds }
  return hours + minutes + seconds
}

export default class UI extends EventEmitter {
  constructor () {
    super()
    this.holder = document.createElement('div')
    this.holder.classList.add('__stutter')
    this.holder.id = '__stutter'
    // Avoids use of innerHTML
    var dom = new DOMParser().parseFromString('<template>' + template + '</template>', 'text/html').head
    this.holder.appendChild(dom.firstElementChild.content)
    this.progress = 0
    this.bindDOM()
    this.marks = null
    this.wakeLock = null
    this.currentTextFragment = ''
  }

  bindDOM () {
    // UI Elements
    this.text = this.holder.getElementsByClassName('__stutter_text')[0]
    this.left = this.holder.getElementsByClassName('__stutter_left')[0]
    this.center = this.holder.getElementsByClassName('__stutter_center')[0]
    this.remainder = this.holder.getElementsByClassName('__stutter_remainder')[0]
    this.flanker = this.holder.getElementsByClassName('__stutter_flanker')[0]
    this.durationTime = this.holder.getElementsByClassName('__stutter_duration_time')[0]
    this.durationWPM = this.holder.getElementsByClassName('__stutter_duration_wpm')[0]
    this.close = this.holder.getElementsByClassName('__stutter_close')[0]
    this.drag = this.holder.getElementsByClassName('__stutter_drag')[0]
    this.options = this.holder.getElementsByClassName('__stutter_options')[0]
    this.pausebtn = this.holder.getElementsByClassName('__stutter_pausebtn')[0]
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onPauseToggle = this.onPauseToggle.bind(this)
    this.onOptions = this.onOptions.bind(this)
    this.onOptionsUpdate = this.onOptionsUpdate.bind(this)
    this.onKeypress = this.onKeypress.bind(this)
    this.close.addEventListener('click', this.onClose)
    this.pausebtn.addEventListener('click', this.onPauseToggle)
    this.drag.addEventListener('mousedown', this.onDragStart)
    this.drag.addEventListener('ontouchstart', this.onDragStart)
    this.options.addEventListener('click', this.onOptions)
    this.stutterOptions = new StutterOptions()
    this.stutterOptions.addListener(StutterOptions.UPDATE, this.onOptionsUpdate)
    document.addEventListener('keydown', this.onKeypress, true)
  }

  onKeypress (e) {
    var keybindPause = this.stutterOptions.getProp('keybindPause')
    var keybindRestart = this.stutterOptions.getProp('keybindRestart')
    var keybindPrevious = this.stutterOptions.getProp('keybindPrevious')
    var keybindForward = this.stutterOptions.getProp('keybindForward')
    var keybindSpeedUp = this.stutterOptions.getProp('keybindSpeedUp')
    var keybindSpeedDown = this.stutterOptions.getProp('keybindSpeedDown')
    var keybindClose = this.stutterOptions.getProp('keybindClose')

    var anyModifier = ['Alt', 'Fn', 'Hyper', 'OS', 'Super', 'Control', 'Meta', 'Win'].some(s => e.getModifierState(s))

    if ((keybindPause.modifier ? e.getModifierState(keybindPause.modifier) : !anyModifier) && e.key === keybindPause.key) {
      this.onPauseToggle()
      e.preventDefault()
    } else if ((keybindRestart.modifier ? e.getModifierState(keybindRestart.modifier) : !anyModifier) && e.key === keybindRestart.key) {
      this.emit('restart')
      e.preventDefault()
    } else if ((keybindPrevious.modifier ? e.getModifierState(keybindPrevious.modifier) : !anyModifier) && e.key === keybindPrevious.key) {
      this.emit('skipPrevious')
      e.preventDefault()
    } else if ((keybindForward.modifier ? e.getModifierState(keybindForward.modifier) : !anyModifier) && e.key === keybindForward.key) {
      this.emit('skipForward')
      e.preventDefault()
    } else if ((keybindSpeedUp.modifier ? e.getModifierState(keybindSpeedUp.modifier) : !anyModifier) && e.key === keybindSpeedUp.key) {
      this.stutterOptions.setProp('wpm', this.stutterOptions.getProp('wpm') + 50)
      e.preventDefault()
    } else if ((keybindSpeedDown.modifier ? e.getModifierState(keybindSpeedDown.modifier) : !anyModifier) && e.key === keybindSpeedDown.key) {
      this.stutterOptions.setProp('wpm', this.stutterOptions.getProp('wpm') - 50)
      e.preventDefault()
    } else if ((keybindClose.modifier ? e.getModifierState(keybindClose.modifier) : !anyModifier) && e.key === keybindClose.key) {
      this.emit('close')
      e.preventDefault()
    }
  }

  static get INIT () {
    return (document.querySelector('.__stutter_text'))
  }

  get progress () {
    return this.holder.dataset.progress
  }

  set progress (val) {
    this.holder.dataset.progress = val
  }

  updateTime (d) {
    this.durationTime.textContent = toHHMMSS(d)
    this.durationWPM.textContent = '@' + this.stutterOptions.getProp('wpm') + 'wpm'
  }

  onDragStart (e) {
    e.preventDefault()
    e.stopPropagation()
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onDragEnd)
    document.addEventListener('touchmove', this.onTouchMove)
    document.addEventListener('touchend', this.onDragEnd)
  }

  onDragEnd () {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onDragEnd)
    document.removeEventListener('touchmove', this.onTouchMove)
    document.removeEventListener('touchend', this.onDragEnd)
  }

  onTouchMove (e) {
    e.preventDefault()
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    this.pos = e.touches[0].clientY / viewportHeight
  }

  onMouseMove (e) {
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    this.pos = e.clientY / viewportHeight
  }

  onClose (e) {
    e.stopPropagation()
    this.emit('close')
  }

  onPauseToggle () {
    this.emit('pauseToggle')
  }

  onOptions (e) {
    e.stopPropagation()
    this.emit('pause')
    browser.runtime.sendMessage({
      'functiontoInvoke': 'openSettings'
    })
  }

  onOptionsUpdate () {
    if (this.stutterOptions.getProp('pos')) {
      this.holder.style.top = (this.stutterOptions.getProp('pos') * 100) + 'vh'
    }

    let theme = this.stutterOptions.getProp('theme')
    Array.from(this.holder.classList).map(themeClass => {
      if (/^theme-/.test(themeClass)) {
        if (theme !== 'theme-' + theme) {
          this.holder.classList.remove(themeClass)
        }
      }
    })
    this.holder.classList.add('theme-' + theme)
  }

  pause () {
    this.holder.classList.add('__stutter_paused')
  }

  resume () {
    this.holder.classList.remove('__stutter_paused')
  }

  show (word, nextword = null) {
    this.left.textContent = word.val.substr(0, word.index)
    this.center.textContent = word.val.substr(word.index, 1)
    this.remainder.textContent = word.val.substr(word.index + 1)

    let tf = word.textFragment
    if (this.currentTextFragment !== tf) {
      this.currentTextFragment = tf
      if (this.marks) {
        removeMarks(this.marks)
        this.marks = null
      }
      if (tf.length > 6 && /\w/.test(tf)) {
        let p = parseFragmentDirectives({ text: [encodeURI(tf)] })
        let r = processFragmentDirectives(p)
        if (r.text.length) {
          this.marks = r.text[0]
        }
      }
    }

    if (this.stutterOptions.getProp('showFlankers') && nextword) {
      this.flanker.textContent = ' ' + nextword.val
    } else {
      this.flanker.textContent = ''
    }
  }

  hide () {
    if (this.holder.parentNode) {
      this.holder.parentNode.removeChild(this.holder)
      if (this.marks) {
        removeMarks(this.marks)
        this.marks = null
      }
      if (this.wakeLock) {
        wakeLock.release().then(() => { wakeLock = null })
      }
    }
  }

  async reveal () {
    if (!this.holder.parentNode) {
      document.body.insertBefore(this.holder, document.body.childNodes[0])
      this.marks = null

      // prevent screen timeout when stutter runs if supported
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen')
        } catch (_) {}
      }
    }
  }

  get pos () {
    let stutterTop = this.holder.getBoundingClientRect().top
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    return stutterTop / viewportHeight
  }

  set pos (val) {
    this.stutterOptions.setProp('pos', val)
  }
}
