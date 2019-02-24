# stutter ![status](https://travis-ci.com/jamestomasino/stutter.svg?branch=master) ![license](https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square)

<a href="https://addons.mozilla.org/en-US/firefox/addon/stutter/"><img src="./icons/stutter.svg" width="100"></a>

**stutter** _(noun)_

1. Distorted speech characterized principally by blocks or spasms interrupting the rhythm.

2. A [Rapid Serial Visual Presentation](https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation) (RSVP) extension for modern web browsers. It is based upon my initial work in a Google Chrome extension, [read](https://github.com/jamestomasino/read_plugin). This is an attempt to modernize the code and offer cross-browser support.

[Get the FF Extension](https://addons.mozilla.org/en-US/firefox/addon/stutter/)

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

## TODO

- [x] Verify ES6 support for web extensions (with babel)
- [x] Client-side full-page parsing for readable content (like old Readability API)
- [x] Create selection context-menu as trigger
- [x] Pass selection data to RSVP processor
- [x] Create data structures for calculation of display sequence
- [x] Create on-screen display for RSVP
- [x] Options for speed personalization
- [x] Saving of personalization settings
- [x] Progress display
- [x] Chrome plugin support
- [ ] Mobile support in Firefox Android
- [ ] Light theme with toggle in settings
- [ ] Seek-bar / rewind
- [ ] Syncing of personalization settings through browser sync
- [ ] Sliders or other better UI in settings
- [ ] Custom colorschemes in settings

## 3rd Party Runtime Libraries

Full page content is analyzed and isolated by means of the [Mozilla Readability Library](https://github.com/mozilla/readability). The version in this project is modified for linting and exported as an es6 module. No changes have been made to the library logic.

[babel-polyfill](https://babeljs.io/docs/en/babel-polyfill) is used during runtime to emulate a full ES2015+ where a browser may be insufficient.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

[GPL3](LICENSE)

Mozilla's Readability library - http://www.apache.org/licenses/LICENSE-2.0
