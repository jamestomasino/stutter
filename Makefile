NODE_MODULES ?= node_modules

VERSION:=$(shell git describe --abbrev=0 --always --match v*)
mkfile_path:=$(abspath $(lastword $(MAKEFILE_LIST)))
current_dir:=$(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

WEBEXT := $(NODE_MODULES)/.bin/web-ext

help:
	@echo "targets:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sed -n 's/^\(.*\): \(.*\)##\(.*\)/  \1|\3/p' \
	| column -t  -s '|'

build: ## build project
	npm run build:firefox

package: build ## package for upload
	npm run package:all

package-chrome: ## package for Chrome upload
	npm run package:chrome

package-firefox: ## package for Firefox upload
	npm run package:firefox

package-edge: ## package for Edge upload
	npm run package:edge

test: ## web extension tests
	npm run webext-test

serve: ## launch test browser
	npm run extension

serve-chromium: ## launch test browser (Chromium)
	npm run extension:chromium

.PHONY: help build package package-chrome package-firefox package-edge test serve serve-chromium
