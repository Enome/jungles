test:
	@NODE_ENV=test mocha $(shell find . -type d -name "specs" | xargs -IDIR find DIR -name '*.js') -r should
