import { parseWordMetadata } from './tokenizer.mjs'

export default class Word {
  constructor(val, lang = 'en') {
    this.val = val
    this.lang = lang
    this.endsSentence = false
    this.hasOtherPunc = false
    this.isShort = false
    this.isLong = false
    this.isNumeric = false
    this.index = 0
    this.textFragment = ''
    this.length = 0

    this.parseWord()
    this.findIndex()
  }

  parseWord() {
    const meta = parseWordMetadata(this.val, this.lang)
    this.length = meta.length
    this.prefixLength = meta.prefixLength
    this.isNumeric = meta.isNumeric
    this.endsSentence = meta.endsSentence
    this.hasOtherPunc = meta.hasOtherPunc
  }

  findIndex() {
    switch (true) {
      case (this.length < 2):
        this.index = 0
        this.isShort = true
        break
      case (this.length < 5):
        this.index = 1
        this.isShort = true
        break
      case (this.length < 9):
        this.index = 2
        break
      case (this.length < 14):
        this.index = 3
        this.isLong = true
        break
      default:
        this.index = 4
        this.isLong = true
        break
    }

    // Adjust for prefix characters like “(¿ etc.
    if (this.prefixLength > 0) {
      this.index++
    }
  }
}
