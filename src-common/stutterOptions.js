import { EventEmitter } from 'events'
var browser = require('webextension-polyfill')

export default class StutterOptions extends EventEmitter {
  constructor () {
    super()

    // Default settings
    this._wpm = 400
    this._slowStartCount = 5
    this._sentenceDelay = 2.5
    this._otherPuncDelay = 1.5
    this._shortWordDelay = 1.3
    this._longWordDelay = 1.4
    this._numericDelay = 1.8
    this._light = false
    this._pos = 0.5

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
    browser.tabs.query({}).then(tabs => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(tab.id, {
          'functiontoInvoke': 'stutterOptionsUpdate'
        }).then(() => {}).catch(() => {})
      }
    }).catch(() => {})
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
    if (val['wpm'] && this._wpm !== val['wpm']) {
      this._wpm = val['wpm']
      invalidate = true
    }

    if (val['slowStartCount'] && this._slowStartCount !== val['slowStartCount']) {
      this._slowStartCount = val['slowStartCount']
      invalidate = true
    }

    if (val['sentenceDelay'] && this._sentenceDelay !== val['sentenceDelay']) {
      this._sentenceDelay = val['sentenceDelay']
      invalidate = true
    }

    if (val['otherPuncDelay'] && this._otherPuncDelay !== val['otherPuncDelay']) {
      this._otherPuncDelay = val['otherPuncDelay']
      invalidate = true
    }

    if (val['shortWordDelay'] && this._shortWordDelay !== val['shortWordDelay']) {
      this._shortWordDelay = val['shortWordDelay']
      invalidate = true
    }

    if (val['longWordDelay'] && this._longWordDelay !== val['longWordDelay']) {
      this._longWordDelay = val['longWordDelay']
      invalidate = true
    }

    if (val['numericDelay'] && this._numericDelay !== val['numericDelay']) {
      this._numericDelay = val['numericDelay']
      invalidate = true
    }

    if (val['pos'] && this._pos !== val['pos']) {
      this._pos = val['pos']
      invalidate = true
    }

    if ((val['light'] === false || val['light'] === true) && this._light !== val['light']) {
      this._light = val['light']
      invalidate = true
    }

    if (invalidate) this.update()
  }

  get wpm () { return this._wpm }
  set wpm (val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(1, val)
    val = Math.min(1500, val)
    if (this._wpm !== val) {
      this._wpm = val
      this.update()
    }
  }

  get sentenceDelay () { return this._sentenceDelay }
  set sentenceDelay (val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(1, val)
    val = Math.min(10, val)
    if (this._sentenceDelay !== val) {
      this._sentenceDelay = val
      this.update()
    }
  }

  get otherPuncDelay () { return this._otherPuncDelay }
  set otherPuncDelay (val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(1, val)
    val = Math.min(10, val)
    if (this._otherPuncDelay !== val) {
      this._otherPuncDelay = val
      this.update()
    }
  }

  get shortWordDelay () { return this._shortWordDelay }
  set shortWordDelay (val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(1, val)
    val = Math.min(10, val)
    if (this._shortWordDelay !== val) {
      this._shortWordDelay = val
      this.update()
    }
  }

  get longWordDelay () { return this._longWordDelay }
  set longWordDelay (val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(1, val)
    val = Math.min(10, val)
    if (this._longWordDelay !== val) {
      this._longWordDelay = val
      this.update()
    }
  }

  get numericDelay () { return this._numericDelay }
  set numericDelay (val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(1, val)
    val = Math.min(10, val)
    if (this._numericDelay !== val) {
      this._numericDelay = val
      this.update()
    }
  }

  get slowStartCount () { return this._slowStartCount }
  set slowStartCount (val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(0, val)
    val = Math.min(10, val)
    if (this._slowStartCount !== val) {
      this._slowStartCount = val
      this.update()
    }
  }

  get pos () { return this._pos }
  set pos (val) {
    val = Number(val)
    if (isNaN(val)) return
    val = Math.max(0.1, val)
    val = Math.min(0.9, val)
    if (this._pos !== val) {
      this._pos = val
      this.update()
    }
  }

  get light () { return this._light }
  set light (val) {
    if (val === true || val === false) {
      if (this._light !== val) {
        this._light = val
        this.update()
      }
    }
  }

  get delay () { return 1 / (this._wpm / 60) * 1000 }
}
