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
		'pix-pix': '&#xe650;',
		'pix-grid-4': '&#xe648;',
		'pix-grid-all': '&#xe649;',
		'pix-grid-center': '&#xe64a;',
		'pix-grid-ll': '&#xe64c;',
		'pix-grid-lr': '&#xe64d;',
		'pix-grid-ul': '&#xe64e;',
		'pix-grid-ur': '&#xe64f;',
		'pix-grid-horizontal': '&#xe64b;',
		'pix-container-book': '&#xe600;',
		'pix-container-circle-dashed': '&#xe601;',
		'pix-container-circle': '&#xe602;',
		'pix-container-database': '&#xe603;',
		'pix-container-gear': '&#xe604;',
		'pix-container-refresh': '&#xe605;',
		'pix-container-reload': '&#xe606;',
		'pix-container-say': '&#xe607;',
		'pix-container-square-dashed': '&#xe608;',
		'pix-container-square': '&#xe609;',
		'pix-container-think': '&#xe60a;',
		'pix-keyboard': '&#xe60b;',
		'pix-mouse-click-center': '&#xe60c;',
		'pix-mouse-click-left': '&#xe60d;',
		'pix-mouse-all': '&#xe60e;',
		'pix-mouse-click-right': '&#xe60f;',
		'pix-mouse': '&#xe610;',
		'pix-arrow-down': '&#xe611;',
		'pix-arrow-left': '&#xe612;',
		'pix-arrow-right': '&#xe613;',
		'pix-arrow-up': '&#xe614;',
		'pix-arrows-move': '&#xe615;',
		'pix-arrows-collapse': '&#xe616;',
		'pix-arrows-diagonal': '&#xe617;',
		'pix-arrow-enter': '&#xe618;',
		'pix-arrows-horizontal': '&#xe619;',
		'pix-arrows-keyboard': '&#xe61a;',
		'pix-arrows-rotate': '&#xe61b;',
		'pix-click': '&#xe61c;',
		'pix-arrow-tab': '&#xe61d;',
		'pix-arrows-vertical': '&#xe61f;',
		'pix-checkbox': '&#xe620;',
		'pix-radio': '&#xe621;',
		'pix-list': '&#xe622;',
		'pix-switch': '&#xe623;',
		'pix-face-intrigued': '&#xe624;',
		'pix-face-smiling': '&#xe625;',
		'pix-face-sad': '&#xe626;',
		'pix-face-surpirsed': '&#xe627;',
		'pix-face-upset': '&#xe628;',
		'pix-face': '&#xe629;',
		'pix-thumbs-up': '&#xe62a;',
		'pix-touch-1': '&#xe62b;',
		'pix-touch-2': '&#xe62c;',
		'pix-touch-3': '&#xe62d;',
		'pix-touch-4': '&#xe62e;',
		'pix-touch-hand': '&#xe62f;',
		'pix-hand': '&#xe630;',
		'pix-touch-1-alt': '&#xe631;',
		'pix-touch-pinch': '&#xe632;',
		'pix-contact': '&#xe633;',
		'pix-cube': '&#xe634;',
		'pix-feed': '&#xe635;',
		'pix-file': '&#xe636;',
		'pix-gear': '&#xe637;',
		'pix-lightbulb': '&#xe638;',
		'pix-link': '&#xe639;',
		'pix-list2': '&#xe63a;',
		'pix-lock': '&#xe63b;',
		'pix-unlock': '&#xe63c;',
		'pix-no': '&#xe63d;',
		'pix-ok': '&#xe63e;',
		'pix-compass': '&#xe63f;',
		'pix-position': '&#xe640;',
		'pix-picture': '&#xe641;',
		'pix-video': '&#xe642;',
		'pix-sound': '&#xe643;',
		'pix-text': '&#xe644;',
		'pix-question': '&#xe645;',
		'pix-type': '&#xe61e;',
		'pix-text-type': '&#xe646;',
		'pix-window': '&#xe647;',
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
		c = c.match(/pix-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
