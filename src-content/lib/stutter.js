import Block from './block'
import StutterOptions from '../../src-common/stutterOptions'

export default class Stutter {
  constructor (ui) {
    this.block = null
    this.currentWord = null
    this.isEnded = false
    this.isPlaying = false
    this.ui = ui
    this.ui.addListener('close', () => {
      this.destroy()
    })
    this.ui.addListener('pauseToggle', () => {
      this.playPauseToggle()
    })
    this.ui.addListener('pause', () => {
      this.pause()
    })
    this.options = new StutterOptions()
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
      if (this.options.getProp('slowStartCount')) {
        this.slowStartCount = this.options.getProp('slowStartCount')
      }
      this.ui.reveal()
      this.ui.resume()
      this.display()
      this.isPlaying = true
    }
  }

  pause () {
    clearTimeout(this.timer)
    this.isPlaying = false
    this.ui.pause()
  }

  destroy () {
    clearTimeout(this.timer)
    this.ui.hide()
    this.isPlaying = false
    this.block = null
    this.isEnded = true
  }

  restart () {
    if (this.block) {
      if (!this.isEnded) {
        this.pause()
      }
      if (this.options.getProp('slowStartCount')) {
        this.slowStartCount = this.options.getProp('slowStartCount')
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
      this.timer = setTimeout(() => { this.next() }, this.getTime())
    } else {
      this.destroy()
    }
  }

  getTime () {
    var time = this.options.delay
    if (this.currentWord.hasPeriod) time *= this.options.getProp('sentenceDelay')
    if (this.currentWord.hasOtherPunc) time *= this.options.getProp('otherPuncDelay')
    if (this.currentWord.isShort) time *= this.options.getProp('shortWordDelay')
    if (this.currentWord.isLong) time *= this.options.getProp('longWordDelay')
    if (this.currentWord.isNumeric) time *= this.options.getProp('numericDelay')
    this.slowStartCount = (this.slowStartCount - 1) || 1
    time = time * this.slowStartCount
    return time
  }

  showWord () {
    if (!this.currentWord.val.match(/[\n\r\s]+/)) {
      this.ui.show(this.currentWord)
      this.ui.progress = parseInt(this.block.progress * 100, 10)
    }
  }

  next () {
    this.block.next()
    this.display()
  }
}
