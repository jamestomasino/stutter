export default class StutterOptions {
  constructor () {
    this._wpm = 700
    this._slowStartCount = 5
    this._sentenceDelay = 2.5
    this._otherPuncDelay = 1.5
    this._shortWordDelay = 1.3
    this._longWordDelay = 1.4
    this._delay = 1 / (this._wpm / 60) * 1000
  }

  get delay () {
    return this._delay
  }

  set wpm (val) {
    val = Number(val)
    val = Math.max(1, val)
    val = Math.min(1500, val)
    this._wpm = val
    this._delay = 1 / (val / 60) * 1000
  }

  get wpm () {
    return this._wpm
  }

  set sentenceDelay (val) {
    val = Number(val)
    val = Math.max(1, val)
    val = Math.min(10, val)
    this._sentenceDelay = val
  }

  get sentenceDelay () {
    return this._sentenceDelay
  }

  set otherPuncDelay (val) {
    val = Number(val)
    val = Math.max(1, val)
    val = Math.min(10, val)
    this._otherPuncDelay = val
  }

  get otherPuncDelay () {
    return this._otherPuncDelay
  }

  set shortWordDelay (val) {
    val = Number(val)
    val = Math.max(1, val)
    val = Math.min(10, val)
    this._shortWordDelay = val
  }

  get shortWordDelay () {
    return this._shortWordDelay
  }

  set longWordDelay (val) {
    val = Number(val)
    val = Math.max(1, val)
    val = Math.min(10, val)
    this._longWordDelay = val
  }

  get longWordDelay () {
    return this._longWordDelay
  }

  set numericDelay (val) {
    val = Number(val)
    val = Math.max(1, val)
    val = Math.min(10, val)
    this._numericDelay = val
  }

  get numericDelay () {
    return this._numericDelay
  }

  set slowStartCount (val) {
    val = Number(val)
    val = Math.max(0, val)
    val = Math.min(10, val)
    this._slowStartCount = val
  }

  get slowStartCount () {
    return this._slowStartCount
  }
}
