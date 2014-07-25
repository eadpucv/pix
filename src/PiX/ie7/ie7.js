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
		'pix-pix': '&#xe600;',
		'pix-grid-center': '&#xe601;',
		'pix-grid-4': '&#xe602;',
		'pix-grid-5': '&#xe603;',
		'pix-grid-all': '&#xe604;',
		'pix-grid-ul': '&#xe605;',
		'pix-grid-ur': '&#xe606;',
		'pix-grid-lr': '&#xe607;',
		'pix-grid-ll': '&#xe608;',
		'pix-grid-horizontal': '&#xe609;',
		'pix-square': '&#xe60a;',
		'pix-square-dashed': '&#xe60b;',
		'pix-circle': '&#xe60c;',
		'pix-circle-dashed': '&#xe60d;',
		'pix-say': '&#xe616;',
		'pix-think': '&#xe617;',
		'pix-dialogue': '&#xe618;',
		'pix-interaction': '&#xe619;',
		'pix-cloud': '&#xe61a;',
		'pix-gear': '&#xe61b;',
		'pix-database': '&#xe61c;',
		'pix-book': '&#xe61d;',
		'pix-refresh': '&#xe61e;',
		'pix-reload': '&#xe61f;',
		'pix-user': '&#xe60e;',
		'pix-user-smiling': '&#xe60f;',
		'pix-user-laughing': '&#xe610;',
		'pix-user-sad': '&#xe611;',
		'pix-user-mad': '&#xe612;',
		'pix-user-surpirsed': '&#xe613;',
		'pix-user-intrigued': '&#xe614;',
		'pix-robot': '&#xe615;',
		'pix-arrow-up': '&#xe620;',
		'pix-arrow-down': '&#xe621;',
		'pix-arrows-vertical': '&#xe622;',
		'pix-arrow-left': '&#xe623;',
		'pix-arrow-right': '&#xe624;',
		'pix-arrows-horizontal': '&#xe625;',
		'pix-arrows-move': '&#xe626;',
		'pix-arrows-collapse': '&#xe627;',
		'pix-arrows-diagonal': '&#xe628;',
		'pix-arrow-rotate': '&#xe629;',
		'pix-click': '&#xe62a;',
		'pix-keyboard-arrows': '&#xe62b;',
		'pix-keyboard-enter': '&#xe62c;',
		'pix-keyboard-tab': '&#xe62d;',
		'pix-keyboard-type': '&#xe62e;',
		'pix-keyboard': '&#xe62f;',
		'pix-mouse': '&#xe630;',
		'pix-click-left': '&#xe631;',
		'pix-click-center': '&#xe632;',
		'pix-click-right': '&#xe633;',
		'pix-mouse-all': '&#xe634;',
		'pix-game': '&#xe635;',
		'pix-touch-1': '&#xe636;',
		'pix-touch-1-alt': '&#xe637;',
		'pix-touch-2': '&#xe638;',
		'pix-touch-3': '&#xe639;',
		'pix-touch-4': '&#xe63a;',
		'pix-touch-5': '&#xe63b;',
		'pix-hand': '&#xe63c;',
		'pix-pinch': '&#xe63d;',
		'pix-thumb': '&#xe63e;',
		'pix-file': '&#xe63f;',
		'pix-cube': '&#xe640;',
		'pix-ok': '&#xe641;',
		'pix-no': '&#xe642;',
		'pix-plus': '&#xe643;',
		'pix-minus': '&#xe644;',
		'pix-question': '&#xe645;',
		'pix-text': '&#xe646;',
		'pix-sound': '&#xe647;',
		'pix-contact': '&#xe648;',
		'pix-picture': '&#xe649;',
		'pix-video': '&#xe64a;',
		'pix-cog': '&#xe64b;',
		'pix-search': '&#xe64c;',
		'pix-filter': '&#xe64d;',
		'pix-date': '&#xe64e;',
		'pix-time': '&#xe64f;',
		'pix-tag': '&#xe650;',
		'pix-place': '&#xe651;',
		'pix-compass': '&#xe652;',
		'pix-idea': '&#xe653;',
		'pix-radio': '&#xe654;',
		'pix-checkbox': '&#xe655;',
		'pix-switch': '&#xe656;',
		'pix-feed': '&#xe657;',
		'pix-link': '&#xe658;',
		'pix-list': '&#xe659;',
		'pix-read': '&#xe65a;',
		'pix-type': '&#xe65b;',
		'pix-lock': '&#xe65c;',
		'pix-unlock': '&#xe65d;',
		'pix-window': '&#xe65e;',
		'pix-window-text': '&#xe65f;',
		'pix-window-page': '&#xe660;',
		'pix-window-gallery': '&#xe661;',
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
