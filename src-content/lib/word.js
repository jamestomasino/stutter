const puncRegex = /[/\s,.…?!¡‽:;‘’“”'’`><+=@&#~*^()[\]{}<>«»·•¤¢$€£¥₩₪†‡°]/g
const textRegex = /[^/\s,.…?!¡‽:;‘’“”'’`><+=@&#~*^()[\]{}<>«»·•¤¢$€£¥₩₪†‡°]/g
const numRegex = /\d/

export default class Word {
  constructor (val) {
    this.val = val
    this.hasLeadingQuote = false
    this.hasTrailingQuote = false
    this.hasPeriod = false
    this.hasOtherPunc = false
    this.isShort = false
    this.isLong = false
    this.isNumeric = false
    this.index = 0
    this.parseWord()
    this.findIndex()
    this.textFragment = ''
  }

  parseWord () {
    const match = this.val.match(textRegex)
    this.length = (match) ? match.length : 0
    let lastChar = this.val.substr(-1)
    const firstChar = this.val[0]

    this.isNumeric = numRegex.test(this.val)

    if (/["\\)”’]/.test(lastChar)) {
      this.hasTrailingQuote = true
      lastChar = this.val.substr(-2, 1)
    }

    if (/["\\(“‘]/.test(firstChar)) {
      this.hasLeadingQuote = true
    }

    if (/[.!?]/.test(lastChar)) {
      this.hasPeriod = true
    }

    if (!this.hasPeriod && puncRegex.test(this.val)) {
      this.hasOtherPunc = true
    }
  }

  findIndex () {
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

    // Adjust index for leading quote
    if (this.hasLeadingQuote) {
      this.index++
    }
  }
}
