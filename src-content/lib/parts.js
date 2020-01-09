// Eventually we can migrate this to JSON once we make this whole bit async
const locales = {
  en: {
    wordRegex: '([^\\s/]+|[\r\n]+)',
    puncSplit: '(.+?)(\\.[^\\w]\b|,[^\\w]\b)(.+?)',
    presuf: '^(\\W*)(anti|auto|ab|an|ax|al|as|bi|bet|be|contra|cat|cath|cir|cum|cog|col|com|con|cor|could|co|desk|de|dis|did|dif|di|eas|every|ever|extra|ex|end|en|em|epi|evi|func|fund|fin|hyst|hy|han|il|in|im|ir|just|jus|loc|lig|lit|li|mech|manu|man|mal|mis|mid|mono|multi|mem|micro|non|nano|ob|oc|of|opt|op|over|para|per|post|pre|peo|pro|retro|rea|re|rhy|should|some|semi|sen|sol|sub|suc|suf|super|sup|sur|sus|syn|sym|syl|tech|trans|tri|typo|type|uni|un|van|vert|with|would|won)?(.*?)(weens?|widths?|icals?|ables?|ings?|tions?|ions?|ies|isms?|ists?|ful|ness|ments?|ly|ify|ize|ise|ity|en|ers?|ences?|tures?|ples?|als?|phy|puts?|phies|ry|ries|cy|cies|mums?|ous|cents?)?(\\W*)$'
  },
  es: {
    wordRegex: '([^\\s/]+|[\r\n]+)',
    puncSplit: '(.+?)(\\.[^\\w]\b|,[^\\w]\b)(.+?)',
    presuf: '^(\\W*)(génesis|contra|eñoeña|izoiza|osoosa|achon|entre|extra|fobia|hiper|inter|mente|super|able|ante|anti|ario|ción|dera|dero|hipo|post|aco|ado|bis|con|des|pos|pre|sub|an|bi|co|de|en|ex|in|or|re)?(\\W*)$'
  },
}

// Check if we have a language matching the locale string. Fall back on 2 char
// code if the full one is missing. Fall back on English as default
function getLocaleProp (prop, locale) {
  locale = locale.toLowerCase()
  let short = locale.substr(0, 2)
  if (locales.hasOwnProperty(locale)) {
    return locales[locale][prop]
  } else if (locales.hasOwnProperty(short)) {
    return locales[short][prop]
  } else {
    return locales['en'][prop]
  }
}

export default class Parts {
  constructor (locale) {
    this._presuf = new RegExp(getLocaleProp('presuf', locale), 'i')
    this._wordRegex = new RegExp(getLocaleProp('wordRegex', locale), 'g')
    this._puncSplit = new RegExp(getLocaleProp('puncSplit', locale))
    this._vowels = 'aeiouyAEIOUYẚÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĀāẢảȀȁȂȃẠạẶặẬậḀḁȺⱥǼǽǢǣÉƏƎǝéÈèĔĕÊêẾếỀềỄễỂểĚěËëẼẽĖėȨȩḜḝĘęĒēḖḗḔḕẺẻȄȅȆȇẸẹỆệḘḙḚḛɆɇɚɝÍíÌìĬĭÎîǏǐÏïḮḯĨĩİiĮįĪīỈỉȈȉȊȋỊịḬḭIıƗɨÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯȰȱØøǾǿǪǫǬǭŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộƟɵÚúÙùŬŭÛûǓǔŮůÜüǗǘǛǜǙǚǕǖŰűŨũṸṹŲųŪūṺṻỦủȔȕȖȗƯưỨứỪừỮữỬửỰựỤụṲṳṶṷṴṵɄʉÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵʏɎɏƳƴ'
    this._hyphens = '[-—‒–—―]+'
    let c = '[^' + this._vowels + ']'
    let v = '[' + this._vowels + ']'
    this._vccv = new RegExp('(' + v + c + ')(' + c + v + ')', 'g')
  }

  get wordRegex () {
    return this._wordRegex
  }

  get puncSplit () {
    return this._puncSplit
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
      let parts = this._presuf.exec(word)
      if (parts[2]) ret.push(parts[2])
      if (parts[3]) ret = ret.concat(parts[3].replace(this._vccv, '$1 $2').split(' '))
      if (parts[4]) ret.push(parts[4])
      start = parts[1] || ''
      end = parts[5] || ''
    }
    let stitch = ret.filter(p => p).map((p, i) => {
      return (i === 0 || p.match(/^[-—‒–—―]/)) ? p : '-' + p
    })
    return start + stitch.join(' ') + end
  }

  puncBreak (word) {
    let parts = this._puncSplit.exec(word)
    let ret = []
    if (parts) {
      ret.push(parts[1] + parts[2])
      ret = ret.concat(this.puncBreak(parts[3]))
    } else {
      ret = [word]
    }
    return ret.join(' ')
  }
}
