
.PHONY: less

install:
	bower install

less:
	lessc less/is.less css/is.css --clean-css

css:
	less

server:
	jekyll server --watch --baseurl= --trace

dist:
	less
	cp -R bower_components/font-awesome/fonts .
	cp bower_components/bootstrap/dist/js/bootstrap.min.js js
	cp bower_components/jquery/dist/jquery.min.js js