var browser = require('webextension-polyfill')

function onContextClick (info) {
  let q = browser.tabs.query({
    'active': true,
    'currentWindow': true
  })
  q.then(tabs => {
    browser.tabs.executeScript({ file: '/dist-content/index.js' })
      .then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          'functiontoInvoke': 'stutterSelectedText',
          'selectedText': info.selectionText,
          'locale': browser.i18n.getUILanguage()
        })
      })
      .catch(e => {
        console.log('Error:', e)
      })
  })
}

function onIconClick () {
  let q = browser.tabs.query({
    'active': true,
    'currentWindow': true
  })
  q.then(tabs => {
    q.stutter = true
    browser.tabs.executeScript({ file: '/dist-content/index.js' })
      .then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          'functiontoInvoke': 'stutterFullPage',
          'locale': browser.i18n.getUILanguage()
        })
      })
      .catch(e => {
        console.log('Error:', e)
      })
  })
}

function onMessage (request) {
  switch (request.functiontoInvoke) {
    case 'openSettings':
      browser.runtime.openOptionsPage()
      break
  }
}

// Handle clicking on the browser icon
if (browser.browserAction) {
  browser.browserAction.onClicked.addListener(onIconClick)
}

// Handle messages from UI
if (browser.runtime) {
  browser.runtime.onMessage.addListener(onMessage)
}

// Context menu "Stutter Selection" option
if (browser.contextMenus) {
  browser.contextMenus.create({
    'title': 'Stutter Selection',
    'contexts': ['selection'],
    'onclick': onContextClick
  })
}
