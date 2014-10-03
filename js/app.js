var pix_icons =[
	{text: "think", id:"pix-think"},
	{text: "cube", id:"pix-cube"},
	{text: "mouse", id:"pix-mouse"},
	{text: "plus", id:"pix-plus"},
	{text: "read", id: "pix-read"},
	{text: "reload", id:"pix-reload"},
	{text: "keyboard", id:"pix-keyboard"},
	{text: "click-left", id:"pix-click-left"},
	{text: "click-center", id:"pix-click-center"},
	//{text: "keyboard type", id:"keyboard-type"},
	{text: "top left", id:"stack-top-left"},
	{text: "circle-dashed", id:"pix-circle-dashed"},
	{text: "square-dashed", id:"pix-square-dashed"}
];
var pixObject = {
	currentObject: null,
	getCurrent : function() {
		return this.currentObject;
	},
	setCurrent : function(obj) {
		this.currentObject = obj;
	}
};
;(function ( $ ) {
	$.fn.addScore= function(){
		var pix_layout = $('#layout-score').html();
		var step_template = $('#pix-step').html();
		var step_compile = Handlebars.compile(step_template);
		var template = Handlebars.compile(pix_layout);
		var context = {step: step_compile};
		var html = template(context);
		$(this).append(html);
		$('.pix-input').bind('keypress',function(event){
			$(this).checkText($(this).text(), event);
		});
		$('.fly-link').bind('click',function(event){
				$(this).flyLink(event);
		});
		return false;
	}
	$.fn.flyLink = function(){
		var href = $(this).attr('href').replace('#','');
		console.log(href);
		if (href == 'split-toggle') {
			var split = $(this).parent();
			if (split.hasClass('split')) {
				split.removeClass('split');
				$(this).text('Split score');
			} else {
				split.addClass('split');
				$(this).text('Unsplit score');
			}

		}
		if (href == 'add-note') {
			console.log($(this).prev().find('.input-note'));
			var note = $(this).prev().find('.input-note');
			if (note.is(':visible')) {
				note.hide();
				$(this).text('Add note');
			} else {
				note.show();
				note.text('');
				$(this).text('Delete note');
			}
		}
		return false;
	}
	$.fn.checkText = function(str, event) {
		//console.log(str);
		// $('.pix-replace').val(str);
		// grep = '';
		// regex = new RegExp(str,"g");
		// var grep = $.grep(pix_icons,function(n,i){
		// 	//console.log(n.text);
		// 	//return n.text.match(regex); //regex que busca asociados... para el autocomplete
		// 	return n.text===str;
		// });
		// //console.log(grep);
		// if (grep.length == 1) {
		// 	$('.pix-code').html(str.replace(regex,'<span class="pix-stack"><i class="pix '+grep.pop().id+'"></span>'));
		// }
		this.addNode = function(context) {
			// var li = $('<li>').attr({class: 'pix-step col-sm-1 col-xs-3'});
			// var fly_top = $('<a>').attr({href: '#split-toggle', class: 'fly-link top'}).text('Split score');
			// var ul = $('<ul>');
			// var block_user = $('<li>').attr({class: 'block block-user'}).append($('<input>').attr({class: 'pix-input input-user',type: 'text', placeholder: 'type here...'}));
			// var block_dialogue = $('<li>').attr({class: 'block block-dialogue'}).append($('<input>').attr({class: 'pix-input input-dialogue',type: 'text', placeholder: 'type here...'}));
			// var block_system = $('<li>').attr({class: 'block block-system'}).append($('<input>').attr({class: 'pix-input input-system',type: 'text', placeholder: 'type here...'}));
			// var note = $('<div>').attr({class: 'note'}).append($('<input>').attr({class: 'pix-input input-note',type: 'text', placeholder: 'type here...'}));
			// var fly_bottom = $('<a>').attr({href: '#add-note', class: 'fly-link bottom'}).text('Add note');
			// ul.append(block_user).append(block_dialogue).append(block_system);
			//var column = li.append(fly_top).append(ul).append(fly_bottom);
			var step_template = $('#pix-step').html();
			var column = Handlebars.compile(step_template);

			$(context).append(column).find('.pix-step').last().find('.pix-input').first().focus();
			$('.pix-input').bind('keypress',function(event){
				$(this).checkText($(this).text(), event);
			});
			$('.fly-link').bind('click',function(event){
				$(this).flyLink();
			});
		}
		var that = this;
		if (event.keyCode == 9) {
			//next tab
			event.preventDefault();
			var next = $(this).parent().next().find('.pix-input');
			// console.log('NEXT');
			// console.log(next);
			if (next.length == 0) {
				console.log($(this).offsetParent());
				console.log('ALT NEXT');
				var alt_next = $(this).offsetParent().next().find('.pix-input').first();
				console.log(alt_next);
				if (alt_next.length == 0) {
					console.log($(this).offsetParent().parent());
					that.addNode($(this).offsetParent().parent());
				} else {
					alt_next.focus().select();
				}
			} else {
				next.focus().select();
			}
			return false;
		}
	};
}(jQuery));

jQuery(document).ready(function($){
	var pix_layout = $('#layout-score').html();
	var step_template = $('#pix-step').html();
	var step_compile = Handlebars.compile(step_template);
	var template = Handlebars.compile(pix_layout);
	var context = {step: step_compile};
	var html = template(context);
	$('#pix-template').html(html);

	$('.pix-input').bind('keypress',function(event){
		$(this).checkText($(this).text(), event);
	});
	$('.fly-link').bind('click',function(event){
			$(this).flyLink(event);
	});
	$('#add-new').bind('click',function(event){
		$('#pix-template').addScore();
	});
});