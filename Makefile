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
	npm run build

package: build ## package for upload
	$(WEBEXT) build --overwrite-dest
	git archive --format zip --output "./web-ext-artifacts/$(current_dir)-$(VERSION)-src.zip" master

test: ## web extension tests
	npm run webext-test

serve: ## launch test browser
	npm run extension

.PHONY: help build package test serve

