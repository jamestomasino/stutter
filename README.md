# stutter ![status](https://travis-ci.com/jamestomasino/stutter.svg?branch=master) ![GitHub](https://img.shields.io/github/license/jamestomasino/stutter.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/a4d5b54b3cf91c6a2b3e/maintainability)](https://codeclimate.com/github/jamestomasino/stutter/maintainability)

[![Firefox Get Extension](https://img.shields.io/badge/Firefox-Get%20Extension!-lightgrey.svg?style=popout&logo=mozilla-firefox)](https://addons.mozilla.org/en-US/firefox/addon/stutter/) [![Chrome Get Extension](https://img.shields.io/badge/Chrome-Get%20Extension!-lightgrey.svg?style=popout&logo=google-chrome)](https://chrome.google.com/webstore/detail/stutter/fbapmaboedchhgjolcnpfgoanbfajchl)

<a href="https://addons.mozilla.org/en-US/firefox/addon/stutter/"><img src="./icons/stutter.svg" width="100"></a>

**stutter** _(noun)_

1. Distorted speech characterized principally by blocks or spasms interrupting the rhythm.

2. A [Rapid Serial Visual Presentation](https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation) (RSVP) extension for modern web browsers. It is based upon my initial work in a Google Chrome extension, [read](https://github.com/jamestomasino/read_plugin). This is an attempt to modernize the code and offer cross-browser support.

[![stutter demonstration](https://i.imgur.com/hGocwaV.png)](https://www.youtube.com/watch?v=UJwFdPYbRRg)

## Usage

You can begin running Stutter in one of three ways:

1. Click on the <img src="./icons/stutter.svg" width="16"> icon in the browser to start _Stuttering_. If you have text selected, it will use this as the content to Stutter, otherwise the entire page will be used.
2. Press `Alt+R` to trigger Stutter by hotkey.
3. Select text you'd like to Stutter and then right-click and choose "Stutter Selection".

When Stutter is running, you can use the following hotkeys for control:

- `Alt-R` - Restart Stutter
- `Alt+P` - Pause/Resume
- `Alt+Left` - Skip backwards
- `Alt+Right` - Skip forwards
- `Alt+Up` - Increase WPM by 50
- `Alt+Down` - Decrease WPM by 50
- `Esc` - Close Stutter

You can reposition the Stutter interface on the screen by dragging the handle on the left hand side. Stutter will remember its position in the future.

Many other timing options and theming are available inside the full settings panel. Click on the gear icon on the left while Stutter is running to change these settings. **Note:** You must have allowed the storage permission in order to change these default settings.

## Source Install and Testing

**stutter** is built using webpack and babel, with sass support and eslint styling. The code is written using es6 classes. Backend and content-scripts are maintained separately with individual webpack configurations.

To install all dependencies:

    $ yarn

To build the project:

    $ yarn build

To lint the source:

    $ yarn test

To lint the extension configuration (_must build first_):

    $ yarn webext-test

To locally test the extension in Firefox:

    $ yarn extension

To package the extension for production:

    $ yarn package

## Permissions

This extension uses several permissions allowed by the web extensions API.

### contextMenus

Stutter allows you to read selected text by highlighting content and right-clicking to view the context menu option. This permission allows us to add the Stutter option to the context menu.

### activeTab

This permission allows the extension to inject the content script code into the browser tab when an action takes place, like clicking on the extension icon. It provides a limited access to the tab that's active when triggered.

### storage

Options in the settings page are stored in browser storage by using this permission. These settings persist between browser restarts.

**Note:** Stutter settings will sync between browsers if you have browser sync enabled and the storage permission allowed.

## 3rd Party Runtime Libraries

Full page content is analyzed and isolated by means of the [Mozilla Readability Library](https://github.com/mozilla/readability). The version in this project is modified for linting and exported as an es6 module. One change was made from using `innerHTML` to using `DOMParser` for security. No other changes have been made to the library logic.

[babel-polyfill](https://babeljs.io/docs/en/babel-polyfill) is used during runtime to emulate a full ES2015+ where a browser may be insufficient.

## Getting Help

You can leave feedback using GitHub issues. If you would like to discuss problems or features with me directly, you can visit the [#stutter IRC channel on Freenode](https://kiwiirc.com/nextclient/#irc://irc.freenode.net/#stutter).

## Contributing

### General Guidelines

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

### Themes

You can preview the default themes in the [appropriate folder](https://github.com/jamestomasino/stutter/wiki). If you want to add your own, it's easy and requires only three additions to the code-base:

1. Add a new scss file in `src-content/themes/` that begins with an underscore and is named for your theme, such as `src-content/themes/_yourtheme.scss`. Copy the `_default.scss` file as a starting point and change the colors to your heart's desire. The first line of your scss file should be formatted like so (see other themes as examples):

    #__stutter.theme-**yourtheme** {

2. Add a your theme to the themes list by appending `@import "yourtheme"` to `src-content/themes/_themes.scss`.

3. Add your theme's name to the select box in the options page located at `src-options/index.html`

That's it! Pick a descriptive name and send a pull request!

### Locale Support

Stutter uses a number of strategies to logically break up long words into smaller pieces for easy reading. Part of this strategy is identifying common prefixes and suffixes in the language to find good places to break the word. If you would like to submit support for a new language you can edit the `src-content/lib/locales.json` file.

For reference, these are the rules for English:

```json
{
  "en": {
    "wordRegex": "([^\\s/]+|[\\r\\n]+)",
    "puncSplit": "(.+?\\.|.*?,)([a-z].+\\b)",
    "presuf": "^(\\W*)(anti|auto|ab|an|ax|al|as|bi|bet|be|contra|cat|cath|cir|cum|cog|col|com|con|cor|could|co|desk|de|dis|did|dif|di|eas|every|ever|extra|ex|end|en|em|epi|evi|func|fund|fin|hyst|hy|han|il|in|im|ir|just|jus|loc|lig|lit|li|mech|manu|man|mal|mis|mid|mono|multi|mem|micro|non|nano|ob|oc|of|opt|op|over|para|per|post|pre|peo|pro|retro|rea|re|rhy|should|some|semi|sen|sol|sub|suc|suf|super|sup|sur|sus|syn|sym|syl|tech|trans|tri|typo|type|uni|un|van|vert|with|would|won)?(.*?)(weens?|widths?|icals?|ables?|ings?|tions?|ions?|ies|isms?|ists?|ful|ness|ments?|ly|ify|ize|ise|ity|en|ers?|ences?|tures?|ples?|als?|phy|puts?|phies|ry|ries|cy|cies|mums?|ous|cents?)?(\\W*)$"
  },
}
```

- **wordRegex** - this regular expression is responsible for separating the body of text into component words.
- **puncSplit** - this regular expression is run on each word group output from wordRegex. It attempts to break apart any lingering words that might be accidentally joined together on a period or comma. It is careful not to split numbers or short period-separated words like A.M. or P.M.
- **prsuf** - this is a list of regular prefixes and suffixes that can be used to break apart long words into component parts. These need to be sorted with the longest parts first to avoid matching a smaller prefix when its part of a longer one.

The font in use for the site is Arial, which should have good support for displaying most languages. There is currently no support for RTL languages, though it is on the road-map.

## License

[GPL3](LICENSE)

Mozilla's Readability library - http://www.apache.org/licenses/LICENSE-2.0
