/* global browser */

function onContextClick (info) {
  console.log('onContextClick')
  browser.tabs.query({
    'active': true,
    'currentWindow': true
  }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
      'functiontoInvoke': 'stutterSelectedText',
      'selectedText': info.selectionText
    })
  })
}

function onIconClick () {
  console.log('onIconClick')
  browser.tabs.query({
    'active': true,
    'currentWindow': true
  }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
      'functiontoInvoke': 'stutterFullPage'
    })
  })
}

// Write this in an expandable way in case we want to move beyond selection
var contexts = ['selection']
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i]
  var title = 'Stutter Selection'
  browser.contextMenus.create({
    'title': title,
    'contexts': [context],
    'onclick': onContextClick
  })
}

// Handle clicking on the browser icon
browser.browserAction.onClicked.addListener(onIconClick)
