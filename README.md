# stutter ![status](https://travis-ci.com/jamestomasino/stutter.svg?branch=master) ![license](https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square)

**stutter** _(noun)_

1. Distorted speech characterized principally by blocks or spasms interrupting the rhythm.

2. A [Rapid Serial Visual Presentation](https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation) (RSVP) extension for modern web browsers. It is based upon my initial work in a Google Chrome extension, [read](https://github.com/jamestomasino/read_plugin). This is an attempt to modernize the code and offer cross-browser support.

## TODO

This extension will require work to catch up to the functionality of my previous one. I'll start by creating a minimum viable product (MVP) via the following:

- [x] Verify ES6 support for web extensions

Required the addition of webpack and babel to transpile. Browser support for all the necessary package loading is not in place natively yet.

- [ ] Create selection context-menu as trigger
- [ ] Pass selection data to RSVP processor
- [ ] Create data structures for calculation of display sequence
- [ ] Create on-screen display for RSVP

Areas to explore after the MVP is completed:

- [ ] Progress display
- [ ] Seek-bar
- [ ] Options for speed personalization
- [ ] Saving of personalization settings
- [ ] Syncing of personalization settings through browser sync
- [ ] Client-side full-page parsing for readable content (like old Readability API)

## 3rd Party Runtime Libraries

Full page content is analyzed and isolated by means of the [Mozilla Readability Library](https://github.com/mozilla/readability). The version in this project is modified for linting and exported as an es6 module.

[babel-polyfill](https://babeljs.io/docs/en/babel-polyfill) is used during runtime to emulate a full ES2015+ where a browser may be insufficient.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License
[GPL3](LICENSE)
