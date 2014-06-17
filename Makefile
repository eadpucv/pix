
.PHONY: less

install:
	bower install

less:
	lessc less/pix.less css/pix.css --clean-css
	
css:
	less

server:
	jekyll server --watch --baseurl= --trace

dist:
	cp bower_components/bootstrap/dist/js/bootstrap.min.js js
	cp bower_components/jquery/dist/jquery.min.js js