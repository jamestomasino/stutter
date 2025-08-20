import { bundleWords, getSafeLocale, hasProtectedNumericSeparator, parseWordMetadata } from './tokenizer.mjs'

const HYPHEN_CHARS = new Set([
  '-',
  '\u2010',
  '\u2011',
  '\u2012',
  '\u2013',
  '\u2014',
  '\u2015',
  '\u2212',
  '\u2043',
  '\uFE63',
  '\uFF0D'
])

const PARAGRAPH_SEPARATOR = /(?:\r?\n)[ \t\f]*\r?\n+/u

function isLetterOrDigit(char) {
  return /[\p{L}\p{Nd}]/u.test(char)
}

function splitParagraphs(text) {
  return text
    .split(PARAGRAPH_SEPARATOR)
    .map(part => part.trim())
    .filter(Boolean)
}

function splitAffixes(text) {
  let start = 0
  while (start < text.length && !isLetterOrDigit(text[start])) {
    start++
  }

  let end = text.length - 1
  while (end >= start && !isLetterOrDigit(text[end])) {
    end--
  }

  if (start > end) {
    return { prefix: '', core: '', suffix: '' }
  }

  return {
    prefix: text.slice(0, start),
    core: text.slice(start, end + 1),
    suffix: text.slice(end + 1)
  }
}

function splitByCodePoints(text, maxLength) {
  if (!text) return []

  const chars = Array.from(text)
  const result = []
  for (let i = 0; i < chars.length; i += maxLength) {
    result.push(chars.slice(i, i + maxLength).join(''))
  }
  return result
}

function splitAtHyphenBoundaries(text) {
  if (!Array.from(text).some(char => HYPHEN_CHARS.has(char))) return null

  const result = []
  let buffer = ''
  for (const char of Array.from(text)) {
    buffer += char
    if (HYPHEN_CHARS.has(char)) {
      if (buffer) result.push(buffer)
      buffer = ''
    }
  }
  if (buffer) result.push(buffer)

  return result.length > 1 ? result : null
}

function appendHyphen(segment) {
  if (!segment) return segment
  const last = Array.from(segment).at(-1)
  if (HYPHEN_CHARS.has(last)) return segment
  return isLetterOrDigit(last) ? `${segment}-` : segment
}

function toBreakpoints(parts) {
  const breakpoints = []
  let cursor = 0
  for (let i = 0; i < parts.length - 1; i++) {
    cursor += Array.from(parts[i]).length
    breakpoints.push(cursor)
  }
  return breakpoints
}

function sliceByCodePoints(chars, start, end) {
  return chars.slice(start, end).join('')
}

function splitWithBreakpoints(core, breakpoints, maxLength) {
  const chars = Array.from(core)
  if (!breakpoints.length) return splitByCodePoints(core, maxLength)

  const sorted = [...breakpoints].sort((a, b) => a - b)
  const segments = []
  let start = 0

  while (start < chars.length) {
    const remaining = chars.length - start
    const maxEnd = remaining <= maxLength ? chars.length : start + maxLength
    if (maxEnd === chars.length) {
      segments.push(sliceByCodePoints(chars, start, chars.length))
      break
    }

    const candidates = sorted.filter(point => point > start && point <= maxEnd)
    const splitAt = candidates.at(-1)
    if (splitAt == null) {
      segments.push(sliceByCodePoints(chars, start, maxEnd))
      start = maxEnd
    } else {
      segments.push(sliceByCodePoints(chars, start, splitAt))
      start = splitAt
    }
  }

  return segments.filter(Boolean)
}

function splitTokenByHyphenation(text, lang, maxLength, hyphenateWordFn) {
  if (maxLength <= 0 || !text) return [text]

  const { prefix, core, suffix } = splitAffixes(text)
  if (!core) return [text]

  const coreChars = Array.from(core)
  if (coreChars.length <= maxLength) return [text]

  const hyphenated = (hyphenateWordFn ? hyphenateWordFn(core, lang, { hyphenChar: '|' }) : core) || core
  const parts = hyphenated.split('|').filter(Boolean)
  const breakpoints = toBreakpoints(parts)
  const segments = splitWithBreakpoints(core, breakpoints, maxLength)
  if (!segments.length) {
    return [text]
  }

  return segments.map((segment, index) => {
    const withPrefix = index === 0 ? prefix + segment : segment
    return index === segments.length - 1 ? withPrefix + suffix : withPrefix
  })
}

function splitLongTokens(tokens, lang, maxWordLength, hyphenateWordFn) {
  if (maxWordLength <= 0) return tokens

  const result = []
  for (const token of tokens) {
    if (hasProtectedNumericSeparator(token)) {
      result.push(token)
      continue
    }

    const hyphenSplit = splitAtHyphenBoundaries(token)
    if (hyphenSplit) {
      for (const segment of hyphenSplit) {
        if (parseWordMetadata(segment, lang).length <= maxWordLength) {
          result.push(segment)
        } else {
          const splitSegments = splitTokenByHyphenation(segment, lang, maxWordLength, hyphenateWordFn)
          splitSegments.forEach((part, index) => {
            result.push(index < splitSegments.length - 1 ? appendHyphen(part) : part)
          })
        }
      }
      continue
    }

    if (parseWordMetadata(token, lang).length <= maxWordLength) {
      result.push(token)
      continue
    }

    const splitSegments = splitTokenByHyphenation(token, lang, maxWordLength, hyphenateWordFn)
    splitSegments.forEach((part, index) => {
      result.push(index < splitSegments.length - 1 ? appendHyphen(part) : part)
    })
  }

  return result
}

export function buildWordEntries(text, lang = 'en', maxWordLength = Infinity, hyphenateWordFn = null) {
  if (!text || !text.trim()) return []
  lang = getSafeLocale(lang)

  const paragraphs = splitParagraphs(text)
  const combined = []

  for (const paragraph of paragraphs) {
    const rawTokens = bundleWords(paragraph, lang, Infinity)
    if (!rawTokens.length) continue

    const splitTokens = splitLongTokens(rawTokens, lang, maxWordLength, hyphenateWordFn)
    splitTokens.forEach((token, index) => {
      combined.push({
        text: token,
        isParagraphEnd: index === splitTokens.length - 1
      })
    })
  }

  return combined
}
