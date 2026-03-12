import { hyphenateSync as hyphenate_en } from "hyphen/en";
import { hyphenateSync as hyphenate_de } from "hyphen/de";
import { hyphenateSync as hyphenate_el } from "hyphen/el";
import { hyphenateSync as hyphenate_mn } from "hyphen/mn";
import { hyphenateSync as hyphenate_sh } from "hyphen/sh";
import { hyphenateSync as hyphenate_sr } from "hyphen/sr";
import { hyphenateSync as hyphenate_zh } from "hyphen/zh";
import { hyphenateSync as hyphenate_af } from "hyphen/af";
import { hyphenateSync as hyphenate_as } from "hyphen/as";
import { hyphenateSync as hyphenate_be } from "hyphen/be";
import { hyphenateSync as hyphenate_bg } from "hyphen/bg";
import { hyphenateSync as hyphenate_bn } from "hyphen/bn";
import { hyphenateSync as hyphenate_ca } from "hyphen/ca";
import { hyphenateSync as hyphenate_co } from "hyphen/cop";
import { hyphenateSync as hyphenate_cs } from "hyphen/cs";
import { hyphenateSync as hyphenate_cy } from "hyphen/cy";
import { hyphenateSync as hyphenate_cu } from "hyphen/cu";
import { hyphenateSync as hyphenate_da } from "hyphen/da";
import { hyphenateSync as hyphenate_es } from "hyphen/es";
import { hyphenateSync as hyphenate_et } from "hyphen/et";
import { hyphenateSync as hyphenate_eu } from "hyphen/eu";
import { hyphenateSync as hyphenate_fi } from "hyphen/fi";
import { hyphenateSync as hyphenate_fr } from "hyphen/fr";
import { hyphenateSync as hyphenate_fu } from "hyphen/fur";
import { hyphenateSync as hyphenate_ga } from "hyphen/ga";
import { hyphenateSync as hyphenate_gl } from "hyphen/gl";
import { hyphenateSync as hyphenate_gr } from "hyphen/grc";
import { hyphenateSync as hyphenate_gu } from "hyphen/gu";
import { hyphenateSync as hyphenate_hi } from "hyphen/hi";
import { hyphenateSync as hyphenate_hr } from "hyphen/hr";
import { hyphenateSync as hyphenate_hs } from "hyphen/hsb";
import { hyphenateSync as hyphenate_hu } from "hyphen/hu";
import { hyphenateSync as hyphenate_hy } from "hyphen/hy";
import { hyphenateSync as hyphenate_ia } from "hyphen/ia";
import { hyphenateSync as hyphenate_id } from "hyphen/id";
import { hyphenateSync as hyphenate_is } from "hyphen/is";
import { hyphenateSync as hyphenate_it } from "hyphen/it";
import { hyphenateSync as hyphenate_ka } from "hyphen/ka";
import { hyphenateSync as hyphenate_km } from "hyphen/kmr";
import { hyphenateSync as hyphenate_kn } from "hyphen/kn";
import { hyphenateSync as hyphenate_la } from "hyphen/la";
import { hyphenateSync as hyphenate_lt } from "hyphen/lt";
import { hyphenateSync as hyphenate_lv } from "hyphen/lv";
import { hyphenateSync as hyphenate_ml } from "hyphen/ml";
import { hyphenateSync as hyphenate_mr } from "hyphen/mr";
import { hyphenateSync as hyphenate_nb } from "hyphen/nb";
import { hyphenateSync as hyphenate_nl } from "hyphen/nl";
import { hyphenateSync as hyphenate_nn } from "hyphen/nn";
import { hyphenateSync as hyphenate_no } from "hyphen/no";
import { hyphenateSync as hyphenate_oc } from "hyphen/oc";
import { hyphenateSync as hyphenate_or } from "hyphen/or";
import { hyphenateSync as hyphenate_pa } from "hyphen/pa";
import { hyphenateSync as hyphenate_pi } from "hyphen/pi";
import { hyphenateSync as hyphenate_pl } from "hyphen/pl";
import { hyphenateSync as hyphenate_pm } from "hyphen/pms";
import { hyphenateSync as hyphenate_pt } from "hyphen/pt";
import { hyphenateSync as hyphenate_rm } from "hyphen/rm";
import { hyphenateSync as hyphenate_ro } from "hyphen/ro";
import { hyphenateSync as hyphenate_ru } from "hyphen/ru";
import { hyphenateSync as hyphenate_sa } from "hyphen/sa";
import { hyphenateSync as hyphenate_sk } from "hyphen/sk";
import { hyphenateSync as hyphenate_sl } from "hyphen/sl";
import { hyphenateSync as hyphenate_sv } from "hyphen/sv";
import { hyphenateSync as hyphenate_ta } from "hyphen/ta";
import { hyphenateSync as hyphenate_te } from "hyphen/te";
import { hyphenateSync as hyphenate_th } from "hyphen/th";
import { hyphenateSync as hyphenate_tk } from "hyphen/tk";
import { hyphenateSync as hyphenate_tr } from "hyphen/tr";
import { hyphenateSync as hyphenate_uk } from "hyphen/uk";

