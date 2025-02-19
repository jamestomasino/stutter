/* global browser */
if (typeof browser === 'undefined') {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome /* eslint-disable-line no-undef */
}

try {
  browser.action.onClicked.addListener(async (tab) => {
    await browser.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['/dist-content/index.js'],
    })
    const response = await browser.tabs.sendMessage(tab.id, {
      functiontoInvoke: 'stutterFullPage'
    })
    console.log(response)
  })

  browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.functiontoInvoke) {
      case 'openSettings':
        browser.runtime.openOptionsPage()
        break
    }
  })

  browser.contextMenus.create({
    id: 'stutterSelection',
    title: 'Stutter Selection',
    contexts: ['selection']
  })

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    const { menuItemId } = info

    if (menuItemId === 'stutterSelection') {
      await browser.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['/dist-content/index.js'],
      })
      const response = await browser.tabs.sendMessage(tab.id, {
        functiontoInvoke: 'stutterSelectedText',
        selectedText: info.selectionText
      })
      console.log(response)
    }
  })

  browser.commands.onCommand.addListener((command) => {
    console.log(`Command: ${command}`)
  })
} catch (e) {
  console.warn(e)
}
