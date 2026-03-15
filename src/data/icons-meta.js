// Icon metadata with layer suggestions
// All 160 icons with their suggested layers

export const ALL_ICONS = [
  'add','alert','angry','api','archive','ask','attach','audio','autocomplete',
  'body','branch','button','buy','call','camera','cancel','check','checkbox',
  'click','clock','cloud','collapse','color','comment','config','contact',
  'contacts','copy','cut','database','date','delete','desktop','deviceorient',
  'devicerotate','deviceshake','devicevibrate','dialogue','dislike','doubleclick',
  'doubletap','down','download','drag','drop','edit','email','empty','expand',
  'export','face','ff','file','film','filter','furious','gallery','game',
  'hand','hand1','hangup','happy','image','import','input','intrigued',
  'kiosk','left','like','link','list','lock','logo','map','merge','message',
  'mobile','move','next','notebook','notify','page','password','paste',
  'pause','pay','person','pinch','play','position','prev','print','process',
  'progress','qr','radio','radioselect','range','rec','remove','resize',
  'rew','right','rotate','route','rss','sad','save','say','scroll','search',
  'select','send','share','smiling','speak','stack','stop','surprised',
  'switch','system','tablet','tag','tap','tap1down','tap1left','tap1right',
  'tap1up','tap2','tap2down','tap2left','tap2right','tap2up','tap3',
  'tap3down','tap3left','tap3right','tap3up','tap4','tap4down','tap4left',
  'tap4right','tap4up','tap5down','tap5left','tap5right','tap5up','text',
  'think','time','tv','unlink','unlock','up','update','upload','video',
  'view','window','zoom'
];

// Suggested icons per layer (icons can be used anywhere, these are just suggestions)
export const LAYER_SUGGESTIONS = {
  user: [
    'happy', 'sad', 'angry', 'surprised', 'smiling', 'furious', 'intrigued',
    'think', 'face', 'person', 'say', 'speak', 'ask', 'like', 'dislike',
    'body', 'hand', 'hand1', 'empty'
  ],
  dialogue: [
    'button', 'input', 'checkbox', 'click', 'tap', 'scroll', 'drag', 'drop',
    'select', 'autocomplete', 'password', 'doubleclick', 'doubletap', 'edit',
    'page', 'message', 'text', 'link', 'image', 'video', 'audio', 'film',
    'radio', 'radioselect', 'range', 'search', 'filter', 'list', 'comment',
    'email', 'notify', 'alert', 'pinch', 'rotate', 'resize', 'move',
    'expand', 'collapse', 'zoom', 'play', 'pause', 'stop', 'rec', 'ff',
    'rew', 'next', 'prev', 'view', 'gallery', 'game', 'qr', 'camera',
    'notebook', 'window', 'tab', 'dialogue', 'date', 'color',
    'tap1down', 'tap1left', 'tap1right', 'tap1up',
    'tap2', 'tap2down', 'tap2left', 'tap2right', 'tap2up',
    'tap3', 'tap3down', 'tap3left', 'tap3right', 'tap3up',
    'tap4', 'tap4down', 'tap4left', 'tap4right', 'tap4up',
    'tap5down', 'tap5left', 'tap5right', 'tap5up'
  ],
  system: [
    'process', 'database', 'cloud', 'api', 'update', 'download', 'upload',
    'save', 'export', 'import', 'delete', 'copy', 'cut', 'paste', 'send',
    'share', 'archive', 'file', 'merge', 'branch', 'config', 'lock',
    'unlock', 'progress', 'print', 'rss', 'route', 'map', 'position',
    'system', 'stack', 'switch', 'tag', 'time', 'clock', 'add', 'remove',
    'check', 'cancel', 'up', 'down', 'left', 'right', 'unlink',
    'pay', 'buy', 'logo', 'attach', 'contact', 'contacts', 'call',
    'hangup', 'deviceorient', 'devicerotate', 'deviceshake', 'devicevibrate'
  ],
  environment: [
    'desktop', 'mobile', 'tablet', 'kiosk', 'tv', 'window', 'page',
    'notebook', 'camera', 'audio', 'video'
  ],
  supporting: [
    'process', 'database', 'cloud', 'api', 'system', 'config', 'stack',
    'merge', 'branch', 'archive', 'file', 'route', 'map', 'rss',
    'email', 'send', 'notify', 'print'
  ]
};

// Icon cache (SVG strings)
const iconCache = new Map();
let iconLoadPromises = new Map();

export async function loadIcon(name) {
  if (iconCache.has(name)) return iconCache.get(name);
  if (iconLoadPromises.has(name)) return iconLoadPromises.get(name);

  const promise = fetch(`./icons/${name}.svg`)
    .then(r => {
      if (!r.ok) throw new Error(`Icon not found: ${name}`);
      return r.text();
    })
    .then(svgText => {
      // Strip XML declaration and DOCTYPE
      svgText = svgText.replace(/<\?xml[^?]*\?>\s*/g, '');
      svgText = svgText.replace(/<!DOCTYPE[^>]*>\s*/g, '');
      // Remove icomoon-ignore group
      svgText = svgText.replace(/<g id="icomoon-ignore">[\s\S]*?<\/g>\s*/g, '');
      iconCache.set(name, svgText);
      iconLoadPromises.delete(name);
      return svgText;
    })
    .catch(err => {
      iconLoadPromises.delete(name);
      console.warn(err.message);
      return null;
    });

  iconLoadPromises.set(name, promise);
  return promise;
}

export function getIconSync(name) {
  return iconCache.get(name) || null;
}

// Preload all icons
export async function preloadIcons() {
  const batch = ALL_ICONS.map(name => loadIcon(name));
  await Promise.all(batch);
}

export function getLayerIcons(layer) {
  return LAYER_SUGGESTIONS[layer] || [];
}
