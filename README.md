# stutter ![GitHub](https://img.shields.io/github/license/jamestomasino/stutter.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/a4d5b54b3cf91c6a2b3e/maintainability)](https://codeclimate.com/github/jamestomasino/stutter/maintainability)

<a href="https://addons.mozilla.org/en-US/firefox/addon/stutter/"><img src="./icons/stutter.svg" width="100"></a>

Table of contents
=================

<!--ts-->
   * [About Stutter](#about-stutter)
   * [Installation](#installation)
   * [Usage](#usage)
   * [Getting Help](#getting-help)
   * [Contributing](#contributing)
   * [Research](#research)
   * [Privacy Policy](#privacy-policy)
   * [License](#license)
<!--te-->

## About Stutter

**stutter**

Stutter is a [Rapid Serial Visual Presentation](https://en.wikipedia.org/wiki/Rapid_serial_visual_presentation) (RSVP) extension for modern web browsers. RSVP is a way to read faster with less eye movement.

[See a Stutter demonstration here.](https://www.youtube.com/watch?v=TKgZAOQctzo)

Stutter supports full internationalization for basic usage. Long word
hyphenization is supported in 40+ languages.

## Installation

* [![Firefox Get Extension](https://img.shields.io/badge/Firefox-Get%20Extension!-lightgrey.svg?style=popout&logo=mozilla-firefox)](https://addons.mozilla.org/en-US/firefox/addon/stutter/)
* [![Chrome Get Extension](https://img.shields.io/badge/Chrome-Get%20Extension!-lightgrey.svg?style=popout&logo=google-chrome)](https://chrome.google.com/webstore/detail/stutter/fbapmaboedchhgjolcnpfgoanbfajchl)
* [![Edge Get Extension](https://img.shields.io/badge/Edge-Get%20Extension!-lightgrey.svg?style=popout&logo=microsoft-edge)](https://microsoftedge.microsoft.com/addons/detail/stutter/aonlnjdopgkofbgipdnfdclfpaindajj)

[![stutter demonstration](https://i.ytimg.com/vi_webp/TKgZAOQctzo/maxresdefault.webp)](https://www.youtube.com/watch?v=TKgZAOQctzo)

## Usage

You can begin running Stutter in one of three ways:

1. Click on the <img src="./icons/stutter.svg" width="16"> icon in the browser to start _Stuttering_. If you have text selected, it will use this as the content to Stutter, otherwise the entire page will be used.
2. Press `Alt+R` to trigger Stutter by hotkey.
3. Select text you'd like to Stutter and then right-click and choose "Stutter Selection".

When Stutter is running, you can use the following hotkeys for control:

- `Alt+R` - Restart Stutter
- `Alt+P` - Pause/Resume
- `Alt+Left` - Skip backwards
- `Alt+Right` - Skip forwards
- `Alt+Up` - Increase WPM by 50
- `Alt+Down` - Decrease WPM by 50
- `Esc` - Close Stutter

You can reposition the Stutter interface on the screen by dragging the handle on the left hand side. Stutter will remember its position in the future.

Many other timing options and theming are available inside the full settings panel. Click on the gear icon on the left while Stutter is running to change these settings. **Note:** You must have allowed the storage permission in order to change these default settings.

## Getting Help

You can leave feedback using [GitHub issues](https://github.com/jamestomasino/stutter/issues). If you would like to discuss problems or features with me directly, you can visit the [#stutter IRC channel on Libera.Chat](https://kiwiirc.com/nextclient/#irc://irc.libera.chat/#stutter).

## Contributing

This is an open source project and we welcome contributions. See the [Wiki](https://github.com/jamestomasino/stutter/wiki) for ways to contribute:

- [Install from Source](https://github.com/jamestomasino/stutter/wiki/Install)
- [Themes](https://github.com/jamestomasino/stutter/wiki/Themes)
- [Third Party Libraries](https://github.com/jamestomasino/stutter/wiki/ThirdParty)
- [Browser Permissions](https://github.com/jamestomasino/stutter/wiki/Permissions)

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

### Development

Manifest generation is browser-aware:

- `manifest.base.json` contains shared MV3 fields.
- `manifest.overrides/firefox.json` contains Firefox-only settings.
- `manifest.json` is generated for a target browser by `scripts/build-manifest.cjs`.
- Manifest `version` is generated from `package.json`; if `HEAD` is exactly tagged as `v*`, that tag version is used.

Useful commands:

- `npm run build:chrome`
- `npm run build:firefox`
- `npm run build:edge`
- `npm run package:chrome`
- `npm run package:firefox`
- `npm run package:edge`
- `npm run package:all`

Protected-branch release workflow:

1. Create a release branch from latest `master`:
   - `git checkout master && git pull --ff-only`
   - `git checkout -b release/vNEXT`
2. Prepare the version bump and release commit on that branch:
   - `npm run release:prepare:minor` (or `:patch` / `:major`)
3. Open PR and merge after required checks pass:
   - `git push -u origin release/vNEXT`
   - `gh pr create --base master --head release/vNEXT --fill`
4. After merge, tag from up-to-date `master` and push tag:
   - `git checkout master && git pull --ff-only`
   - `npm run release:tag:push`
5. The tag push triggers GitHub Actions to publish browser ZIPs and source ZIP.

## Research

[Read some of the research](https://github.com/jamestomasino/stutter/wiki/Research) that influences Stutter.

## Privacy Policy

This browser extension collects no user data. Nothing about your usage is stored or transferred to any server. It can be used offline.

## License

[GPL3](LICENSE)

Mozilla's Readability library - http://www.apache.org/licenses/LICENSE-2.0
