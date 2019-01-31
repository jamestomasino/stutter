var whiteSpace = /[\n\r\s]/

module.exports = class Stutter {
  constructor (options) {
    this._currentWord = null
    this._delay = 0
    this._timer = null
    this._isPlaying = false
    this._isEnded = false
    this._options = options

    // Configured
    this.setWPM(this._options.wpm)
  }

  _display () {
    this._currentWord = this._block.getWord()
    if (this._currentWord) {
      this._showWord()

      var time = this._delay

      if ( this._currentWord.hasPeriod ) time *= this._options.sentenceDelay
      if ( this._currentWord.hasOtherPunc ) time *= this._options.otherPuncDelay
      if ( this._currentWord.isShort ) time *= this._options.shortWordDelay
      if ( this._currentWord.isLong ) time *= this._options.longWordDelay
      if ( this._currentWord.isNumeric ) time *= this._options.numericDelay

      this._slowStartCount = (this._slowStartCount - 1 ) || 1
      time = time * this._slowStartCount

      this._timer = setTimeout($.proxy(this._next, this),time)
    } else {
      this.clearDisplay()
      this._isPlaying = false
      this._isEnded = true
      this._barElement.attr('data-progrecss', 100 )
    }
  }

  _showWord () {
    if (this._displayElement) {
      var word = this._currentWord.val

      var before = word.substr(0, this._currentWord.index)
      var letter = word.substr(this._currentWord.index, 1)

      // fake elements
      var $before = this._options.element.find('.__read_before').html(before).css("opacity","0")
      var $letter = this._options.element.find('.__read_letter').html(letter).css("opacity","0")
      var calc = $before.textWidth() + Math.round( $letter.textWidth() / 2 )

      if (!this._currentWord.val.match(whiteSpace)){
        this._displayElement.html(this._currentWord.val)
        this._displayElement.css("margin-left", -calc)
      }
    }

    if (this._options.element && this._block) {
      this._barElement.attr('data-progrecss', parseInt(this._block.getProgress() * 100, 10) )
    }
  }

  _initSettings () {

    // WPM
    this._speedSliderElement.noUiSlider({
      range: [300,1500],
      start: this._options.wpm,
      step: 25,
      connect: 'lower',
      handles: 1,
      behaviour: 'extend-tap',
      serialization: {
        to: [ this._speedElement ],
        resolution: 1
      },
      set: $.proxy( function() {
        this.setWPM( this._speedElement.val() )
        this._speedElement.blur()
      }, this )
    })

    // Slow Start
    this._slowStartSliderElement.noUiSlider({
      range: [0,5],
      start: this._options.slowStartCount,
      step: 1,
      connect: 'lower',
      handles: 1,
      behaviour: 'extend-tap',
      serialization: {
        to: [ this._slowStartElement ],
        resolution: 1
      },
      set: $.proxy( function() {
        this.setSlowStartCount( this._slowStartElement.val() )
        this._slowStartElement.blur()
      },this )
    })

    // Sentence Delay
    this._sentenceDelaySliderElement.noUiSlider({
      range: [0,5],
      start: this._options.sentenceDelay,
      step: 0.1,
      connect: 'lower',
      handles: 1,
      behaviour: 'extend-tap',
      serialization: {
        to: [ this._sentenceDelayElement ],
        resolution: 0.1
      },
      set: $.proxy( function() {
        this.setSentenceDelay( this._sentenceDelayElement.val() )
        this._sentenceDelayElement.blur()
      },this )
    })

    // Other Punctuation Delay
    this._puncDelaySliderElement.noUiSlider({
      range: [0,5],
      start: this._options.otherPuncDelay,
      step: 0.1,
      connect: 'lower',
      handles: 1,
      behaviour: 'extend-tap',
      serialization: {
        to: [ this._puncDelayElement ],
        resolution: 0.1
      },
      set: $.proxy( function() {
        this.setOtherPuncDelay( this._puncDelayElement.val() )
        this._puncDelayElement.blur()
      },this )
    })

    // Short Word Delay
    this._shortWordDelaySliderElement.noUiSlider({
      range: [0,5],
      start: this._options.shortWordDelay,
      step: 0.1,
      connect: 'lower',
      handles: 1,
      behaviour: 'extend-tap',
      serialization: {
        to: [ this._shortWordDelayElement ],
        resolution: 0.1
      },
      set: $.proxy( function() {
        this.setShortWordDelay( this._shortWordDelayElement.val() )
        this._shortWordDelayElement.blur()
      },this )
    })

    // Long word Delay
    this._longWordDelaySliderElement.noUiSlider({
      range: [0,5],
      start: this._options.longWordDelay,
      step: 0.1,
      connect: 'lower',
      handles: 1,
      behaviour: 'extend-tap',
      serialization: {
        to: [ this._longWordDelayElement ],
        resolution: 0.1
      },
      set: $.proxy( function() {
        this.setLongWordDelay( this._longWordDelayElement.val() )
        this._longWordDelayElement.blur()
      },this )
    })

    // Numeric Delay
    this._numericDelaySliderElement.noUiSlider({
      range: [0,5],
      start: this._options.numericDelay,
      step: 0.1,
      connect: 'lower',
      handles: 1,
      behaviour: 'extend-tap',
      serialization: {
        to: [ this._numericDelayElement ],
        resolution: 0.1
      },
      set: $.proxy( function() {
        this.setNumericDelay( this._numericDelayElement.val() )
        this._numericDelayElement.blur()
      },this )
    })

  }

  destroy () {
    this.pause()
  }

  setText (val) {
    if (val) {
      this.pause()
      this.restart()
      this._block = new Block(val)
      this._currentWord = this._block.word
    }
  }

  _next () {
    this._block.next()
    this._display()
  }

  playPauseToggle () {
    if (this._isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  play () {
    if (this._block) {
      if (this._isEnded) {
        return
      }
      if (this._options.slowStartCount) {
        this._slowStartCount = this._options.slowStartCount
      }
      this._display()
      this._isPlaying = true
    }
  }

  pause () {
    clearTimeout(this._timer)
    this._isPlaying = false
  }

  restart () {
    if (this._block) {
      if (!this._isEnded) {
        this.pause()
      }
      if (this._options.slowStartCount) {
        this._slowStartCount = this._options.slowStartCount
      }
      this._block.restart()
      this._currentWord = this._block.getWord()
      this._isEnded = false
      this.play()
    }
  }

  setWPM ( val ) {
    val = Number(val)
    val = Math.max (1, val)
    val = Math.min (1500, val)
    this._wpm = val
    this._delay = 1/(val/60)*1000
  }

  setSentenceDelay ( val ) {
    val = Number(val)
    val = Math.max (1, val)
    val = Math.min (10, val)
    this._options.sentenceDelay = val
  }

  setOtherPuncDelay ( val ) {
    val = Number(val)
    val = Math.max (1, val)
    val = Math.min (10, val)
    this._options.otherPuncDelay = val
  }

  setShortWordDelay ( val ) {
    val = Number(val)
    val = Math.max (1, val)
    val = Math.min (10, val)
    this._options.shortWordDelay = val
  }

  setLongWordDelay ( val ) {
    val = Number(val)
    val = Math.max (1, val)
    val = Math.min (10, val)
    this._options.longWordDelay = val
  }

  setNumericDelay ( val ) {
    val = Number(val)
    val = Math.max (1, val)
    val = Math.min (10, val)
    this._options.numericDelay = val
  }

  setSlowStartCount ( val ) {
    val = Number(val)
    val = Math.max(0,val)
    val = Math.min(10,val)
    this._options.slowStartCount = val
  }

  updateWPMFromUI () {
    var newWPM = this._speedElement.val()
    newWPM = newWPM.match(/[\d]+/g)
    newWPM = parseInt(newWPM, 10)
    this.setWPM(newWPM)
  }
}
