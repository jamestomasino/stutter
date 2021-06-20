import Locale from './locales.js'
const locale = new Locale()

export default class Parts {
  constructor () {
    this._vowels = 'aeiouyAEIOUYẚÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĀāẢảȀȁȂȃẠạẶặẬậḀḁȺⱥǼǽǢǣÉƏƎǝéÈèĔĕÊêẾếỀềỄễỂểĚěËëẼẽĖėȨȩḜḝĘęĒēḖḗḔḕẺẻȄȅȆȇẸẹỆệḘḙḚḛɆɇɚɝÍíÌìĬĭÎîǏǐÏïḮḯĨĩİiĮįĪīỈỉȈȉȊȋỊịḬḭIıƗɨÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộƟɵÚúÙùŬŭÛûǓǔŮůÜüǗǘǛǜǙǚǕǖŰűŨũṸṹŲųŪūṺṻỦủȔȕȖȗƯưỨứỪừỮữỬửỰựỤụṲṳṶṷṴṵɄʉÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵʏɎɏƳƴ'
    this._hyphens = '[-‒–―]+' // — not included as it is a word break
    let c = '[^' + this._vowels + ']'
    let v = '[' + this._vowels + ']'
    this._vccv = new RegExp('(' + v + c + ')(' + c + v + ')', 'g')
  }

  breakLongWord (word, maxWordLength) {
    let ret = []
    let start = ''
    let end = ''
    let hyphenParts = word.split(this._hyphens)
    if (hyphenParts.length > 1) {
      // split on hyphens if they exist first
      ret = hyphenParts.map((part) => {
        if (part.length > maxWordLength) {
          return this.breakLongWord(part, maxWordLength)
        } else {
          return part
        }
      })
    } else {
      // punctuation[1], prefix[2], center[3], suffix[4], punctuation[5]
      let parts = locale.presufRegex.exec(word)
      if (parts[2]) ret.push(parts[2])
      if (parts[3]) ret = ret.concat(parts[3].replace(this._vccv, '$1 $2').split(' '))
      if (parts[4]) ret.push(parts[4])
      start = parts[1] || ''
      end = parts[5] || ''
    }
    let stitch = ret.filter(p => p).map((p, i) => {
      return (i === 0 || p.match(/^[-‒–―]/)) ? p : '-' + p // — not included as it is a word break
    })
    return start + stitch.join(' ') + end
  }

  puncBreak (word) {
    let parts = locale.puncSplitRegex.exec(word)
    let ret = []
    if (parts) {
      ret.push(parts[1])
      ret.push(parts[2])
    } else {
      ret = [word]
    }
    return ret.join(' ')
  }
}
