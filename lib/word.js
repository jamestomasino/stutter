var textRegex = /\w/g
var numRegex = /\d/g

module.exports = class Word {
  constructor (val) {
    this.val = val

    // Center value for alignment
    this.index = 0

    // Word Status Values
    this.hasLeadingQuote = false
    this.hasTrailingQuote = false
    this.hasPeriod = false
    this.hasOtherPunc = false
    this.isShort = false
    this.isLong = false
    this.isNumeric = false

    this.calc()
  }

  calc () {
    var match = this.val.match(textRegex)
    this.length = (match) ? match.length : 0

    var lastChar = this.val.substr(-1)
    var firstChar = this.val[0]

    if (lastChar === '"' || lastChar === '\'' || lastChar === ')' || lastChar === '”' || lastChar === '’') {
      this.hasTrailingQuote = true
    }

    if (firstChar === '"' || firstChar === '\'' || firstChar === '(' || firstChar === '“' || firstChar === '‘') {
      this.hasLeadingQuote = true
      this.hasOtherPunc = true
    }

    if (this.hasTrailingQuote) {
      lastChar = this.val.substr(-2, 1)
    }

    this.isNumeric = this.val.match(numRegex)

    switch (lastChar) {
      case '.':
      case '!':
      case '?':
        this.hasPeriod = true
        break
      case ':':
      case '':
      case ',':
      case '-':
        this.hasOtherPunc = true
        break
    }

    switch (this.length) {
      case 0:
      case 1:
        this.index = 0
        this.isShort = true
        break
      case 2:
      case 3:
      case 4:
        this.index = 1
        this.isShort = true
        break
      case 5:
      case 6:
      case 7:
      case 8:
        this.index = 2
        break
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
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
