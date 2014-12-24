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
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}
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
	$.handleEvents = {
		init : function(context){
			$('#add-new').on('click',function(event){
				$('#pix-template').addScore();
			});
			$('.pix-steps').on('keypress','.pix-div-input',function(event){
				$(this).checkText($(this).text(), event);
			});
			$('.pix-steps').on('keyup', '.pix-div-input', function(event){
				var target = $(this);
				$(this).replacePix($(this).text(), target);
			});
			$('.pix-steps').on('click','.btn-tools',function(event){
				$(this).clickTool();
			});
		}
	}
	$.fn.clickTool = function() {
		obj = $(this);
		switch(obj.attr('href')){
			case '#add':
				obj.addNodeCurrent();
				break;
			case '#remove':
				obj.removeCurrentNode();
			break;
			case '#split':
				obj.splitCurrent();
			break;
			case '#add-note':
				obj.addNoteCurrent();
			break;
		}
	}
	/*
	* Añade un nuevo score sin titulo via handlebars 
	*/
	$.fn.addScore= function(){
		var pix_layout = $('#layout-score').html();
		var step_template = $('#pix-step').html();
		var step_compile = Handlebars.compile(step_template);
		var template = Handlebars.compile(pix_layout);
		var context = {step: step_compile};
		var html = template(context);
		$(this).append(html);
		
		return false;
	}
	/*
	*	Ejecuta la acción de reemplazo (regex) del caracter Pix por el layout especificado
	*/
	$.fn.replacePix = function(str,target) {
			var re = new RegExp("(pix[-][a-z])([a-z]+)([\w ]+)","gm");
			var textarea = $(this).prev();
			textarea.val(str);
			console.log(textarea.val());
			var newstr = textarea.val();
			if (newstr.match(re)) {
				//$(this).prev().val(str);
		        str = str.replace(re,'<i class="pix $1$2"></i>');
		        //console.log(newstr);
		        $(target).html(str);
		        $(target).html('');
		        $(target).html(str);
		        //console.log(target);
		        //placeCaretAtEnd(target);
	        }
	}
	/*
	* Cambia la clase del ul contenedor generando un split
	* TODO: hay que agregar el campo de texto para el título
	*/
	$.fn.splitCurrent = function() {
		var obj = $(this);
		obj.parent().next().toggleClass('split');
	}
	/*
	* Añade / esconde nota de cada step
	*/
	$.fn.addNoteCurrent = function() {
		var obj = $(this);
		obj.parent().next().toggleClass('active');
	}
	/*
	* Elimina la columna contextual al botón
	*/
	$.fn.removeCurrentNode = function() {
		var obj = $(this);
		obj.parent().parent().remove();
	}
	/*
	* Añade una columna despues de la actual
	*/
	$.fn.addNodeCurrent = function() {
		var obj = $(this);
		var step_template = $('#pix-step').html();
		var column = Handlebars.compile(step_template);

		obj.parent().parent().after(column);

	}
	/*
	*	Controla funciones de input como el avance del tab para crear una nueva columna
	*/
	$.fn.checkText = function(str, event) {
		this.addNode = function(context) {
			var step_template = $('#pix-step').html();
			var column = Handlebars.compile(step_template);

			$('.pix-steps').append(column).find('.pix-step').last().find('li').first().find('.pix-div-input').focus();
		}
		var that = this;
		/*
			Control del tab para crear nueva columna
		*/
		if (event.keyCode == 9) {
			//next tab
			event.preventDefault();
			var next = $(this).parent().parent().next().find('.pix-div-input');
			if (next.length == 0) {
				var alt_next = $(this).offsetParent().next().find('.pix-div-input').first();
				//console.log(alt_next);
				if (alt_next.length == 0) {
					//console.log($(this).offsetParent().parent());
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
	/*
		Handlebars
	*/
	var pix_layout = $('#layout-score').html();
	var step_template = $('#pix-step').html();
	var step_compile = Handlebars.compile(step_template);
	var template = Handlebars.compile(pix_layout);
	var context = {step: step_compile};
	var html = template(context);
	$('#pix-template').html(html);

	/*
		Iniciamos eventos
	*/
	$.handleEvents.init();
	
});