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

export default function hyphenate (doc, lang, options) {
  let ret = ''
  switch (lang.substr(0,2)) {
    case 'en': ret = hyphenate_en(doc, options); break
    case 'de': ret = hyphenate_de(doc, options); break
    case 'el': ret = hyphenate_el(doc, options); break
    case 'mn': ret = hyphenate_mn(doc, options); break
    case 'sh': ret = hyphenate_sh(doc, options); break
    case 'sr': ret = hyphenate_sr(doc, options); break
    case 'zh': ret = hyphenate_zh(doc, options); break
    case 'af': ret = hyphenate_af(doc, options); break
    case 'as': ret = hyphenate_as(doc, options); break
    case 'be': ret = hyphenate_be(doc, options); break
    case 'bg': ret = hyphenate_bg(doc, options); break
    case 'bn': ret = hyphenate_bn(doc, options); break
    case 'ca': ret = hyphenate_ca(doc, options); break
    case 'co': ret = hyphenate_co(doc, options); break
    case 'cs': ret = hyphenate_cs(doc, options); break
    case 'cy': ret = hyphenate_cy(doc, options); break
    case 'cu': ret = hyphenate_cu(doc, options); break
    case 'da': ret = hyphenate_da(doc, options); break
    case 'es': ret = hyphenate_es(doc, options); break
    case 'et': ret = hyphenate_et(doc, options); break
    case 'eu': ret = hyphenate_eu(doc, options); break
    case 'fi': ret = hyphenate_fi(doc, options); break
    case 'fr': ret = hyphenate_fr(doc, options); break
    case 'fu': ret = hyphenate_fu(doc, options); break
    case 'ga': ret = hyphenate_ga(doc, options); break
    case 'gl': ret = hyphenate_gl(doc, options); break
    case 'gr': ret = hyphenate_gr(doc, options); break
    case 'gu': ret = hyphenate_gu(doc, options); break
    case 'hi': ret = hyphenate_hi(doc, options); break
    case 'hr': ret = hyphenate_hr(doc, options); break
    case 'hs': ret = hyphenate_hs(doc, options); break
    case 'hu': ret = hyphenate_hu(doc, options); break
    case 'hy': ret = hyphenate_hy(doc, options); break
    case 'ia': ret = hyphenate_ia(doc, options); break
    case 'id': ret = hyphenate_id(doc, options); break
    case 'is': ret = hyphenate_is(doc, options); break
    case 'it': ret = hyphenate_it(doc, options); break
    case 'ka': ret = hyphenate_ka(doc, options); break
    case 'km': ret = hyphenate_km(doc, options); break
    case 'kn': ret = hyphenate_kn(doc, options); break
    case 'la': ret = hyphenate_la(doc, options); break
    case 'lt': ret = hyphenate_lt(doc, options); break
    case 'lv': ret = hyphenate_lv(doc, options); break
    case 'ml': ret = hyphenate_ml(doc, options); break
    case 'mr': ret = hyphenate_mr(doc, options); break
    case 'nb': ret = hyphenate_nb(doc, options); break
    case 'nl': ret = hyphenate_nl(doc, options); break
    case 'nn': ret = hyphenate_nn(doc, options); break
    case 'no': ret = hyphenate_no(doc, options); break
    case 'oc': ret = hyphenate_oc(doc, options); break
    case 'or': ret = hyphenate_or(doc, options); break
    case 'pa': ret = hyphenate_pa(doc, options); break
    case 'pi': ret = hyphenate_pi(doc, options); break
    case 'pl': ret = hyphenate_pl(doc, options); break
    case 'pm': ret = hyphenate_pm(doc, options); break
    case 'pt': ret = hyphenate_pt(doc, options); break
    case 'rm': ret = hyphenate_rm(doc, options); break
    case 'ro': ret = hyphenate_ro(doc, options); break
    case 'ru': ret = hyphenate_ru(doc, options); break
    case 'sa': ret = hyphenate_sa(doc, options); break
    case 'sk': ret = hyphenate_sk(doc, options); break
    case 'sl': ret = hyphenate_sl(doc, options); break
    case 'sv': ret = hyphenate_sv(doc, options); break
    case 'ta': ret = hyphenate_ta(doc, options); break
    case 'te': ret = hyphenate_te(doc, options); break
    case 'th': ret = hyphenate_th(doc, options); break
    case 'tk': ret = hyphenate_tk(doc, options); break
    case 'tr': ret = hyphenate_tr(doc, options); break
    case 'uk': ret = hyphenate_uk(doc, options); break
    default: ret = doc
  }
  return ret
}
