const Word = require('./word')

var wordRegex = /([^\s\-—/]+[-—/]?|[\r\n]+)/g
var presuf = /^(\W*)(anti|auto|ab|an|ax|al|as|bi|bet|be|contra|cat|cath|cir|cum|cog|col|com|con|cor|could|co|desk|de|dis|did|dif|di|eas|every|ever|extra|ex|end|en|em|epi|evi|func|fund|fin|hyst|hy|han|il|in|im|ir|just|jus|loc|lig|lit|li|mech|manu|man|mal|mis|mid|mono|multi|mem|micro|non|nano|ob|oc|of|opt|op|over|para|per|post|pre|peo|pro|retro|rea|re|rhy|should|some|semi|sen|sol|sub|suc|suf|super|sup|sur|sus|syn|sym|syl|tech|trans|tri|typo|type|uni|un|van|vert|with|would|won)?(.*?)(weens?|widths?|icals?|ables?|ings?|tions?|ions?|ies|isms?|ists?|ful|ness|ments?|ly|ify|ize|ise|ity|en|ers?|ences?|tures?|ples?|als?|phy|puts?|phies|ry|ries|cy|cies|mums?|ous|cents?)?(\W*)$/i
var vowels = 'aeiouyAEIOUY' +
  'ẚÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĀāẢảȀȁȂȃẠạẶặẬậḀḁȺⱥ' +
  'ǼǽǢǣÉƏƎǝéÈèĔĕÊêẾếỀềỄễỂểĚěËëẼẽĖėȨȩḜḝĘęĒēḖḗḔḕẺẻȄȅȆȇẸẹỆệḘḙḚḛɆɇɚɝÍíÌìĬĭÎîǏǐÏ' +
  'ïḮḯĨĩİiĮįĪīỈỉȈȉȊȋỊịḬḭIıƗɨÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯȰȱØøǾǿǪǫǬǭŌōṒṓ' +
  'ṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộƟɵÚúÙùŬŭÛûǓǔŮůÜüǗǘǛǜǙǚǕǖŰűŨũṸṹŲųŪūṺṻỦủȔȕȖȗƯưỨứỪừ' +
  'ỮữỬửỰựỤụṲṳṶṷṴṵɄʉÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵʏɎɏƳƴ'
var c = '[^' + vowels + ']'
var v = '[' + vowels + ']'
var vccv = new RegExp('(' + v + c + ')(' + c + v + ')', 'g')
var puncSplit = /(.+?)(\.[^\w]\b|,[^\w]\b)(.+?)/

module.exports = class Block {
  constructor (val) {
    this.val = val

    this.words = []
    this.index = 0

    this.process()
  }

  process () {
    // Cleanup
    this.words = []
    this.index = 0

    // Build word chain
    var rawWords = this.val.match(wordRegex)

    // Extra splits on odd punctuation situations
    var i = rawWords.length
    while (i--) {
      var w = rawWords[i]
      w = this.puncBreak(w)
      var subWords = w.match(wordRegex)
      var j = subWords.length
      while (j--) {
        if (subWords[j].length > 13) {
          var subw = this.break(subWords[j])
          var subsubWords = subw.match(wordRegex)
          var k = subsubWords.length
          while (k--) {
            this.words.unshift(new Word(subsubWords[k]))
          }
        } else {
          this.words.unshift(new Word(subWords[j]))
        }
      }
    }
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
