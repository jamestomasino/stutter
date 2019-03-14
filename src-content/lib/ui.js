import '../style.scss'
import { EventEmitter } from 'events'
import StutterOptions from '../../src-common/stutterOptions'

var browser = require('webextension-polyfill')

export default class UI extends EventEmitter {
  constructor () {
    super()
    this.template = `
    <div class="__stutter_text">
      <span class="__stutter_pause"></span>
      <span class="__stutter_options">&#x2699;</span>
      <span class="__stutter_left"></span>
      <span class="__stutter_right">
        <span class="__stutter_center"></span><span class="__stutter_remainder"></span>
      </span>
      <span class="__stutter_close">&#x24e7;</span>
    </div>`
    this.holder = document.createElement('div')
    this.holder.classList.add('__stutter')
    this.holder.id = '__stutter'
    this.holder.innerHTML = this.template
    this.progress = 0

    // UI Elements
    this.text = this.holder.getElementsByClassName('__stutter_text')[0]
    this.left = this.holder.getElementsByClassName('__stutter_left')[0]
    this.center = this.holder.getElementsByClassName('__stutter_center')[0]
    this.remainder = this.holder.getElementsByClassName('__stutter_remainder')[0]
    this.close = this.holder.getElementsByClassName('__stutter_close')[0]
    this.options = this.holder.getElementsByClassName('__stutter_options')[0]

    // Interaction Events
    this.close.addEventListener('click', e => {
      e.stopPropagation()
      this.emit('close')
    })
    this.holder.addEventListener('click', () => {
      this.emit('pauseToggle')
    })
    this.options.addEventListener('click', e => {
      e.stopPropagation()
      this.emit('pause')
      browser.runtime.sendMessage({
        'functiontoInvoke': 'openSettings'
      })
    })

    // Handle dark mode vs light mode
    this.stutterOptions = new StutterOptions()
    this.stutterOptions.addListener(StutterOptions.UPDATE, () => {
      if (this.stutterOptions.light) {
        this.holder.classList.add('light')
      } else {
        this.holder.classList.remove('light')
      }
    })
  }

  static get INIT () {
    return (document.querySelector('.__stutter_text'))
  }

  set progress (val) {
    this.holder.dataset.progress = val
  }

  pause () {
    // display a pause overlay
    this.holder.classList.add('__stutter_paused')
  }

  resume () {
    // hide pause overlay
    this.holder.classList.remove('__stutter_paused')
  }

  show (word) {
    this.left.textContent = word.val.substr(0, word.index)
    this.center.textContent = word.val.substr(word.index, 1)
    this.remainder.textContent = word.val.substr(word.index + 1)
  }

  hide () {
    if (this.holder.parentNode) {
      this.holder.parentNode.removeChild(this.holder)
    }
  }

  reveal () {
    if (!this.holder.parentNode) {
      document.body.insertBefore(this.holder, document.body.childNodes[0])
    }
  }
}
