import Word from './word'
import Parts from './parts'

export default class Block {
  constructor (val, settings, locale) {
    this.locale = locale
    this.parts = new Parts(locale)
    this.words = []
    this.index = 0
    this.settings = settings

    // Build word chain
    let rawWords = val.match(this.parts.wordRegex)
    rawWords.map(word => {
      // Extra splits on odd punctuation situations
      let brokenWord = this.parts.puncBreak(word)
      let subWords = brokenWord.match(this.parts.wordRegex)
      subWords.map(subWord => {
        // break long words
        let maxWordLength = (settings.getProp('maxWordLength') || 13)
        if (subWord.length > maxWordLength) {
          let brokenSubWord = this.parts.breakLongWord(subWord, maxWordLength)
          let subSubWords = brokenSubWord.match(this.parts.wordRegex)
          subSubWords.map(subSubWord => {
            this.words.push(new Word(subSubWord))
          })
        } else {
          this.words.push(new Word(subWord))
        }
      })
    })
  }

  get word () {
    if (this.words.length && this.index < this.words.length) {
      return this.words[this.index]
    } else {
      return null
    }
  }

  get time () {
    return this.getTime(this.words[this.index])
  }

  get duration () {
    return this.words.reduce((acc, cur) => {
      return acc + this.getTime(cur)
    }, 0)
  }

  getTime (word) {
    var time = this.settings.delay
    if (word.hasPeriod) time *= this.settings.getProp('sentenceDelay')
    if (word.hasOtherPunc) time *= this.settings.getProp('otherPuncDelay')
    if (word.isShort) time *= this.settings.getProp('shortWordDelay')
    if (word.isLong) time *= this.settings.getProp('longWordDelay')
    if (word.isNumeric) time *= this.settings.getProp('numericDelay')
    return time
  }

  next () {
    this.index = Math.min(this.index + 1, this.words.length)
  }

  prev () {
    this.index = Math.max(this.index - 1, 0)
  }

  restart () {
    this.index = 0
  }

  get progress () {
    return this.index / this.words.length
  }
}
