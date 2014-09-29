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
		this.addNode = function() {
			var li = $('<li>').attr({class: 'pix-step col-sm-1 col-xs-3'});
			var ul = $('<ul>');
			var block_user = $('<li>').attr({class: 'block block-user'}).append($('<input>').attr({class: 'pix-input input-user',type: 'text', placeholder: 'type here...'}));
			var block_dialogue = $('<li>').attr({class: 'block block-dialogue'}).append($('<input>').attr({class: 'pix-input input-dialogue',type: 'text', placeholder: 'type here...'}));
			var block_system = $('<li>').attr({class: 'block block-system'}).append($('<input>').attr({class: 'pix-input input-system',type: 'text', placeholder: 'type here...'}));
			var note = $('<div>').attr({class: 'note'}).append($('<input>').attr({class: 'pix-input input-note',type: 'text', placeholder: 'type here...'}));
			ul.append(block_user).append(block_dialogue).append(block_system).append(note);
			var column = li.prepend(ul);

			$('.pix-steps').append(column).find('.pix-step').last().find('.pix-input').first().focus();
			$('.pix-input').bind('keypress',function(event){
				$(this).checkText($(this).text(), event);
			});
		}
		var that = this;
		console.log(event);
		if (event.keyCode == 9) {
			//next tab
			event.preventDefault();
			var next = $(this).parent().next().find('.pix-input');
			console.log('NEXT');
			console.log(next);
			if (next.length == 0) {
				console.log($(this).offsetParent());
				console.log('ALT NEXT');
				var alt_next = $(this).offsetParent().next().find('.pix-input').first();
				console.log(alt_next);
				if (alt_next.length == 0) {
					that.addNode();
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
	$('.pix-input').bind('keypress',function(event){
		$(this).checkText($(this).text(), event);
	});
});