import { EventEmitter } from 'events'
var browser = require('webextension-polyfill')

let defaults = {
  'wpm': 400,
  'slowStartCount': 5,
  'sentenceDelay': 2.5,
  'otherPuncDelay': 1.5,
  'shortWordDelay': 1.3,
  'longWordDelay': 1.4,
  'numericDelay': 1.8,
  'light': false,
  'pos': 0.5
}

export default class StutterOptions extends EventEmitter {
  constructor () {
    super()

    this._wpm = defaults.wpm
    this._slowStartCount = defaults.slowStartCount
    this._sentenceDelay = defaults.sentenceDelay
    this._otherPuncDelay = defaults.otherPuncDelay
    this._shortWordDelay = defaults.shortWordDelay
    this._longWordDelay = defaults.longWordDelay
    this._numericDelay = defaults.numericDelay
    this._light = defaults.light
    this._pos = defaults.pos

    this.checkSaved()
    browser.runtime.onMessage.addListener(message => { this.onMessage(message) })
  }

  static get UPDATE () { return 'STUTTER_OPTIONS_UPDATE' }

  checkSaved () {
    browser.storage.local.get('stutterOptions').then(result => {
      if (result.stutterOptions) {
        this.settings = result.stutterOptions
      }
    })
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
        for (let tab of tabs) {
          browser.tabs.sendMessage(tab.id, {
            'functiontoInvoke': 'stutterOptionsUpdate'
          }).then(() => {}).catch(() => {})
        }
      }).catch(() => {})
    }
  }

  saveSettings () {
    browser.storage.local.set({
      stutterOptions: this.settings
    })
  }

  get settings () {
    return {
      wpm: this._wpm,
      slowStartCount: this._slowStartCount,
      sentenceDelay: this._sentenceDelay,
      otherPuncDelay: this._otherPuncDelay,
      shortWordDelay: this._shortWordDelay,
      longWordDelay: this._longWordDelay,
      numericDelay: this._numericDelay,
      pos: this._pos,
      light: this._light
    }
  }

  set settings (val) {
    let invalidate = false
    Object.keys(defaults).map(setting => {
      if (val.hasOwnProperty(setting) && this['_' + setting] !== val[setting]) {
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
        val = this.numericContain(1, 1500, val)
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
      case 'light':
        if (val !== true && val !== false) {
          return
        }
        break
      default:
        return
    }

    if (this['_' + prop] !== val) {
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
