/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referring to this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'PiX\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icn-pix': '&#xe600;',
		'icn-grid': '&#xe601;',
		'icn-user': '&#xe602;',
		'icn-user-happy': '&#xe603;',
		'icn-user-mad': '&#xe604;',
		'icn-user-sad': '&#xe605;',
		'icn-user-confused': '&#xe606;',
		'icn-user-surprised': '&#xe607;',
		'icn-user-smile': '&#xe608;',
		'icn-think': '&#xe609;',
		'icn-ok': '&#xe60a;',
		'icn-share': '&#xe60b;',
		'icn-list': '&#xe60c;',
		'icn-question': '&#xe60d;',
		'icn-idea': '&#xe60e;',
		'icn-arrow-down': '&#xe60f;',
		'icn-arrow-left': '&#xe610;',
		'icn-arrow-right': '&#xe611;',
		'icn-arrow-up': '&#xe612;',
		'icn-arrows-vertical': '&#xe613;',
		'icn-arrows-horizontal': '&#xe614;',
		'icn-arrows-diagonal': '&#xe615;',
		'icn-arrows-rotate': '&#xe616;',
		'icn-arrows-all': '&#xe617;',
		'icn-arrows-collapse': '&#xe618;',
		'icn-click': '&#xe619;',
		'icn-enter': '&#xe61a;',
		'icn-arrows-keyboard': '&#xe61b;',
		'icn-tab': '&#xe61c;',
		'icn-type': '&#xe61d;',
		'icn-mouse-center': '&#xe61e;',
		'icn-mouse-left': '&#xe61f;',
		'icn-mouse-right': '&#xe620;',
		'icn-voice': '&#xe621;',
		'icn-dialogue': '&#xe622;',
		'icn-mouse': '&#xe623;',
		'icn-keyboard': '&#xe624;',
		'icn-touch-1': '&#xe625;',
		'icn-touch-2': '&#xe626;',
		'icn-touch-3': '&#xe627;',
		'icn-touch-4': '&#xe628;',
		'icn-touch-5': '&#xe629;',
		'icn-touch-5-expanded': '&#xe62a;',
		'icn-touch-alt': '&#xe62b;',
		'icn-touch-pinch': '&#xe62c;',
		'icn-thumb': '&#xe62d;',
		'icn-device-rotate': '&#xe62e;',
		'icn-device-shake': '&#xe62f;',
		'icn-device-orient': '&#xe630;',
		'icn-overlay-checkbox': '&#xe631;',
		'icn-icn_overlaydelete': '&#xe632;',
		'icn-overlay-ok': '&#xe633;',
		'icn-overlay-radio': '&#xe634;',
		'icn-overlay-list': '&#xe635;',
		'icn-overlay-switch': '&#xe636;',
		'icn-position': '&#xe637;',
		'icn-upload': '&#xe638;',
		'icn-gear': '&#xe639;',
		'icn-reload': '&#xe63a;',
		'icn-process': '&#xe63b;',
		'icn-download': '&#xe63c;',
		'icn-compass': '&#xe63d;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icn-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
