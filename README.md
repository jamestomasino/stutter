# stutter ![status](https://travis-ci.com/jamestomasino/stutter.svg?branch=master) ![license](https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square)

<img src="./icons/stutter.svg" width="100">

**stutter** _(noun)_

1. Distorted speech characterized principally by blocks or spasms interrupting the rhythm.

2. A [Rapid Serial Visual Presentation](https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation) (RSVP) extension for modern web browsers. It is based upon my initial work in a Google Chrome extension, [read](https://github.com/jamestomasino/read_plugin). This is an attempt to modernize the code and offer cross-browser support.

## Install and Testing

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

This extension will require work to catch up to the functionality of my previous one. I'll start by creating a minimum viable product (MVP) via the following:

- [x] Verify ES6 support for web extensions

Required the addition of webpack and babel to transpile. Browser support for all the necessary package loading is not in place natively yet.

- [x] Client-side full-page parsing for readable content (like old Readability API)

Mozilla exposed their Readability library on github. It is not a very friendly node module, but the raw source of the core library was enough for this project. It has been incorporated and is described in the 3rd Party Runtime Libraries section below.

- [x] Create selection context-menu as trigger

The Chrome API was slightly different, but this was an easy fix.

- [x] Pass selection data to RSVP processor
- [x] Create data structures for calculation of display sequence

Data processes and outputs in the console in real-time.

- [x] Create on-screen display for RSVP
- [x] Options for speed personalization
- [x] Saving of personalization settings

Areas to explore after the MVP is completed:

- [ ] Progress display
- [ ] Seek-bar
- [ ] Syncing of personalization settings through browser sync

## 3rd Party Runtime Libraries

Full page content is analyzed and isolated by means of the [Mozilla Readability Library](https://github.com/mozilla/readability). The version in this project is modified for linting and exported as an es6 module. No changes have been made to the library logic.

[babel-polyfill](https://babeljs.io/docs/en/babel-polyfill) is used during runtime to emulate a full ES2015+ where a browser may be insufficient.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

[GPL3](LICENSE)

Mozilla's Readability library - http://www.apache.org/licenses/LICENSE-2.0
