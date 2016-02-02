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
function pasteHtmlAtCaret(html, selectPastedContent) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            var firstNode = frag.firstChild;
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                if (selectPastedContent) {
                    range.setStartBefore(firstNode);
                } else {
                    range.collapse(true);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        // IE < 9
        var originalRange = sel.createRange();
        originalRange.collapse(true);
        sel.createRange().pasteHTML(html);
        if (selectPastedContent) {
            range = sel.createRange();
            range.setEndPoint("StartToStart", originalRange);
            range.select();
        }
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
			$('.save').on('click',function(){
				$.fn.exportTool('save');
				return false;
			});
			$('.print').on('click',function(){
				$.fn.exportTool('print');
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
			$('.new').on('click',function(){
				$.layoutSelect();
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
			if ( isWebkit() ) {
				var p = $('<span>').addClass('aptext').html('\n');
			} else {
				var p = $('<p>').addClass('aptext').html('\n');
			}
	        obj.append(p);

	  		obj.find('.aptext').focus();
	  		setEndOfContenteditable(obj.find('.aptext').get(0));

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
			var i = '<i class="pix pix-'+click.text()+'"></i><br>';
			obj.data('pix-icon',click.text());
			//console.log(obj.data('pix-icon'));
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
			var pix_object = $.parseJSON(result.result);
			var layout = pix_object.layout;
			$.defineLayout(layout);
			$('.pix-steps').find('.pix-step').remove();
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
					var step_template = ( layout == 'ip' ) ? $('#pix-step').html() : $('#pix-service-step').html();
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

			//Agrandamos .pix-steps a medida que aumenten las columnas
			var width = 0;
			$('.pix-steps').find('.pix-step').each(function(){
				width = width + $(this).outerWidth() +10; 
			});
			$('.pix-steps').css('width',width);
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
			var layout = $('body').data('layout');
			var scores = [];
			$.each(pix_scores,function(i,val){
				var steps = $(this).find('.pix-step');
				var result_steps = [];
				$.each(steps,function(j,ival){
					if (layout == 'sb') {
						var enviroment = $(this).find('.block-enviroment').children('div');
						var enviroment_icon = '';
						if (enviroment.data('pix-icon')){
							enviroment_icon = 'pix-'+enviroment.data('pix-icon');
						}
						var enviroment_data = enviroment_icon+' '+enviroment.text();	
					}
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

					if (layout == 'sb') {
						var supporting_processes = $(this).find('.block-supporting_processes').children('div');
						var supporting_processes_icon = '';
						if (supporting_processes.data('pix-icon')) {
							supporting_processes_icon = 'pix-'+supporting_processes.data('pix-icon');
						}
						var supporting_processes_data = supporting_processes_icon+' '+supporting_processes.text();	
					}

					var step_title = $(ival).find('.note.top').val();
					var note  = $(ival).find('.note.bottom').val();
					if (layout == 'sb') {
						var object = {step_title: step_title, enviroment: enviroment_data, user: user_data, dialogue: dialogue_data, system : system_data, supporting_processes: supporting_processes_data, note: note };
					} else {
						var object = {step_title: step_title, user: user_data, dialogue: dialogue_data, system : system_data, note: note };
					}
					
					result_steps.push(object);
				});
				scores.push(result_steps);
			});
			
			var objectExport = {
				title: title,
				layout: layout,
				description: description,
				scores : scores
			}
			if (type == 'download') {
				$(this).exportDownload(objectExport);
			} else if (type == 'embed') {
				$(this).embedTool(objectExport);
			} else if ( type == 'print' ) {
				$(this).printTool(objectExport);
			} else if ( type == 'save' ) {
				localStorage.setItem('pix',JSON.stringify(objectExport));
				$.showMessage('Score Saved...');
			}
			
		} else {
			alert('Please name your score before exporting it.');
		}
	}
	/*
		Imprimir a PDF
	*/
	$.fn.printTool = function(object) {
		var data = window.btoa( unescape( encodeURIComponent( JSON.stringify(object) ) ) ),
			sub_url = ( location.host == 'eadpucv.github.io' ) ? '/pix' : '',
			url = 'http://'+location.host+sub_url+'/pages/app-embed/#!/print/'+data,
			width = $('.pix-steps').width(),
			name = string_to_slug( $('.score-header').find('input').val() ),
			request_domain = 'http://190.208.62.202:4730/'
			//request_domain = 'http://pix-language.com/';
			request_url = request_domain+'pdf';

		var request_data = {
			'score_name' : name,
			'score_width': width,
			'url' : url
		};

		$.ajax({
			url: request_url,
			type: 'POST',
			data : request_data,
			beforeSend: function() {
				$.showMessage('Generating PDF...');
				$.loader('show');
			},
			success: function(data) {
				if (data.status) {
					$.loader('hide');
					var url = request_domain+'download/'+data.return,
                    	windowName = "Download PDF",
                    	windowSize = "width=1,height=1",
                    	download_pdf = window.open(url, windowName, windowSize);
                    	$('body').delay(500).queue(function(next){
                    		download_pdf.close();
                    		next();
                    	});
				} else {
					$.showMessage('Error generating PDF...');
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				$.showMessage('Unknown error...');
				$.loader('hide');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		})
	}
	/*
		Genera el codigo embed del iframe y lo muestra
	*/
	$.fn.embedTool = function(object) {
		var data = window.btoa(unescape(encodeURIComponent(JSON.stringify(object)))),
			sub_url = ( location.host == 'eadpucv.github.io' ) ? '/pix' : '',
			code = '<iframe src="http://'+location.host+sub_url+'/pages/app-embed/#!/import/'+data+'" width="100%" height="auto">';
		$('.embedcode').text(code);
		$('#embed-info').show();
	}
	/*
		Ejecuta la importación de la data que trae la url
	*/
	$.fn.embedImport = function(type) {
		var urlhash = location.hash;
		console.log(urlhash.indexOf('import'));
		console.log(urlhash.indexOf('print'));
		if ( urlhash.indexOf('import') || urlhash.indexOf('print') ) {
			var hash = ( urlhash.indexOf('import') > 0 ) ? location.hash.substring(10) : location.hash.substring(9);
			console.log(hash);
			var object = {
				result: decodeURIComponent(escape(window.atob( hash )))
			}
			$.fn.makeImport(object);
			if (type == 'print') {
				$.fn.replaceIcons();
			}
		}
	}
	$.fn.replaceIcons = function() {
		//Reemplazamos iconos por svg
		$('.pix-group').each(function(){
			var obj = $(this),
				class_icon = obj.find('.pix').attr('class').replace('pix ', '');
			var icon = class_icon.replace('pix-','');
			obj.find('.pix').replaceWith('<img src="http://eadpucv.github.io/pix/icons/'+icon+'.svg" class="pix-icon-svg" style="width:4rem;"/><br>');
		});
		$('.pix-div-input').each(function(){
			var obj = $(this),
				icon = obj.data('pix-icon');
			obj.find('.pix').replaceWith('<img src="http://eadpucv.github.io/pix/icons/'+icon+'.svg" class="pix-icon-svg" style="width:4rem;"/><br>');
			console.log('replaced');
		});
	}
	/*
		Ejecuta la acción de descarga del JSON 
	*/
	$.fn.exportDownload = function(object) {
		var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
		$('.export').attr('href','data:'+data);
		var slug = string_to_slug(object.title);
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
		var close = $('<a>').attr({ 'class' : 'button-close', 'href' : '#' });
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
		var counter = $('.pix-steps').find('.pix-step').length;
		if (counter > 1) {
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
		return false;
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
				var alt_next = $(this).parent().parent().parent().next();
				//var alt_next = $(this).offsetParent().next().find('.pix-div-input').first();
				if (alt_next.length == 0) {
					//that.addNode($(this).offsetParent().parent());
					$(this).addNodeCurrent('last');
				} else {
					alt_next.find('.pix-div-input').first().focus().select();
				}
			} else {
				next.focus().select();
			}
			return false;
		}
	};
	$.loadSession = function(message,obj) {
		var container = $('<div>').addClass('embed-info'),
			message = $('<p>').html(message),
			a_cls = $('<a>').addClass('button-close btn').attr('href','#').text(''),
			a_rst = $('<a>').addClass('button-restore btn').attr('href','#').text('Restore');
			a_sess = $('<a>').addClass('button-reset btn').attr('href','#').text('Reset data');
			container.append(message).append(a_cls).append(a_rst).append(a_sess);
		$('body').append(container);
		container.find('.button-close').on('click',function(e) {
			e.preventDefault();
			$(this).parent().remove();
			return false;
		});
		container.find('.button-restore').on('click', function(e){
			e.preventDefault();
			var objectRestore = {
				result: obj,
				error: 0
			}
			$.fn.makeImport(objectRestore);
			$.showMessage('Restored saved session');
			$(this).parent().remove();
			return false;
		});
		container.find('.button-reset').on('click', function(e){
			e.preventDefault();
			localStorage.removeItem('pix');
			$.showMessage('Reset saved session');
			$(this).parent().remove();
			return false;
		});
	};
	/*
	* Chequeamos si hay sesión existente en el navegador
	*/
	$.checkSavedPix = function() {
		// TODO: Hacer una multisesión
		var pix = localStorage.getItem('pix');
		if ( pix ) {
			$.loadSession('You have a saved session on your browser, do you want to restore it?',pix);
		}
	};
	/*
	*	Loader show/hide
	*/
	$.loader = function(mode) {
		var loader = $('.loader');
		if (mode == 'show') {
			loader.removeClass('hidden');
		}
		if (mode == 'hide') {
			loader.addClass('hidden');
		}
	}
	/*
	* Mensaje informativo genérico
	*/
	$.showMessage = function(msg) {
		console.log(msg);
		var msg_container = $('<div>').addClass('message-container').text(msg);
		msg_container.css({
			'display' : 'none',
			'position' : 'fixed',
			'top': '15px',
			'width': '100%',
			'text-align':'center',
			'color': 'white',
			'z-index': 1031,
		});
		$('body').append(msg_container);
		 msg_container.fadeIn('fast', function() {
		 	msg_container.delay(1000);
		 	msg_container.fadeOut('slow', function(){
		 		msg_container.remove();
		 	});
		 	
		});
	};
	/*
	* Muestra el dialogo para seleccionar layout
	*/
	$.layoutSelect = function() {
		var container_select = $('<div>').addClass('select-layout-container');
		var a_tit = $('<h3>').html('Select template'),
		a_pix = $('<a>').attr('href','#ip').html('<div class="pix-group"><i class="pix pix-logo"></i></div> Interaction Score (PiX)'),
		a_sb = $('<a>').attr('href','#sb').html('<div class="pix-group"><i class="pix pix-body"></i></div> Service Blueprint'),
		a_close = $('<a>').addClass('button-close').attr('href','#');
		container_select.append(a_tit).append(a_pix).append(a_sb).append(a_close);
		$('body').append(container_select);
		$('.button-close').on('click', function(e){
			e.preventDefault();
			$('body').find('.select-layout-container').remove();
			return false;
		});
		$(container_select).find('a').on('click',function(e){
			e.preventDefault();
			var $action = $(this).attr('href');
			$.defineLayout($action.replace('#',''));
			$('body').find('.select-layout-container').remove();
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
				$('body').data('layout','ip');//interaction-score
				$('body').addClass('interaction-score');
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
	};
}(jQuery));

jQuery(document).ready(function($){
	/*
		Chequeamos si existe sesion guardada
	*/
	
	$.defineLayout('ip');
	/*
		Si hay embed lo importa
	*/
	if (location.hash.indexOf('import') != -1) {
		$.fn.embedImport('embed');
	} else if (location.hash.indexOf('print') != -1) {
		$.fn.embedImport('print');
	} else {
		$.checkSavedPix();
	}
	$.handleEvents.init();
});