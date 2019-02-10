import Block from './block'

export default class Stutter {
  constructor (options) {
    this.block = null
    this.currentWord = null
    this.isEnded = false
    this.isPlaying = false
    this.options = {
      wpm: 700,
      slowStartCount: 5,
      sentenceDelay: 2.5,
      otherPuncDelay: 1.5,
      shortWordDelay: 1.3,
      longWordDelay: 1.4
    }
    this.options = Object.assign(this.options, options)
    console.log(this.options)
    this.options.delay = 1 / (this.options.wpm / 60) * 1000
    this.timer = null
  }

  setText (val) {
    if (val) {
      this.pause()
      this.restart()
      this.block = new Block(val)
      this.currentWord = this.block.word
    }
  }

  playPauseToggle () {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  play () {
    if (this.block) {
      if (this.isEnded) {
        return
      }
      if (this.options.slowStartCount) {
        this.slowStartCount = this.options.slowStartCount
      }
      this.display()
      this.isPlaying = true
    }
  }

  pause () {
    clearTimeout(this.timer)
    this.isPlaying = false
  }

  destroy () {
    clearTimeout(this.timer)
    this.isPlaying = false
    this.block = null
  }

  restart () {
    if (this.block) {
      if (!this.isEnded) {
        this.pause()
      }
      if (this.options.slowStartCount) {
        this.slowStartCount = this.options.slowStartCount
      }
      this.block.restart()
      this.currentWord = this.block.word
      this.isEnded = false
      this.play()
    }
  }

  display () {
    this.currentWord = this.block.word
    if (this.currentWord) {
      this.showWord()
      var time = this.options.delay
      if (this.currentWord.hasPeriod) time *= this.options.sentenceDelay
      if (this.currentWord.hasOtherPunc) time *= this.options.otherPuncDelay
      if (this.currentWord.isShort) time *= this.options.shortWordDelay
      if (this.currentWord.isLong) time *= this.options.longWordDelay
      if (this.currentWord.isNumeric) time *= this.options.numericDelay
      this.slowStartCount = (this.slowStartCount - 1) || 1
      time = time * this.slowStartCount
      this.timer = setTimeout(() => { this.next() }, time)
    } else {
      this.isPlaying = false
      this.isEnded = true
    }
  }

  showWord () {
    var word = this.currentWord.val
    console.log(word)
  }

  next () {
    this.block.next()
    this.display()
  }
}
