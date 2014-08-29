/*
 * Pix
 * http://eadpucv.github.io/pix/
 *
 * Copyright (c) 2014 Herbert Spencer
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.Pix = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.Pix = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.Pix.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.Pix.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].Pix = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
