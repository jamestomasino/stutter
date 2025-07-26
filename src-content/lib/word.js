export default class Word {
  constructor(val, lang = 'en') {
    this.val = val
    this.lang = lang
    this.endsSentence = false
    this.hasOtherPunc = false
    this.isShort = false
    this.isLong = false
    this.isNumeric = false
    this.index = 0
    this.textFragment = ''
    this.length = 0

    this.parseWord()
    this.findIndex()
  }

  parseWord() {
    const segmenter = new Intl.Segmenter(this.lang, { granularity: 'word' })
    const segments = Array.from(segmenter.segment(this.val))

    const wordLikeSegments = segments.filter(s => s.isWordLike)
    this.length = wordLikeSegments.reduce((sum, s) => sum + s.segment.length, 0)

    this.prefixLength = 0
    for (const s of segments) {
      if (s.isWordLike || /\p{White_Space}/u.test(s.segment)) break
      this.prefixLength += s.segment.length
    }

    const last = segments[segments.length - 1]?.segment ?? ''
    this.isNumeric =
      wordLikeSegments.length > 0 &&
      wordLikeSegments.every(s => /^\d+$/.test(s.segment))

    this.endsSentence = /[.!?]|[。！？؟]/u.test(last)

    const nonWordPunc = segments
      .filter(s => !s.isWordLike && !/\p{White_Space}/u.test(s.segment))
      .map(s => s.segment)
      .join('')

    if (nonWordPunc && !this.endsSentence) {
      this.hasOtherPunc = true
    }
  }

  findIndex() {
    switch (true) {
      case (this.length < 2):
        this.index = 0
        this.isShort = true
        break
      case (this.length < 5):
        this.index = 1
        this.isShort = true
        break
      case (this.length < 9):
        this.index = 2
        break
      case (this.length < 14):
        this.index = 3
        this.isLong = true
        break
      default:
        this.index = 4
        this.isLong = true
        break
    }

    // Adjust for prefix characters like “(¿ etc.
    if (this.prefixLength > 0) {
      this.index++
    }
  }
}
