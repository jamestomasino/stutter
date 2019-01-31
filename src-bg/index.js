/*
const browser = window.msBrowser || window.browser || window.chrome

function onContextCLick (info) {
  browser.tabs.query({
    'active': true,
    'currentWindow': true
  }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
      'functiontoInvoke': 'readSelectedText',
      'selectedText': info.selectionText
    })
  })
}

function onIconClick () {
  browser.tabs.query({
    'active': true,
    'currentWindow': true
  }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
      'functiontoInvoke': 'readFullPage'
    })
  })
}

// Write this in an expandable way in case we want to move beyond selection
var contexts = ['selection']
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i]
  var title = 'Read Selected Text'
  browser.contextMenus.create({
    'title': title,
    'contexts': [context],
    'onclick': onContextCLick
  })
}

// Handle clicking on the browser icon
browser.browserAction.onClicked.addListener(() => { onIconClick() })
*/