function getHyphenator(lang) {
  let ret = null
  switch (lang.substr(0,2)) {
    case 'en': ret = hyphenate_en; break
    case 'de': ret = hyphenate_de; break
    case 'el': ret = hyphenate_el; break
    case 'mn': ret = hyphenate_mn; break
    case 'sh': ret = hyphenate_sh; break
    case 'sr': ret = hyphenate_sr; break
    case 'zh': ret = hyphenate_zh; break
    case 'af': ret = hyphenate_af; break
    case 'as': ret = hyphenate_as; break
    case 'be': ret = hyphenate_be; break
    case 'bg': ret = hyphenate_bg; break
    case 'bn': ret = hyphenate_bn; break
    case 'ca': ret = hyphenate_ca; break
    case 'co': ret = hyphenate_co; break
    case 'cs': ret = hyphenate_cs; break
    case 'cy': ret = hyphenate_cy; break
    case 'cu': ret = hyphenate_cu; break
    case 'da': ret = hyphenate_da; break
    case 'es': ret = hyphenate_es; break
    case 'et': ret = hyphenate_et; break
    case 'eu': ret = hyphenate_eu; break
    case 'fi': ret = hyphenate_fi; break
    case 'fr': ret = hyphenate_fr; break
    case 'fu': ret = hyphenate_fu; break
    case 'ga': ret = hyphenate_ga; break
    case 'gl': ret = hyphenate_gl; break
    case 'gr': ret = hyphenate_gr; break
    case 'gu': ret = hyphenate_gu; break
    case 'hi': ret = hyphenate_hi; break
    case 'hr': ret = hyphenate_hr; break
    case 'hs': ret = hyphenate_hs; break
    case 'hu': ret = hyphenate_hu; break
    case 'hy': ret = hyphenate_hy; break
    case 'ia': ret = hyphenate_ia; break
    case 'id': ret = hyphenate_id; break
    case 'is': ret = hyphenate_is; break
    case 'it': ret = hyphenate_it; break
    case 'ka': ret = hyphenate_ka; break
    case 'km': ret = hyphenate_km; break
    case 'kn': ret = hyphenate_kn; break
    case 'la': ret = hyphenate_la; break
    case 'lt': ret = hyphenate_lt; break
    case 'lv': ret = hyphenate_lv; break
    case 'ml': ret = hyphenate_ml; break
    case 'mr': ret = hyphenate_mr; break
    case 'nb': ret = hyphenate_nb; break
    case 'nl': ret = hyphenate_nl; break
    case 'nn': ret = hyphenate_nn; break
    case 'no': ret = hyphenate_no; break
    case 'oc': ret = hyphenate_oc; break
    case 'or': ret = hyphenate_or; break
    case 'pa': ret = hyphenate_pa; break
    case 'pi': ret = hyphenate_pi; break
    case 'pl': ret = hyphenate_pl; break
    case 'pm': ret = hyphenate_pm; break
    case 'pt': ret = hyphenate_pt; break
    case 'rm': ret = hyphenate_rm; break
    case 'ro': ret = hyphenate_ro; break
    case 'ru': ret = hyphenate_ru; break
    case 'sa': ret = hyphenate_sa; break
    case 'sk': ret = hyphenate_sk; break
    case 'sl': ret = hyphenate_sl; break
    case 'sv': ret = hyphenate_sv; break
    case 'ta': ret = hyphenate_ta; break
    case 'te': ret = hyphenate_te; break
    case 'th': ret = hyphenate_th; break
    case 'tk': ret = hyphenate_tk; break
    case 'tr': ret = hyphenate_tr; break
    case 'uk': ret = hyphenate_uk; break
    default: ret = null
  }
  return ret
}

export function hyphenateWord(word, lang, options) {
  const hyphenator = getHyphenator(lang)
  if (!hyphenator) return word
  return hyphenator(word, options)
}

export default function hyphenate(doc, lang, options) {
  const hyphenated = hyphenateWord(doc, lang, options)
  return hyphenated || doc
}
