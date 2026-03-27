const NO_SPACE_LANGUAGES = new Set(['ja', 'zh', 'th', 'lo', 'km', 'my'])
const SENTENCE_END_REGEX = /[.!?]|[。！？؟]/u
const TRIVIAL_PUNCTUATION_REGEX = /^[\p{P}\p{S}。、・：；？！「」（）【】『』［］〔〕〈〉《》]+$/u
const NUMERIC_GROUP_SEPARATOR_REGEX = /.*\p{Nd}\.(?=[\p{Nd}\p{Ll}]).*/u
const NUMERIC_TOKEN_REGEX = /^[+-]?(?:\p{Nd}+(?:[.,]\p{Nd}+)*|\p{Nd}{1,3}(?:[ '\u00A0\u202F\u2019]\p{Nd}{3})+)$/u
const HYPHEN_REGEX = /[-\u2010\u2011\u2012\u2013\u2014\u2015\u2212\u2043\uFE63\uFF0D]/u

export function getSafeLocale(lang) {
  const documentLang = globalThis.document?.documentElement?.lang || ''
  const navigatorLang = globalThis.navigator?.language || ''
  const fallback = documentLang || navigatorLang || 'en'
  const candidate = lang || fallback

  try {
    Intl.getCanonicalLocales(candidate)
    return candidate
  } catch (_) {
    return 'en'
  }
}

export function isWhiteSpace(str) {
  return /\p{White_Space}/u.test(str)
}

export function isTrivialPunctuation(str) {
  return TRIVIAL_PUNCTUATION_REGEX.test(str)
}

export function hasProtectedNumericSeparator(str) {
  return NUMERIC_GROUP_SEPARATOR_REGEX.test(str)
}

export function isNumericToken(text, wordLikeSegments) {
  if (!wordLikeSegments.length) return false
  if (wordLikeSegments.every(s => /^\p{Nd}+$/u.test(s.segment))) return true
  const normalized = text.replace(/[.!?。！？؟]+$/u, '')
  return NUMERIC_TOKEN_REGEX.test(normalized)
}

export function parseWordMetadata(val, lang = 'en') {
  lang = getSafeLocale(lang)
  const segmenter = new Intl.Segmenter(lang, { granularity: 'word' })
  const segments = Array.from(segmenter.segment(val))
  const wordLikeSegments = segments.filter(s => s.isWordLike)
  const length = wordLikeSegments.reduce((sum, s) => sum + s.segment.length, 0)

  let prefixLength = 0
  for (const s of segments) {
    if (s.isWordLike || isWhiteSpace(s.segment)) break
    prefixLength += s.segment.length
  }

  const last = segments[segments.length - 1]?.segment ?? ''
  const endsSentence = SENTENCE_END_REGEX.test(last)
  const nonWordPunc = segments
    .filter(s => !s.isWordLike && !isWhiteSpace(s.segment))
    .map(s => s.segment)
    .join('')

  return {
    length,
    prefixLength,
    endsSentence,
    hasOtherPunc: !!nonWordPunc && !endsSentence,
    isNumeric: isNumericToken(val, wordLikeSegments)
  }
}

function tokenizeNonSpaceLang(segments) {
  const result = []
  let i = 0

  while (i < segments.length) {
    if (isWhiteSpace(segments[i].segment)) {
      i++
      continue
    }

    let prefix = ''
    let core = ''
    let suffix = ''

    while (i < segments.length && isTrivialPunctuation(segments[i].segment)) {
      const next = segments[i + 1]
      if (next && !isWhiteSpace(next.segment) && !isTrivialPunctuation(next.segment)) {
        prefix += segments[i].segment
        i++
      } else {
        break
      }
    }

    if (
      i < segments.length &&
      !isWhiteSpace(segments[i].segment) &&
      !isTrivialPunctuation(segments[i].segment)
    ) {
      core = segments[i].segment
      i++
    }

    while (i < segments.length && isTrivialPunctuation(segments[i].segment)) {
      suffix += segments[i].segment
      i++
    }

    const token = (prefix + core + suffix).trim()
    if (token) result.push(token)
  }

  return result
}

export function bundleWords(val, lang = 'en', maxLen = Infinity) {
  lang = getSafeLocale(lang)
  const segmenter = new Intl.Segmenter(lang, { granularity: 'word' })
  const segments = Array.from(segmenter.segment(val))
  const isSpaceDelimited = !NO_SPACE_LANGUAGES.has(lang.split('-')[0])

  if (!isSpaceDelimited) {
    return tokenizeNonSpaceLang(segments)
  }

  const result = []
  let i = 0

  while (i < segments.length) {
    if (isWhiteSpace(segments[i].segment)) {
      i++
      continue
    }

    let token = ''
    let wordCharCount = 0

    const flush = () => {
      if (token) result.push(token)
      token = ''
      wordCharCount = 0
    }

    while (i < segments.length && !isWhiteSpace(segments[i].segment)) {
      const seg = segments[i]
      const next = segments[i + 1]

      if (
        HYPHEN_REGEX.test(seg.segment) &&
        next &&
        next.isWordLike &&
        !hasProtectedNumericSeparator(token + seg.segment + next.segment)
      ) {
        const prospectiveLen = wordCharCount + next.segment.length
        if (prospectiveLen > maxLen) {
          token += seg.segment
          flush()
          i++
          continue
        }
      }

      token += seg.segment
      if (seg.isWordLike) wordCharCount += seg.segment.length
      i++
    }

    flush()
  }

  return result
}
