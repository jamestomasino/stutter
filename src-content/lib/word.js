const textRegex = /\w/g
const numRegex = /\d/g

export default class Word {
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

    let match = this.val.match(textRegex)
    this.length = (match) ? match.length : 0

    let lastChar = this.val.substr(-1)
    let firstChar = this.val[0]

    switch (lastChar) {
      case '"':
      case '\'':
      case ')':
      case '”':
      case '’':
        this.hasTrailingQuote = true
        break
    }

    switch (firstChar) {
      case '"':
      case '\'':
      case '(':
      case '“':
      case '‘':
        this.hasLeadingQuote = true
        this.hasOtherPunc = true
        break
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
