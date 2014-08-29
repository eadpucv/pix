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
	$.fn.checkText = function(str) {
		//console.log(str);
		$('.pix-replace').val(str);
		grep = '';
		regex = new RegExp(str,"g");
		var grep = $.grep(pix_icons,function(n,i){
			//console.log(n.text);
			//return n.text.match(regex); //regex que busca asociados... para el autocomplete
			return n.text===str;
		});
		//console.log(grep);
		if (grep.length == 1) {
			$('.pix-code').html(str.replace(regex,'<span class="pix-stack"><i class="pix '+grep.pop().id+'"></span>'));
		}
	};
}(jQuery));

jQuery(document).ready(function($){
	$('.pix-code').on('keyup',function(){
		$(this).checkText($(this).text());
	});
});