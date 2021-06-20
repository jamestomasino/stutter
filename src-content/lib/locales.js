const locales = require('./locales.json')
let instance = null

export default class Locale {
  constructor (locale = null) {
    if (instance) {
      if (locale) {
        instance.locale = locale
      }
      return instance
    } else {
      instance = this

      // reference to publically available regex properties
      this.textRegex = null
      this.numRegex = null
      this.puncRegex = null
      this.wordRegex = null
      this.presufRegex = null
      this.puncSplitRegex = null

      if (locale) {
        this.locale = locale
      } else {
        this.locale = 'en'
      }
    }
  }

  get locale () {
    return this._locale
  }
  set locale (val) {
    if (val && typeof val === 'string') {
      let l = val.toLowerCase()
      let s = l.substr(0, 2)
      if (locales.hasOwnProperty(l)) {
        this._locale = l
      } else if (locales.hasOwnProperty(s)) {
        this._locale = s
      }
      this.initRegex()
    }
  }

  getProp (prop) {
    return locales[this.locale][prop]
  }

  initRegex () {
    this.textRegex = new RegExp(this.getProp('text'), 'g')
    this.numRegex = new RegExp(this.getProp('num'), 'g')
    this.puncRegex = new RegExp(this.getProp('punc'), 'g')
    this.wordRegex = new RegExp(this.getProp('word'), 'g')
    this.presufRegex = new RegExp(this.getProp('presuf'), 'i')
    this.puncSplitRegex = new RegExp(this.getProp('puncSplit'), 'i')
  }
}
