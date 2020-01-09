import Word from './word'
import { wordRegex, presuf, vccv, puncSplit, hyphens } from './parts'

function puncBreak (word) {
  let parts = puncSplit.exec(word)
  let ret = []
  if (parts) {
    ret.push(parts[1] + parts[2])
    ret = ret.concat(puncBreak(parts[3]))
  } else {
    ret = [word]
  }
  return ret.join(' ')
}

function breakLongWord (word, maxWordLength) {
  let ret = []
  let start = ''
  let end = ''
  let hyphenParts = word.split(hyphens)
  if (hyphenParts.length > 1) {
    // split on hyphens if they exist first
    ret = hyphenParts.map((part) => {
      if (part.length > maxWordLength) {
        return breakLongWord(part, maxWordLength)
      } else {
        return part
      }
    })
  } else {
    // punctuation, prefix, center, suffix, punctuation
    let parts = presuf.exec(word)
    if (parts[2]) {
      ret.push(parts[2])
    }
    if (parts[3]) {
      ret = ret.concat(parts[3].replace(vccv, '$1 $2').split(' '))
      // ret.push(parts[3].replace(vccv, '$1 $2'))
    }
    if (parts[4]) {
      ret.push(parts[4])
    }
    start = parts && parts[1] ? parts[1] + ' -' : ''
    end = parts && parts[5] ? ' -' + parts[5] : ''
  }
  // join all parts as ' -'
  let stitch = ret.map((p, i) => {
    return (i === 0 || p.match(/^[-—‒–—―]/)) ? p : '-' + p
  })
  return start + stitch.join(' ') + end
}

export default class Block {
  constructor (val, settings) {
    this.words = []
    this.index = 0

    // Build word chain
    let rawWords = val.match(wordRegex)
    rawWords.map(word => {
      // Extra splits on odd punctuation situations
      let brokenWord = puncBreak(word)
      let subWords = brokenWord.match(wordRegex)
      subWords.map(subWord => {
        // break long words
        let maxWordLength = (settings.getProp('maxWordLength') || 13)
        if (subWord.length > maxWordLength) {
          let brokenSubWord = breakLongWord(subWord, maxWordLength)
          let subSubWords = brokenSubWord.match(wordRegex)
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
