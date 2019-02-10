/* global browser */
import './main.scss'

/* TODO: storage changes do not publish events.
 * we must fire a message to inform the rest of the
 * extension when setting changes have been made.
 */

var options = {
  wpm: 700,
  slowStartCount: 5,
  sentenceDelay: 2.5,
  otherPuncDelay: 1.5,
  shortWordDelay: 1.3,
  longWordDelay: 1.4
}

document.addEventListener('DOMContentLoaded', () => {
  browser.storage.sync.get('stutterOptions').then(result => {
    if (result.stutterOptions) {
      for (let key in options) {
        document.getElementById(key).value = result.stutterOptions[key] || options[key]
      }
    }
  },
  error => {
    console.log(`Error: ${error}`)
  })

  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    for (let key in options) {
      options[key] = document.getElementById(key).value
    }
    browser.storage.sync.set({
      stutterOptions: options
    })
  })
})
