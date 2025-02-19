import Word from './word'
import Parts from './parts'
import Locale from './locales.js'
const locale = new Locale()

export default class Block {
  constructor (val, settings) {
    this.parts = new Parts()
    this.words = []
    this.index = 0
    this.settings = settings

    // textContent collapses some sentences which were separated by DOM
    // elements alone. We attempt to restore spaces between paragraphs.

    // punctution sandwiched between two words
    val = val.replace(/([.?!,:;])(?=[a-z][a-z])/ig, '$1 ')

    // two quotes in a row
    val = val.replace(/([”"])(?=["“])/ig, '$1 ')

    // punctuation close-quote word
    val = val.replace(/([.?!,:;])(["”])(?=\w)/ig, '$1$2 ')

    // punctuation open-quote word
    val = val.replace(/([.?!,:;])“(?=\w)/ig, '$1 “')

    // Build word chain
    const rawWords = val.match(locale.wordRegex)

    // temporary variables for building up text fragment phrases
    let phrase = ''
    const wordQueue = []
    let purgeQueue = false

    rawWords.forEach(word => {
      // retroactively apply phrase to words in queue
      if (purgeQueue) {
        this.setTextFragmentToWords(wordQueue, phrase.trim())
        purgeQueue = false
        phrase = ''
      }

      // Extra splits on odd punctuation situations
      const brokenWord = this.parts.puncBreak(word)

      // Calculate phrase or sentence fragment
      if (brokenWord !== '\n') {
        phrase += (phrase) ? ' ' + brokenWord : '' + brokenWord
      }

      const subWords = brokenWord.match(locale.wordRegex)
      subWords.forEach(subWord => {
        // break long words
        const maxWordLength = (settings.getProp('maxWordLength') || 13)
        let w
        if (subWord.length > maxWordLength) {
          const brokenSubWord = this.parts.breakLongWord(subWord, maxWordLength)
          const subSubWords = brokenSubWord.match(locale.wordRegex)
          if (subSubWords) {
            subSubWords.forEach(subSubWord => {
              w = new Word(subSubWord)
              this.words.push(w)
              wordQueue.push(w)
            })
          } else {
            w = ''
          }
        } else {
          w = new Word(subWord)
          this.words.push(w)
          wordQueue.push(w)
        }

        // If this word contains punctuation, set the phrase to end
        if (w && (w.hasPeriod || w.hasOtherPunc)) {
          purgeQueue = true
        }
      })
    })

    // Handle text fragments in the final phrase
    this.setTextFragmentToWords(wordQueue, phrase)
  }

  setTextFragmentToWords (wordQueue, fragment) {
    while (wordQueue.length) {
      const retroWord = wordQueue.pop()
      retroWord.textFragment = fragment
    }
  }

  get word () {
    if (this.words.length && this.index < this.words.length) {
      return this.words[this.index]
    } else {
      return null
    }
  }

  get nextWord () {
    if (this.words.length && this.index + 1 < this.words.length) {
      return this.words[this.index + 1]
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
    let time = this.settings.delay
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
