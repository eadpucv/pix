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

function isWebkit() {
	var uagt = navigator.userAgent;
	var searchwk = new RegExp("WebKit","g");
	var matchac = uagt.match(searchwk);
	if (matchac) {
		return true;
	} else {
		return false;
	}
}
/*
* Convert a string into a slug
* Props to dense13.com
* http://dense13.com/blog/2009/05/03/converting-string-to-slug-javascript/
*/
function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
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
				return false;
			});
			$('#pix-template').on('keydown','.pix-div-input',function(event){
				if (event.keyCode != 8) {
					$(this).checkText($(this).text(), event);
				}
			});
			$('#pix-template').on('dblclick', '.pix-div-input', function(event){
				$(this).showIconList($(this));
				return false;
			});
			$('#pix-template').on('keyup', '.pix-div-input', function(event){
				if (event.keyCode != 8) {
					var target = $(this);
					var keySafe = [40,38];
					if ($.inArray(event.keyCode,keySafe) == -1) {
						$(this).replacePix($(this).text(), target);
					}
				} else {
					//document.execCommand('delete', false, null);
					var obj = $(this);
					var icon = obj.data('pix-icon');
					if (obj.text = '') {
						obj.removeData('pix-icon');
						console.log('removida la data');
					}
					if (!isWebkit()) {

						//var obj = $(this);
						//console.log(this);
						// var icon = obj.data('pix-icon');
						// var no_icon = obj.data('no-icon');
						// var length = obj.text().length;
						// if ( length > 1) {
						// 	obj.prepend('<i class="pix pix-'+icon+'"></i>');
						// } else if ((length <= 1) && (length > 0)) {
						// 	obj.prepend('<i class="pix pix-'+icon+'"></i>');
						// } else if ((length == 0) && (no_icon == undefined)) {
						// 	obj.prepend('<i class="pix pix-'+icon+'"></i>');
						// 	var theobj = obj.get(0);
						// 	setEndOfContenteditable(theobj);
						// 	obj.data('no-icon',1);
						// } else if ((length == 0) && (no_icon)) {
						// 	obj.removeData('pix-icon');
						// 	obj.removeData('no-icon');
						// 	obj.html('');
						// }
					} else {
					}
				}
			});
			$('#pix-template').on('click','.btn-tools',function(event){
				$(this).clickTool();
				return false;
			});
			$('#pix-template').on('click', '.pix-div-input', function(event){
				$.handleEvents.acClose();
				return false;
			});
			$('.export').on('click',function(){
				$.fn.exportTool('download');
				return false;
			});
			$('.import').on('click',function(){
				$('.upload-json').trigger('click');
				return false;
			});
			$('.embed').on('click',function(){
				$.fn.exportTool('embed');
				return false;
			});
			$('.embed-close').on('click',function(){
				$('#embed-info').hide();
				return false;
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
		icClose : function() {
			$('body').find('.pix-icon-list').remove();
		},
		addTextNode : function(obj) {
			var p = $('<p>').attr('contenteditable','true');
	        obj.append(p);

	        var element = obj.find('p').get(0);
	        var s = window.getSelection(),
    		r = document.createRange();
    		element.innerHTML = '\u00a0';
			r.selectNodeContents(element);
			s.removeAllRanges();
			s.addRange(r);
			document.execCommand('delete', false, null);
			element.focus();
		},
		acAddIcon : function(ul,obj,match) {
			var icon = obj.data('pix-icon');
			if (icon == undefined) {
				var current = ul.find('.active');
				//var i = $('<i>').attr('class','pix pix-'+current.text());
				var i = '<i class="pix pix-'+current.text()+'"></i>&nbsp;';
				
				obj.data('pix-icon',current.text());
				console.log(obj.data('pix-icon'));
				var textReplace  = obj.text().replace(match[0],i);
				if (textReplace.length < 3) {
					textReplace = i;
				}
				obj.html(textReplace);

		        this.addTextNode(obj);

				this.acClose(ul);
				var jsobj = obj.get(0);
				setEndOfContenteditable(jsobj);
			}
		},
		acPutIcon : function(obj,clicked) {
			var click = $(clicked);
			var i = '<i class="pix pix-'+click.text()+'"></i> &nbsp;';
			obj.data('pix-icon',click.text());
			console.log(obj.data('pix-icon'));
			var searchpix = new RegExp("(pix[-][a-z]+)","g");
			var matchac = click.text().match(searchpix);
			if (matchac) {
				var replacedText = obj.text().replace(matchac[0],i);
				obj.html(replacedText);
				this.addTextNode(obj);
			} else {
				obj.html(i);
				this.addTextNode(obj);
			}
			$.handleEvents.acClose();
			$.handleEvents.icClose();
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
			$('.score-header').find('input').val(pix_object.title);
			$('.score-description').val(pix_object.description);
			$.each(pix_object.scores,function(i,v){
				$.each(v,function(i,step){
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
			alert('Read file error : '+result.error);
		}
	}
	$.fn.exportTool = function(type) {
		var title = $('.score-header').find('input').val();
		if (title != "") {
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
			if (type == 'download') {
				$(this).exportDownload(objectExport);
			} else if (type == 'embed') {
				$(this).embedTool(objectExport);
			}
			
		} else {
			alert('Please name your score before exporting it.');
		}
	}
	/*
		Genera el codigo embed del iframe y lo muestra
	*/
	$.fn.embedTool = function(object) {
		var data = window.btoa(unescape(encodeURIComponent(JSON.stringify(object))));
		var code = '<iframe src="http://'+location.host+'/pages/app-embed/#!/import/'+data+'" width="100%" height="auto">';
		$('.embedcode').text(code);
		$('#embed-info').show();
	}
	/*
		Ejecuta la importación de la data que trae la url
	*/
	$.fn.embedImport = function() {
		var urlhash = location.hash;
		if (urlhash.indexOf('import')) {
			var hash = location.hash.substring(10);
			var object = {
				result: decodeURIComponent(escape(window.atob( hash )))
			}
			$.fn.makeImport(object);
		}
	}
	/*
		Ejecuta la acción de descarga del JSON 
	*/
	$.fn.exportDownload = function(object) {
		var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
		$('.export').attr('href','data:'+data);
		var slug = string_to_slug(title);
		$('.export').attr('download','pix-data-'+slug+'.json');
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
		$('#pix-template').append(html);
		$('.pix-score').last().find('.pix-div-input:first').focus();
		$('.pix-score').last().find('.pix-steps').data('pix-columns',1);
		
		return false;
	}
	/*
	* Añade un nuevo score sin headers
	*/
	$.fn.addSemiScore= function(){
		var pix_layout = $('#layout-score-no-header').html();
		var step_template = $('#pix-step').html();
		var step_compile = Handlebars.compile(step_template);
		var template = Handlebars.compile(pix_layout);
		var context = {step: step_compile};
		var html = template(context);
		$('#pix-template').append(html);
		$('.pix-score').last().find('.pix-div-input:first').focus();
		$('.pix-score').last().find('.pix-steps').data('pix-columns',1);
		
		return false;
	}
	$.fn.showIconList = function(obj) {
		$.handleEvents.icClose();
		var icon_list = $('<div>').attr('class','pix-icon-list');
		var close = $('<a>').attr({ 'class' : 'button-close', 'href' : '#' }).text('cancel');
		icon_list.prepend(close);
		var ul = $('<ul>');
		$.ajax({
			dataType: 'json',
			url: Ajax.icons,
			success: function(data) {
				$.each(data,function(i,n){
					var prop = Object.getOwnPropertyNames(n);
					var textName = prop[0].toString();
					var propName = 'pix-'+prop[0].toString();
					var li = $('<li>').append($('<a>').attr('href','#'+propName).text(textName).prepend( $('<br>') ).prepend($('<i>').attr( 'class','pix pix-fw '+propName ) ));
					ul.append(li);
				});
				icon_list.append(ul);
				$('body').append(icon_list);
				ul.find('a').on('click',function(event){
					$.handleEvents.acPutIcon(obj,this);
					return false;
				});
				$('.button-close').on('click', function(event) {
					$.handleEvents.icClose();
					return false;
				});
			},
			error : function(jqXHR,status,error) {
				console.log(error);
			}

		});	
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
			
			var newstr = textarea.val();
			var matchAc = newstr.match(autocomplete);
			if (matchAc) {
				$(this).showAutoComplete(newstr,matchAc);
			}
			if (newstr.match(re)) {
				$(target).data('pix-icon',str.replace(' ',''));
		        str = str.replace(re,'<i class="pix $1$2"></i>');
		        $(target).html(str);
		        $(target).html('');
		        $(target).html(str);
		        
		        $.handleEvents.addTextNode($(target));

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
		var pix_steps = obj.parent().parent().parents();
		var counter = pix_steps.data('pix-columns');
		if (counter > 1) {
			pix_steps.data('pix-columns',counter-1);
			obj.parent().parent().remove();
		}

		return false;
	}
	/*
	* Añade una columna despues de la actual
	*/
	$.fn.addNodeCurrent = function(getObject) {
		var obj = $(this);
		var layout_mode = $('body').data('layout');

		if (layout_mode == 'sb') {
			var step_template = $('#pix-service-step').html();
		} else if (layout_mode == 'ip') {
			var step_template = $('#pix-step').html();
		} 
		var column = Handlebars.compile(step_template);
		column()
		if (getObject == 'last') {
			var pix_steps = obj.parent().parent().parents();
			var pix_steps = $(pix_steps[1]);
		} else {
			var pix_steps = obj.parent().parent().parents();
		}
		var counter = pix_steps.data('pix-columns');
		pix_steps.data('pix-columns',counter+1);
		if (getObject === 'last') {
			$(pix_steps).append(column).find('.pix-step').last().find('li').first().find('.pix-div-input').focus();
		} else {
			obj.parent().parent().after(column);
		}
		//Agrandamos .pix-steps a medida que aumenten las columnas
		var width = 0;
		$('.pix-steps').find('.pix-step').each(function(){
			width = width + $(this).outerWidth() +10; 
		});
		$('.pix-steps').css('width',width);
	}
	/*
	*	Controla funciones de input como el avance del tab para crear una nueva columna
	*/
	$.fn.checkText = function(str, event) {
		var that = this;
		/*
			Control del tab para crear nueva columna
		*/
		if (event.keyCode == 9) {
			//next tab
			$.handleEvents.acClose();
			event.preventDefault();
			var next = $(this).parent().next().find('.pix-div-input');
			if (next.length == 0) {
				console.log('no hay mas en col');
				var alt_next = $(this).parent().parent().parent().next();
				//var alt_next = $(this).offsetParent().next().find('.pix-div-input').first();
				if (alt_next.length == 0) {
					//that.addNode($(this).offsetParent().parent());
					$(this).addNodeCurrent('last');
				} else {
					alt_next.find('.pix-div-input').first().focus().select();
				}
			} else {
				console.log('avanza en item columna');
				next.focus().select();
			}
			return false;
		}
	};
	$.layoutSelect = function() {
		var container_select = $('<div>').addClass('select_layout_container');
		var a_sb = $('<a>').attr('href','#sb').html('<div class="pix-group"><i class="pix pix-body"></i></div> Service Blueprint');
		var a_ip = $('<a>').attr('href','#ip').html('<div class="pix-group"><i class="pix pix-logo"></i></div> Interaction Score (PiX)');
		container_select.append(a_sb).append(a_ip);
		$('body').append(container_select);
		$(container_select).find('a').on('click',function(e){
			e.preventDefault();
			var $action = $(this).attr('href');
			$.defineLayout($action.replace('#',''));
			$('body').find('.select_layout_container').remove();
			return false;
		});
	}
	/*
		Define el layout que se va a utilizar
	*/
	$.defineLayout = function(layout) {
		switch(layout) {
			case 'sb' : 
				//Service blueprint
				var pix_layout = $('#service-score').html();
				var step_template = $('#pix-service-step').html();
				$('body').data('layout','sb');//service blueprint
				$('body').addClass('service-blueprint');
			break;
			case 'ip' :
				//Interaction partitures
				var pix_layout = $('#layout-score').html();
				var step_template = $('#pix-step').html();
				$('body').data('layout','ip');//interaction-partiture
				$('body').addClass('interaction-partiture');
			break;
		}
		var step_compile = Handlebars.compile(step_template);
		var template = Handlebars.compile(pix_layout);
		var context = {step: step_compile};
		var html = template(context);
		$('#pix-template').html(html);
		/*
			Iniciamos eventos
		*/
		$.handleEvents.init();
	};
}(jQuery));

jQuery(document).ready(function($){

	$.layoutSelect();

	/*
		Si hay embed lo importa
	*/
	if (location.hash.indexOf('import') != -1) {
		$.fn.embedImport();
	}
	
});