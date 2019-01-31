const Word = require('./word')
const { wordRegex, presuf, vccv, puncSplit } = require('./parts')

module.exports = class Block {
  constructor (val) {
    this.val = val

    this.words = []
    this.index = 0

    // Build word chain
    var rawWords = this.val.match(wordRegex)

    // Extra splits on odd punctuation situations
    rawWords.map(word => {
      let brokenWord = this.puncBreak(word)
      let subWords = brokenWord.match(wordRegex)
      subWords.map(subWord => {
        if (subWord.length > 13) {
          let brokenSubWord = this.break(subWord)
          let subSubWords = brokenSubWord.match(wordRegex)
          subSubWords.map(subSubWord => {
            this.words.unshift(new Word(subSubWord))
          })
        } else {
          this.words.unshift(new Word(subWord))
        }
      })
    })
  }

  puncBreak (word) {
    var parts = puncSplit.exec(word)
    var ret = []
    if (parts) {
      ret.push(parts[1] + parts[2])
      ret = ret.concat(this.puncBreak(parts[3]))
    } else {
      ret = [word]
    }
    return ret.join(' ')
  }

  break (word) {
    // punctuation, prefix, center, suffix, punctuation
    var parts = presuf.exec(word)
    var ret = []
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

  getWord () {
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

  getProgress () {
    return this.index / this.words.length
  }
}
