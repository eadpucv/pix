
.PHONY: less
.PHONY: css

install:
	bower install

less:
	lessc less/pix.less css/pix.css --clean-css
	
css:
	lessc less/pix.less css/pix.css --clean-css

server:
	jekyll server --watch --baseurl= --trace

dist:
	cp bower_components/bootstrap/dist/js/bootstrap.min.js js
	cp bower_components/jquery/dist/jquery.min.js js