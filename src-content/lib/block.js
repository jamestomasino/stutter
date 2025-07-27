import Word from './word'

function bundleWords(val, lang = 'en') {
  const segmenter = new Intl.Segmenter(lang, { granularity: 'word' })
  const segments = Array.from(segmenter.segment(val))
  const noSpaceLanguages = new Set(['ja', 'zh', 'th', 'lo', 'km', 'my'])
  const isSpaceDelimited = !noSpaceLanguages.has(lang.split('-')[0])
  const result = []

  let i = 0

  while (i < segments.length) {
    const current = segments[i]

    if (/\p{White_Space}/u.test(current.segment)) {
      i++
      continue
    }

    if (!isSpaceDelimited) {
      // For CJK/Thai/etc.
      if (current.isWordLike) {
        let token = current.segment
        while (
          segments[i + 1] &&
          !segments[i + 1].isWordLike &&
          !/\p{White_Space}/u.test(segments[i + 1].segment)
        ) {
          token += segments[++i].segment
        }
        result.push(token)
      } else {
        result.push(current.segment)
      }
      i++
      continue
    }

    // For space-delimited languages
    let token = ''
    let hasWord = false

    while (
      i < segments.length &&
      !/\p{White_Space}/u.test(segments[i].segment)
    ) {
      token += segments[i].segment
      if (segments[i].isWordLike) hasWord = true
      i++
    }

    if (token && hasWord) {
      result.push(token)
    } else if (token) {
      result.push(token)
    }
  }

  return result
}

export default class Block {
  constructor (val, settings) {
    this.words = []
    this.index = 0
    this.settings = settings

    const bundledWords = bundleWords(val, document.documentElement.lang)
    console.log(bundledWords)
    bundledWords.forEach(word => {
      this.words.push(new Word(word, document.documentElement.lang))
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

  get progress () {
    return this.index / this.words.length
  }
}
