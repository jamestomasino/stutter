import Word from './word'
import { hyphenateWord } from './hyphen.js'
import StutterOptions from '../../src-common/stutterOptions'
import { buildWordEntries } from './tokenPipeline.mjs'
import { getSafeLocale } from './tokenizer.mjs'
import { clampIndex, indexToProgress, progressToIndex } from './playbackProgress.mjs'
const options = new StutterOptions()

export default class Block {
  constructor (val, settings) {
    this.words = []
    this.index = 0
    this.settings = settings
    const lang = getSafeLocale(document.documentElement.lang)

    const wordEntries = buildWordEntries(
      val,
      lang,
      options.getProp('maxWordLength') ?? Infinity,
      hyphenateWord
    )
    wordEntries.forEach(entry => {
      this.words.push(new Word(entry.text, lang, entry.isParagraphEnd))
    })
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
    if (word.endsSentence) time *= this.settings.getProp('sentenceDelay')
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

  seekToIndex (index) {
    if (!this.words.length) {
      this.index = 0
      return this.index
    }
    this.index = clampIndex(index, this.words.length)
    return this.index
  }

  seekToProgress (progress) {
    if (!this.words.length) {
      this.index = 0
      return this.index
    }
    this.index = progressToIndex(progress, this.words.length)
    return this.index
  }

  get progress () {
    return indexToProgress(this.index, this.words.length)
  }
}
