/* global DOMParser */
import '../style.scss'
import { EventEmitter } from 'events'
import StutterOptions from '../../src-common/stutterOptions'
import { DEFAULT_FONT_ID, getFontFamilyStack, getFontStylesheet } from '../../src-common/fonts'
var browser = require('webextension-polyfill')

const STUTTER_LOCAL_FONT_STYLE_ID = '__stutter_local_fontface'
const STUTTER_GOOGLE_FONT_LINK_PREFIX = '__stutter_google_font_'

function getGoogleFontLinkId(fontId) {
  return `${STUTTER_GOOGLE_FONT_LINK_PREFIX}${String(fontId || '').replace(/[^a-z0-9_-]/gi, '')}`
}

function ensureLocalAtkinsonFontFace() {
  if (!document.head || document.getElementById(STUTTER_LOCAL_FONT_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STUTTER_LOCAL_FONT_STYLE_ID
  const fontUrl = browser && browser.runtime && browser.runtime.getURL
    ? browser.runtime.getURL('fonts/atkinson_hyperlegible_regular.ttf')
    : 'fonts/atkinson_hyperlegible_regular.ttf'
  style.textContent = `@font-face { font-family: "Stutter Atkinson Hyperlegible"; src: url("${fontUrl}") format("truetype"); font-weight: 400; font-style: normal; font-display: swap; }`
  document.head.appendChild(style)
}

function ensureGoogleFontStylesheet(fontId, stylesheetUrl) {
  if (!stylesheetUrl || !document.head) return
  const linkId = getGoogleFontLinkId(fontId)
  if (document.getElementById(linkId)) return
  const link = document.createElement('link')
  link.id = linkId
  link.rel = 'stylesheet'
  link.href = stylesheetUrl
  document.head.appendChild(link)
}

var template = `
  <div class="__stutter_screen"></div>
  <div class="__stutter_notice" role="status" aria-live="polite"></div>
  <span class="__stutter_scrubber_hitbox" aria-hidden="true"></span>
  <span class="__stutter_scrubber_visual" aria-hidden="true">
    <span class="__stutter_scrubber_track"></span>
    <span class="__stutter_scrubber_thumb"></span>
  </span>
  <input class="__stutter_scrubber" type="range" min="0" max="1000" value="0" aria-label="Stutter playback position">
  <span class="__stutter_scrubber_preview" aria-hidden="true"></span>
  <div class="__stutter_text">
    <span class="__stutter_pausebtn"></span>
    <span class="__stutter_drag">&#x2195;</span>
    <span class="__stutter_pause"></span>
    <span class="__stutter_options">&#x2699;</span>
    <span class="__stutter_left"></span>
    <span class="__stutter_right">
      <span class="__stutter_center"></span><span class="__stutter_remainder"></span><span class="__stutter_flanker"></span>
    </span>
    <span class="__stutter_duration">
      <span class="__stutter_duration_time"></span><span class="__stutter_duration_wpm"></span>
    </span>
    <span class="__stutter_close">&#x24e7;</span>
  </div>`

function toHHMMSS (t) {
  t = Math.round(t / 1000)
  let hours = Math.floor(t / 3600)
  let minutes = Math.floor((t - (hours * 3600)) / 60)
  let seconds = t - (hours * 3600) - (minutes * 60)

  if (hours) {
    if (hours < 10) {
      hours = '0' + hours
    }
    hours += ':'
  } else {
    hours = ''
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  minutes += ':'
  if (seconds < 10) { seconds = '0' + seconds }
  return hours + minutes + seconds
}

export default class UI extends EventEmitter {
  constructor () {
    super()
    ensureLocalAtkinsonFontFace()
    this.holder = document.createElement('div')
    this.holder.classList.add('__stutter')
    this.holder.id = '__stutter'
    // Avoids use of innerHTML
    var dom = new DOMParser().parseFromString('<template>' + template + '</template>', 'text/html').head
    this.holder.appendChild(dom.firstElementChild.content)
    this.progress = 0
    this.bindDOM()
    this.wakeLock = null
    this.currentTextFragment = ''
    document.documentElement.style.setProperty('--bgFilter', '0')
  }

  bindDOM () {
    // UI Elements
    this.text = this.holder.getElementsByClassName('__stutter_text')[0]
    this.notice = this.holder.getElementsByClassName('__stutter_notice')[0]
    this.left = this.holder.getElementsByClassName('__stutter_left')[0]
    this.center = this.holder.getElementsByClassName('__stutter_center')[0]
    this.remainder = this.holder.getElementsByClassName('__stutter_remainder')[0]
    this.flanker = this.holder.getElementsByClassName('__stutter_flanker')[0]
    this.durationTime = this.holder.getElementsByClassName('__stutter_duration_time')[0]
    this.durationWPM = this.holder.getElementsByClassName('__stutter_duration_wpm')[0]
    this.close = this.holder.getElementsByClassName('__stutter_close')[0]
    this.drag = this.holder.getElementsByClassName('__stutter_drag')[0]
    this.options = this.holder.getElementsByClassName('__stutter_options')[0]
    this.pausebtn = this.holder.getElementsByClassName('__stutter_pausebtn')[0]
    this.scrubberHitbox = this.holder.getElementsByClassName('__stutter_scrubber_hitbox')[0]
    this.scrubber = this.holder.getElementsByClassName('__stutter_scrubber')[0]
    this.scrubberPreview = this.holder.getElementsByClassName('__stutter_scrubber_preview')[0]
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onPauseToggle = this.onPauseToggle.bind(this)
    this.onOptions = this.onOptions.bind(this)
    this.onOptionsUpdate = this.onOptionsUpdate.bind(this)
    this.onKeypress = this.onKeypress.bind(this)
    this.onScrubStart = this.onScrubStart.bind(this)
    this.onScrubInput = this.onScrubInput.bind(this)
    this.onScrubEnd = this.onScrubEnd.bind(this)
    this.onScrubHitboxPointer = this.onScrubHitboxPointer.bind(this)
    this.onDocumentVisibilityChange = this.onDocumentVisibilityChange.bind(this)
    this.isScrubbing = false
    this.totalDurationMs = 0
    this.close.addEventListener('click', this.onClose)
    this.pausebtn.addEventListener('click', this.onPauseToggle)
    this.drag.addEventListener('mousedown', this.onDragStart)
    this.drag.addEventListener('ontouchstart', this.onDragStart)
    this.options.addEventListener('click', this.onOptions)
    this.scrubberHitbox.addEventListener('mousedown', this.onScrubHitboxPointer)
    this.scrubberHitbox.addEventListener('touchstart', this.onScrubHitboxPointer, { passive: false })
    this.scrubber.addEventListener('mousedown', this.onScrubStart)
    this.scrubber.addEventListener('touchstart', this.onScrubStart, { passive: true })
    this.scrubber.addEventListener('input', this.onScrubInput)
    this.scrubber.addEventListener('change', this.onScrubEnd)
    this.scrubber.addEventListener('mouseup', this.onScrubEnd)
    this.scrubber.addEventListener('touchend', this.onScrubEnd)
    this.scrubber.addEventListener('blur', this.onScrubEnd)
    this.stutterOptions = new StutterOptions()
    this.stutterOptions.addListener(StutterOptions.UPDATE, this.onOptionsUpdate)
    document.addEventListener('keydown', this.onKeypress, true)
    this.onOptionsUpdate()
  }

  onKeypress (e) {
    var keybindPauseModifier = this.stutterOptions.getProp('keybindPauseModifier')
    var keybindRestartModifier = this.stutterOptions.getProp('keybindRestartModifier')
    var keybindPreviousModifier = this.stutterOptions.getProp('keybindPreviousModifier')
    var keybindForwardModifier = this.stutterOptions.getProp('keybindForwardModifier')
    var keybindSpeedUpModifier = this.stutterOptions.getProp('keybindSpeedUpModifier')
    var keybindSpeedDownModifier = this.stutterOptions.getProp('keybindSpeedDownModifier')
    var keybindCloseModifier = this.stutterOptions.getProp('keybindCloseModifier')
    var keybindPauseKey = this.stutterOptions.getProp('keybindPauseKey')
    var keybindRestartKey = this.stutterOptions.getProp('keybindRestartKey')
    var keybindPreviousKey = this.stutterOptions.getProp('keybindPreviousKey')
    var keybindForwardKey = this.stutterOptions.getProp('keybindForwardKey')
    var keybindSpeedUpKey = this.stutterOptions.getProp('keybindSpeedUpKey')
    var keybindSpeedDownKey = this.stutterOptions.getProp('keybindSpeedDownKey')
    var keybindCloseKey = this.stutterOptions.getProp('keybindCloseKey')

    var anyModifier = ['Alt', 'OS', 'Control'].some(s => e.getModifierState(s))

    if ((keybindPauseModifier ? e.getModifierState(keybindPauseModifier) : !anyModifier) && e.key === keybindPauseKey) {
      this.onPauseToggle()
      e.preventDefault()
    } else if ((keybindRestartModifier ? e.getModifierState(keybindRestartModifier) : !anyModifier) && e.key === keybindRestartKey) {
      this.emit('restart')
      e.preventDefault()
    } else if ((keybindPreviousModifier ? e.getModifierState(keybindPreviousModifier) : !anyModifier) && e.key === keybindPreviousKey) {
      this.emit('skipPrevious')
      e.preventDefault()
    } else if ((keybindForwardModifier ? e.getModifierState(keybindForwardModifier) : !anyModifier) && e.key === keybindForwardKey) {
      this.emit('skipForward')
      e.preventDefault()
    } else if ((keybindSpeedUpModifier ? e.getModifierState(keybindSpeedUpModifier) : !anyModifier) && e.key === keybindSpeedUpKey) {
      this.stutterOptions.setProp('wpm', parseInt(this.stutterOptions.getProp('wpm'), 10) + 50)
      e.preventDefault()
    } else if ((keybindSpeedDownModifier ? e.getModifierState(keybindSpeedDownModifier) : !anyModifier) && e.key === keybindSpeedDownKey) {
      this.stutterOptions.setProp('wpm', parseInt(this.stutterOptions.getProp('wpm'), 10) - 50)
      e.preventDefault()
    } else if ((keybindCloseModifier ? e.getModifierState(keybindCloseModifier) : !anyModifier) && e.key === keybindCloseKey) {
      this.emit('close')
      e.preventDefault()
    }
  }

  static get INIT () {
    return (document.querySelector('.__stutter_text'))
  }

  get progress () {
    return this.holder.dataset.progress
  }

  set progress (val) {
    const numeric = Number(val)
    const normalized = Number.isFinite(numeric) ? Math.min(Math.max(numeric, 0), 100) : 0
    this.holder.dataset.progress = normalized
    this.holder.style.setProperty('--stutterProgress', `${normalized}%`)
    this.holder.style.setProperty('--stutterScrubberProgress', `${normalized}%`)
    if (this.scrubber && !this.isScrubbing) {
      this.scrubber.value = String(Math.round(normalized * 10))
    }
  }

  updateTime (d) {
    this.totalDurationMs = Number.isFinite(Number(d)) ? Number(d) : 0
    this.durationTime.textContent = toHHMMSS(d)
    this.durationWPM.textContent = '@' + this.stutterOptions.getProp('wpm') + 'wpm'
  }

  onDragStart (e) {
    e.preventDefault()
    e.stopPropagation()
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onDragEnd)
    document.addEventListener('touchmove', this.onTouchMove)
    document.addEventListener('touchend', this.onDragEnd)
  }

  onDragEnd () {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onDragEnd)
    document.removeEventListener('touchmove', this.onTouchMove)
    document.removeEventListener('touchend', this.onDragEnd)
  }

  onTouchMove (e) {
    e.preventDefault()
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    this.pos = e.touches[0].clientY / viewportHeight
  }

  onMouseMove (e) {
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    this.pos = e.clientY / viewportHeight
  }

  onClose (e) {
    e.stopPropagation()
    this.emit('close')
  }

  onPauseToggle () {
    this.emit('pauseToggle')
  }

  onScrubStart (e) {
    e.stopPropagation()
    if (this.isScrubbing) return
    this.isScrubbing = true
    window.addEventListener('mouseup', this.onScrubEnd)
    window.addEventListener('touchend', this.onScrubEnd)
    window.addEventListener('touchcancel', this.onScrubEnd)
    window.addEventListener('blur', this.onScrubEnd)
    document.addEventListener('visibilitychange', this.onDocumentVisibilityChange)
    this.emit('seekStart')
    this.showScrubPreview(Number(this.scrubber.value) / 1000)
  }

  onScrubHitboxPointer (e) {
    e.stopPropagation()
    if (e.cancelable) {
      e.preventDefault()
    }
  }

  onScrubInput (e) {
    e.stopPropagation()
    const value = Number(e.target.value)
    if (!Number.isFinite(value)) return
    const progress = Math.min(Math.max(value / 1000, 0), 1)
    this.holder.style.setProperty('--stutterScrubberProgress', `${progress * 100}%`)
    this.showScrubPreview(progress)
    this.emit('seek', progress)
  }

  onScrubEnd (e) {
    if (e && e.stopPropagation) e.stopPropagation()
    if (!this.isScrubbing) return
    window.removeEventListener('mouseup', this.onScrubEnd)
    window.removeEventListener('touchend', this.onScrubEnd)
    window.removeEventListener('touchcancel', this.onScrubEnd)
    window.removeEventListener('blur', this.onScrubEnd)
    document.removeEventListener('visibilitychange', this.onDocumentVisibilityChange)
    this.isScrubbing = false
    this.emit('seekEnd')
    this.hideScrubPreview()
  }

  onDocumentVisibilityChange () {
    if (document.hidden) {
      this.onScrubEnd()
    }
  }

  showScrubPreview (progress) {
    const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 1)
    const preview = Math.round(this.totalDurationMs * safeProgress)
    this.scrubberPreview.textContent = toHHMMSS(preview)
    this.scrubberPreview.style.left = `${safeProgress * 100}%`
    this.scrubberPreview.classList.add('__stutter_scrubber_preview_visible')
  }

  hideScrubPreview () {
    this.scrubberPreview.classList.remove('__stutter_scrubber_preview_visible')
  }

  onOptions (e) {
    e.stopPropagation()
    this.emit('pause')
    browser.runtime.sendMessage({
      'functiontoInvoke': 'openSettings'
    })
  }

  onOptionsUpdate () {
    ensureLocalAtkinsonFontFace()
    const selectedFont = this.stutterOptions.getProp('fontFamily') || DEFAULT_FONT_ID
    this.holder.style.setProperty('--stutterFontFamily', getFontFamilyStack(selectedFont))
    ensureGoogleFontStylesheet(selectedFont, getFontStylesheet(selectedFont))

    if (this.stutterOptions.getProp('pos')) {
      this.holder.style.top = (this.stutterOptions.getProp('pos') * 100) + 'vh'
    }

    let theme = this.stutterOptions.getProp('theme')
    Array.from(this.holder.classList).map(themeClass => {
      if (/^theme-/.test(themeClass)) {
        if (theme !== 'theme-' + theme) {
          this.holder.classList.remove(themeClass)
        }
      }
    })
    this.holder.classList.add('theme-' + theme)
    if (this.stutterOptions.getProp('bgBlur')) {
      document.documentElement.style.setProperty('--bgFilter', '4px')
    } else {
      document.documentElement.style.setProperty('--bgFilter', '0')
    }
  }

  pause () {
    this.holder.classList.add('__stutter_paused')
  }

  resume () {
    this.holder.classList.remove('__stutter_paused')
  }

  show (word, nextword = null) {
    this.clearNotice()
    this.left.textContent = word.val.substr(0, word.index)
    this.center.textContent = word.val.substr(word.index, 1)
    this.remainder.textContent = word.val.substr(word.index + 1)

    if (this.stutterOptions.getProp('showFlankers') && nextword) {
      this.flanker.textContent = ' ' + nextword.val
    } else {
      this.flanker.textContent = ''
    }
  }

  hide () {
    if (this.holder.parentNode) {
      this.holder.parentNode.removeChild(this.holder)
      if (this.wakeLock) {
        this.wakeLock.release().then(() => { this.wakeLock = null })
      }
    }
  }

  async reveal () {
    if (!this.holder.parentNode) {
      document.body.insertBefore(this.holder, document.body.childNodes[0])

      // prevent screen timeout when stutter runs if supported
      if ('wakeLock' in navigator) {
        try {
          this.wakeLock = await navigator.wakeLock.request('screen')
        } catch (_) {}
      }
    }
  }

  async showNotice (message) {
    await this.reveal()
    this.notice.textContent = message
    this.holder.classList.add('__stutter_notice_visible')
  }

  clearNotice () {
    this.notice.textContent = ''
    this.holder.classList.remove('__stutter_notice_visible')
  }

  get pos () {
    let stutterTop = this.holder.getBoundingClientRect().top
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    return stutterTop / viewportHeight
  }

  set pos (val) {
    this.stutterOptions.setProp('pos', val)
  }
}
