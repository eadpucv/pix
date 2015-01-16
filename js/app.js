function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
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
			$('#pix-template').on('keypress','.pix-div-input',function(event){
				if (event.keyCode != 8) {
					$(this).checkText($(this).text(), event);
				} else {
					var icon = $(this).data('pix-icon');

					if ($(this).text().length > 0) {
						$(this).prepend('<i class="pix pix-'+icon+'"></i>');
					}
				}
			});
			$('#pix-template').on('keyup', '.pix-div-input', function(event){
				if (event.keyCode != 8) {
					var target = $(this);
					var keySafe = [40,38];
					if ($.inArray(event.keyCode,keySafe) == -1) {
						$(this).replacePix($(this).text(), target);
					}
				} else {
					var icon = $(this).data('pix-icon');
					if ($(this).text().length > 0) {
						$(this).prepend('<i class="pix pix-'+icon+'"></i>');
					}
				}
			});
			$('#pix-template').on('click','.btn-tools',function(event){
				$(this).clickTool();
			});
			$('#pix-template').on('click', '.pix-div-input', function(event){
				$.handleEvents.acClose();
			});
			$('.export').on('click',function(){
				$.fn.exportTool();
			});
			$('.import').on('click',function(){
				$('.upload-json').trigger('click');
			});
			$('.upload-json').on('change',function(event){
				$.fn.importTool(this);
			});
		},
		acSelectNext : function(ul) {
			var current = ul.find('.active');
			var next = current.next();
			if (next.length > 0) {
				current.removeClass('active');
				next.addClass('active');
			} else {
				current.removeClass('active');
				ul.find('li:first').addClass('active');
			}
			return false;
		},
		acSelectPrev : function(ul) {
			var current = ul.find('.active');
			var prev = current.prev();
			if (prev.length > 0) {
				current.removeClass('active');
				prev.addClass('active');
			} else {
				current.removeClass('active');
				ul.find('li:last').addClass('active');
			}
		},
		acClose : function(ul) {
			$('body').find('ul.pix-ul').remove();
		},
		acAddIcon : function(ul,obj,match) {
			var current = ul.find('.active');
			
			//var i = $('<i>').attr('class','pix pix-'+current.text());
			var i = '<i class="pix pix-'+current.text()+'"></i>';
			
			obj.data('pix-icon',current.text());
			var textReplace  = obj.text().replace(match[0],i);
			if (textReplace.length < 3) {
				textReplace = i;
			}
			obj.html(textReplace);
			this.acClose(ul);
			var jsobj = obj.get(0);
			setEndOfContenteditable(jsobj);
		},
		acPutIcon : function(obj,clicked) {
			var click = $(clicked);
			var i = '<i class="pix pix-'+click.text()+'"></i>';
			obj.data('pix-icon',click.text());
			var searchpix = new RegExp("(pix[-][a-z]+)","g");
			var matchac = click.text().match(searchpix);
			if (matchac) {
				var replacedText = obj.text().replace(matchac[0],i);
				obj.html(replacedText);
			} else {
				obj.html(i);
			}
			$.handleEvents.acClose();
			obj.focus();
			var jsobj = obj.get(0);
			setEndOfContenteditable(jsobj);
		}
	}

	$.fn.importTool = function(that) {
		var files = that.files;
		if (files[0].type.indexOf("json") >= 0) {
			var reader = new FileReader();
			var json = {};
			reader.onload = (function(json) { return function(e) { $.fn.makeImport(e.target) }; })(json);
			reader.readAsText(files[0]);
		} else {
			alert('Sólo puedes importar archivos JSON');
		}
	}
	$.fn.makeImport = function(result) {
		if (!result.error) {
			$('.pix-steps').find('.pix-step').remove();
			var pix_object = $.parseJSON(result.result);
			//console.log(pix_object); 
			$('.score-header').find('input').val(pix_object.title);
			$('.score-description').val(pix_object.description);
			$.each(pix_object.scores,function(i,v){
				$.each(v,function(i,step){
					//console.log(step);
					var re = new RegExp("(pix[-][a-z])([a-z]+)","gm");
					var new_obj = {};
					$.each(step,function(i,item){
						var match = item.match(re);
						if (item.match(re)) {
					        item = item.replace(re,'<i class="pix $1$2"></i>');
					        new_obj[i] = item;
				        } else {
				        	new_obj[i] = item;
				        }
					});
					console.log(new_obj);
					//handlebars
					var step_template = $('#pix-step').html();
					var column = Handlebars.compile(step_template);
					var column_temp = column(new_obj);

					$('.pix-steps').append(column_temp);
					//obj.parent().parent().after(column);
				});
			});
			var actives = $('.pix-step');
			$.each(actives,function(i,step){
				var obj = $(this);
				console.log(obj.find('.pix-div-input').first().html());
				if (obj.find('.note.top').text() != '') {
					obj.find('.note.top').addClass('active');
					obj.find('ul').first().addClass('split');
				}
				if (obj.find('.note.bottom').text() != '') {
					obj.find('.note.bottom').addClass('active');
				}
				var inputs = obj.find('.pix-div-input');
				$.each(inputs, function(){
					var inp = $(this);
					var pix_class = $(this).find('i').attr('class');

					if (pix_class !== undefined)
						inp.data('pix-icon',pix_class.replace('pix pix-',''));
				});
			});
			//TODO : make import looping object
		} else {
			//TODO : Error handler
			alert('Error al leer archivo : '+result.error);
		}
	}
	$.fn.exportTool = function() {
		var title = $('.score-header').find('input').val();
		var description = $('.score-description').val();
		var pix_scores = $('.pix-score');
		var scores = [];
		$.each(pix_scores,function(i,val){
			var steps = $(this).find('.pix-step');
			var result_steps = [];
			$.each(steps,function(j,ival){
				var user = $(this).find('.block-user').children('div');
				var user_icon = '';
				if (user.data('pix-icon'))
					user_icon = 'pix-'+user.data('pix-icon');
				var user_data = user_icon+' '+user.text();

				var dialogue = $(this).find('.block-dialogue').children('div');
				var dialogue_icon = '';
				if (dialogue.data('pix-icon'))
					dialogue_icon = 'pix-'+dialogue.data('pix-icon');
				var dialogue_data = dialogue_icon+' '+dialogue.text();

				var system = $(this).find('.block-system').children('div');
				var system_icon = '';
				if (system.data('pix-icon'))
					system_icon = 'pix-'+system.data('pix-icon');
				var system_data = system_icon+' '+system.text();

				var step_title = $(ival).find('.note.top').val();
				var note  = $(ival).find('.note.bottom').val();
				var object = {step_title: step_title, user: user_data, dialogue: dialogue_data, system : system_data, note: note };
				result_steps.push(object);
			});
			scores.push(result_steps);
		});
		
		var objectExport = {
			title: title,
			description: description,
			scores : scores
		}
		var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(objectExport));
		$('.export').attr('href','data:'+data);
		$('.export').attr('download','pix-data.json');
		$('.export').trigger('click');
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
	$.fn.showAutoComplete = function(search,match) {
		$.handleEvents.acClose();
		var obj = $(this);
		var searchText = match[0].replace('pix-','');
		if ($('.pix-ul').length == 0) {
			var ul = $('<ul>').attr('class','select nav nav-stacked pix-ul');
			var results = [];
			$.ajax({
				dataType: 'json',
				url: Ajax.icons,
				success: function(data) {
					$.each(data,function(i,n){
						var prop = Object.getOwnPropertyNames(n);
						var propName = prop[0].toString();
						var searchExp = new RegExp("^"+searchText+"+","g");
						//console.log(propName.match(searchExp));
						if (propName.match(searchExp)) {
							results.push('pix-'+propName);
						}
					});
					$.each(results,function(i,n){
						var item = n.replace('pix-','');
						var li = $('<li>').append($('<a>').attr('href','#'+item).text(item).prepend($('<i>').attr('class','pix pix-fw pix-'+item)));
						ul.append(li);
					});
					$('body').append(ul);
						
					var input_position_top = obj.offset().top + obj.outerHeight();
					var input_position_left = obj.offset().left;

					ul.css({'top' : input_position_top,'left': input_position_left});
					ul.find('li:first').addClass('active');
					ul.find('a').on('click',function(event){
						$.handleEvents.acPutIcon(obj,this);
					});
				},
				error : function(jqXHR,status,error) {
					console.log(error);
				}

			});	
			/*
			* KEYCODES
			*
			* abajo : 40
			* arriba : 38
			* izq: 37
			* der: 39
			* esc: 27
			* enter: 13
			*/
			var passUl = ul;
			obj.on('keyup',function(event,passUl){
				switch(event.keyCode) {
					case 40 : $.handleEvents.acSelectNext(ul); break;
					case 38 : $.handleEvents.acSelectPrev(ul); break;
					case 27 : $.handleEvents.acClose(ul); break;
					case 13 : $.handleEvents.acAddIcon(ul,obj,match); break;
				}
				
			});
		} 
	}
	/*
	*	Ejecuta la acción de reemplazo (regex) del caracter Pix por el layout especificado
	*/
	$.fn.replacePix = function(str,target) {
			var autocomplete = new RegExp("(pix[-][a-z]+)","g");
			var re = new RegExp("(pix[-][a-z])([a-z]+)([\w ]+)","gm");
			var textarea = $(this).prev();
			textarea.val(str);
			
			//console.log(str);
			var newstr = textarea.val();
			var matchAc = newstr.match(autocomplete);
			if (matchAc) {
				$(this).showAutoComplete(newstr,matchAc);
			}
			if (newstr.match(re)) {
				//$(this).prev().val(str);
				$(target).data('pix-icon',str.replace(' ',''));
		        str = str.replace(re,'<i class="pix $1$2"></i>');
		        $(target).html(str);
		        $(target).html('');
		        $(target).html(str);
		        //console.log(target);
		        var jsobj = target.get(0);
				setEndOfContenteditable(jsobj);
		        $.handleEvents.acClose();
	        } 
	}
	/*
	* Cambia la clase del ul contenedor generando un split
	* TODO: hay que agregar el campo de texto para el título
	*/
	$.fn.splitCurrent = function() {
		var obj = $(this);
		obj.parent().next().toggleClass('split');
		obj.parent().prev().toggleClass('active');
		return false;
	}
	/*
	* Añade / esconde nota de cada step
	*/
	$.fn.addNoteCurrent = function() {
		var obj = $(this);
		obj.parent().next().toggleClass('active');
		return false;
	}
	/*
	* Elimina la columna contextual al botón
	*/
	$.fn.removeCurrentNode = function() {
		var obj = $(this);
		obj.parent().parent().remove();
		return false;
	}
	/*
	* Añade una columna despues de la actual
	*/
	$.fn.addNodeCurrent = function() {
		var obj = $(this);
		var step_template = $('#pix-step').html();
		var column = Handlebars.compile(step_template);
		column()

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
			$.handleEvents.acClose();
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
	// Debug handlebars
	Handlebars.registerHelper("debug", function(optionalValue) {
	  console.log("Current Context");
	  console.log("====================");
	  console.log(this);
	 
	  if (optionalValue) {
	    console.log("Value");
	    console.log("====================");
	    console.log(optionalValue);
	  }
	});

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