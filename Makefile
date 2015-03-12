
.PHONY: css
.PHONY: less

install:
	bower install

less: 
	lessc less/style.less > css/style.css 

css:
	lessc less/style.less css/style.css --clean-css

server:
	jekyll server --watch --baseurl= --trace

cp_js:
	cp bower_components/bootstrap/dist/js/bootstrap.min.js js
	cp bower_components/jquery/dist/jquery.min.js js
	cp bower_components/handlebars/handlebars.min.js js

dist:
	make cp_js
	cp -R bower_components/pixograms/fonts .
	cp bower_components/pixograms/css/pix-webfont.css css
	make css
