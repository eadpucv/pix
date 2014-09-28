
.PHONY: css

install:
	bower install
	
css:
	lessc less/style.less css/style.css --clean-css
	lessc fonts/pix-font.less fonts/pix-font.css

server:
	jekyll server --watch --baseurl= --trace

zip-icons:
	zip -r -X downloads/icons.zip icons

dist:
	cp bower_components/bootstrap/dist/js/bootstrap.min.js js
	cp bower_components/jquery/dist/jquery.min.js js
	grunt webfont
	lessc less/style.less css/style.css --clean-css
	lessc fonts/pix-font.less fonts/pix-font.css
	make zip-icons