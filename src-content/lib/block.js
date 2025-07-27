import Word from './word'
import StutterOptions from '../../src-common/stutterOptions'
const options = new StutterOptions()

function isWhiteSpace(str) {
  return /\p{White_Space}/u.test(str)
}

function isTrivialPunctuation(str) {
  return /^[\p{P}\p{S}。、・：；？！「」（）【】『』［］〔〕〈〉《》]+$/u.test(str)
}

// Primary tokenizer for non-whitespace-delimited languages (ja, zh, etc.)
function tokenizeNonSpaceLang(segments, lang) {
  const result = []
  let i = 0

  while (i < segments.length) {
    if (isWhiteSpace(segments[i].segment)) {
      i++
      continue
    }

    let prefix = ''
    let core = ''
    let suffix = ''

    // Leading punctuation
    while (
      i < segments.length &&
      isTrivialPunctuation(segments[i].segment)
    ) {
      const next = segments[i + 1]
      if (next && !isWhiteSpace(next.segment) && !isTrivialPunctuation(next.segment)) {
        prefix += segments[i].segment
        i++
      } else {
        break
      }
    }

    // Core content
    if (
      i < segments.length &&
      !isWhiteSpace(segments[i].segment) &&
      !isTrivialPunctuation(segments[i].segment)
    ) {
      core = segments[i].segment
      i++
    }

    // Trailing punctuation
    while (
      i < segments.length &&
      isTrivialPunctuation(segments[i].segment)
    ) {
      suffix += segments[i].segment
      i++
    }

    const token = (prefix + core + suffix).trim()
    if (token) {
      result.push(token)
    }
  }

  return result
}

function bundleWords(val, lang = 'en') {
  const segmenter = new Intl.Segmenter(lang, { granularity: 'word' })
  const segments = Array.from(segmenter.segment(val))

  const noSpaceLanguages = new Set(['ja', 'zh', 'th', 'lo', 'km', 'my'])
  const isSpaceDelimited = !noSpaceLanguages.has(lang.split('-')[0])

  const maxLen = options.getProp('maxWordLength') ?? Infinity
  const isWS = s => /\p{White_Space}/u.test(s)
  const isHyphen = s => /[-\u2010\u2011\u2012\u2013\u2212]/u.test(s) // -, ‐, ‑, ‒, –, −

  const result = []
  let i = 0

  while (i < segments.length) {
    const cur = segments[i]
    if (isWS(cur.segment)) { i++; continue }

    // Non whitespace delimited languages: unchanged strategy
    if (!isSpaceDelimited) {
      return tokenizeNonSpaceLang(segments, lang)
    }

    // Whitespace delimited branch with hyphen length guard
    let token = ''
    let wordCharCount = 0

    const flush = () => {
      if (token) result.push(token)
      token = ''
      wordCharCount = 0
    }

    while (i < segments.length && !isWS(segments[i].segment)) {
      const seg = segments[i]
      const next = segments[i + 1]

      // If this is a hyphen that would bridge to a next word-like piece
      // check if joining would exceed maxLen
      if (
        isHyphen(seg.segment) &&
        next &&
        next.isWordLike
      ) {
        const prospectiveLen = wordCharCount + next.segment.length
        if (prospectiveLen > maxLen) {
          // keep the hyphen with the first part, then flush
          token += seg.segment
          flush()
          i++ // consume the hyphen
          continue // next loop iteration will start a new token with the next word
        }
      }

      token += seg.segment
      if (seg.isWordLike) wordCharCount += seg.segment.length
      i++
    }

    flush()
  }

  return result
}

export default class Block {
  constructor (val, settings) {
    this.words = []
    this.index = 0
    this.settings = settings

    const bundledWords = bundleWords(val, document.documentElement.lang)
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
