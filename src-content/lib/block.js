import Word from './word'
import { wordRegex, presuf, vccv, puncSplit } from './parts'

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

function breakLongWord (word) {
  // punctuation, prefix, center, suffix, punctuation
  let parts = presuf.exec(word)
  let ret = []
  if (parts[2]) {
    ret.push(parts[2])
  }
  if (parts[3]) {
    ret.push(parts[3].replace(vccv, '$1-$2'))
  }
  if (parts[4]) {
    ret.push(parts[4])
  }
  return (parts[1] || '') + ret.join('-') + (parts[5] || '')
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
          let brokenSubWord = breakLongWord(subWord)
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
