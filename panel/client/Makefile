build: components index.js stylus
	@component build --dev -v

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

stylus:
	stylus locals/jungles-panel-core/styles/stylus/general.styl -o locals/jungles-panel-core/styles/css

.PHONY: clean
