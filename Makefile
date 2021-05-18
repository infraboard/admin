.PHONY: all dep lint vet test test-coverage build clean

all: push

push: ## Get the dependencies
	@git push -u gitee
	@git push -u origin

help: ## Display this help screen
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
