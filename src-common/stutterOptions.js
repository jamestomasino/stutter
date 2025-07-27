import { EventEmitter } from 'events'
const browser = require('webextension-polyfill')

const defaults = {
  wpm: 400,
  slowStartCount: 5,
  sentenceDelay: 2.5,
  otherPuncDelay: 1.5,
  shortWordDelay: 1.3,
  longWordDelay: 1.4,
  numericDelay: 1.8,
  theme: 'default',
  pos: 0.5,
  maxWordLength: 13,
  skipCount: 10,
  bgBlur: false,
  showFlankers: false,
  keybindPauseModifier: 'Alt',
  keybindPauseKey: 'p',
  keybindRestartModifier: 'Alt',
  keybindRestartKey: 'r',
  keybindPreviousModifier: 'Alt',
  keybindPreviousKey: 'ArrowLeft',
  keybindForwardModifier: 'Alt',
  keybindForwardKey: 'ArrowRight',
  keybindSpeedUpModifier: 'Alt',
  keybindSpeedUpKey: 'ArrowUp',
  keybindSpeedDownModifier: 'Alt',
  keybindSpeedDownKey: 'ArrowDown',
  keybindCloseModifier: '',
  keybindCloseKey: 'Escape'
}

let instance = null

export default class StutterOptions extends EventEmitter {
  constructor () {
    super()

    if (instance) {
      return instance
    } else {
      instance = this

      Object.keys(defaults).forEach(setting => {
        this['_' + setting] = defaults[setting]
      })

      this.checkSaved()
      browser.runtime.onMessage.addListener(message => { this.onMessage(message) })
    }
  }

  static get UPDATE () { return 'STUTTER_OPTIONS_UPDATE' }
  static get CHECK_SAVED () { return 'STUTTER_OPTIONS_CHECKSAVED' }

  checkSaved () {
    browser.storage.sync.get('stutterOptions').then(result => {
      if (result.stutterOptions) {
        this.settings = result.stutterOptions
      } else {
        // Porting to sync. If the old local is set, copy it over
        // to sync, then remove
        browser.storage.local.get('stutterOptions').then(result => {
          if (result.stutterOptions) {
            this.settings = result.stutterOptions
            browser.storage.local.clear()
          }
        })
      }
    })
    this.emit(StutterOptions.CHECK_SAVED)
  }

  onMessage (request) {
    switch (request.functiontoInvoke) {
      case 'stutterOptionsUpdate':
        this.checkSaved()
        break
      default:
        break
    }
  }

  update () {
    // Save settings to localstorage
    this.saveSettings()

    // Inform direct listeners
    this.emit(StutterOptions.UPDATE)

    // Inform the other tabs StutterOptions instances
    if (browser && browser.tabs && browser.tabs.query) {
      browser.tabs.query({}).then(tabs => {
        for (const tab of tabs) {
          browser.tabs.sendMessage(tab.id, {
            functiontoInvoke: 'stutterOptionsUpdate'
          }).then(() => {}).catch(() => {})
        }
      }).catch(() => {})
    }
  }

  reset () {
    this.settings = defaults
  }

  saveSettings () {
    browser.storage.sync.set({
      stutterOptions: this.settings
    })
  }

  get settings () {
    const returnObj = {}
    Object.keys(defaults).forEach(setting => {
      returnObj[setting] = this['_' + setting]
    })
    return returnObj
  }

  set settings (val) {
    let invalidate = false
    Object.keys(defaults).forEach(setting => {
      if (val && Object.prototype.hasOwnProperty.call(val, setting) && this['_' + setting] !== val[setting]) {
        this['_' + setting] = val[setting]
        invalidate = true
      }
    })
    if (invalidate) this.update()
  }

  getProp (prop) {
    return this['_' + prop]
  }

  setProp (prop, val) {
    switch (prop) {
      case 'wpm':
        val = this.numericContain(100, 1800, val)
        break
      case 'sentenceDelay':
      case 'otherPuncDelay':
      case 'shortWordDelay':
      case 'numericDelay':
      case 'slowStartCount':
        val = this.numericContain(1, 10, val)
        break
      case 'pos':
        val = this.numericContain(0.02, 0.9, val)
        break
      case 'maxWordLength':
        val = parseInt(this.numericContain(5, 50, val), 10)
        break
      case 'skipCount':
        val = parseInt(this.numericContain(0, 100, val), 10)
        break
      case 'bgBlur':
        val = !!val
        break
      case 'showFlankers':
        val = !!val
        break
    }
    if (Object.prototype.hasOwnProperty.call(this, '_' + prop) && this['_' + prop] !== val) {
      this['_' + prop] = val
      this.update()
    }
  }

  numericContain (low, high, val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(low, val)
    val = Math.min(high, val)
    return val
  }

  get delay () { return 1 / (this._wpm / 60) * 1000 }
}
