import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Palette, Image as ImageIcon, Calendar, Music, Video, Share2, 
  Download, Eye, Smartphone, Tablet, Monitor, Wand2, Copy, Check, 
  MapPin, Clock, Heart, Gift, Phone, Globe, ChevronRight, ChevronDown, X, Plus, Trash2, Sliders, Volume2, VolumeX, Layers, Type, ShieldCheck, Save, Upload, ArrowUp, ArrowDown, Send, Mail, MessageSquare, Hash, Server, MoreVertical, RefreshCw, Lock, Unlock
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface SlideItem {
  id: string;
  url: string;
  mediaType?: 'image' | 'youtube';
  heading: string;
  headingSecondary?: string;
  description: string;
  descriptionSecondary?: string;
}

interface SlideBlock {
  id: string;
  type: 'hero' | 'countdown' | 'event_room' | 'venue' | 'rsvp' | 'comments' | 'slideshow' | 'blessings_wall' | 'custom';
  heading: string;
  headingSecondary?: string;
  image?: string;
  imageSize: 'small' | 'medium' | 'large' | 'full';
  detailsHeading?: string;
  detailsHeadingSecondary?: string;
  lines: string[];
  linesSecondary?: string[];
  showSeparator: boolean;
  separatorStyle: 'floral' | 'line' | 'dots' | 'sparkle';
  slides?: SlideItem[];
  enabled?: boolean;
  anim?: 'slide_up' | 'fade' | 'zoom' | 'bounce' | 'flip' | 'blur' | 'float' | 'none';
  animTrigger?: 'on-scroll' | 'immediate' | 'after-delay';
  showImage?: boolean;
  showDetails?: boolean;
}

interface CustomFont {
  id: string;
  name: string;
  source: 'google' | 'upload';
  data?: string; // data URL for uploaded font files
}

interface GuestComment {
  id: string;
  name: string;
  message: string;
  date: string;
}

interface RsvpResponse {
  id: string;
  name: string;
  email: string;
  status: 'attending' | 'regrets' | 'maybe';
  guestsCount: number;
  message: string;
  date: string;
}

interface PredefinedGuest {
  id: string;
  name: string;
  relationship: string;
  contact: string;
}


const cleanFontName = (n: string) => n.replace(/[^A-Za-z0-9 _-]/g, '').trim();

const googleFontsHref = (fonts: CustomFont[] = []) => {
  const fams = fonts.filter(f => f.source === 'google').map(f => 'family=' + encodeURIComponent(f.name).replace(/%20/g, '+'));
  return fams.length ? 'https://fonts.googleapis.com/css2?' + fams.join('&') + '&display=swap' : '';
};

const customFontCss = (cfg: { customFonts?: CustomFont[]; headingFont?: string; bodyFont?: string; customGoogleFont?: string }) => {
  const fonts = cfg.customFonts || [];
  let css = fonts.filter(f => f.source === 'upload' && f.data).map(f => '@font-face{font-family:"' + f.name + '";src:url(' + f.data + ');font-display:swap;}').join('\n');
  const body = cfg.bodyFont || cfg.customGoogleFont;
  if (cfg.headingFont) css += '\n.inv-heading{font-family:"' + cfg.headingFont + '",serif !important;}';
  if (body) css += '\n.inv-body{font-family:"' + body + '",sans-serif !important;}';
  return css;
};

interface Config {
  editor: boolean;
  format: '916' | 'responsive';
  cover: 'envelope' | 'curtain' | 'gate' | 'none';
  coverText: string;
  coverBg: string;
  coverAccent: string;
  eventsTitle: string;
  eventsTitleSecondary: string;
  introTitle: string;
  introTitleSecondary: string;
  galleryTitle: string;
  galleryTitleSecondary: string;
  primaryLangName: string;
  secondaryLangName: string;
  mode: 'scroll' | 'story';
  tilt: 'on' | 'off';
  emblem: 'on' | 'off';
  galleryShow: 'on' | 'off';
  clipLen: string;
  customOrn: string;
  ornMode: 'corners' | 'frame' | 'garland';
  lite: 'auto' | 'on' | 'off';
  fontPairing: 'script_serif' | 'royal_elegant' | 'modern_minimal' | 'warm_traditional' | 'luxurious_script' | 'modern_chic';
  customGoogleFont: string;
  customFonts: CustomFont[];
  headingFont: string;
  bodyFont: string;
  socialTags: string;
  notice: string;
  rsvpWhatsapp: string;
  liveUrl: string;
  albumUrl: string;
  thanks: string;
  thanksSecondary: string;
  footerCredit: string;
  dressCode: string;
  dressCodeSecondary: string;
  dressColors: string;
  travel: string;
  travelSecondary: string;
  faq: string;
  contacts: string;
  giftInfo: string;
  giftInfoSecondary: string;
  preset: string;
  eyebrow: string;
  eyebrowSecondary: string;
  title: string;
  titleSecondary: string;
  tagline: string;
  taglineSecondary: string;
  date: string;
  dateText: string;
  venue: string;
  venueSecondary: string;
  mapUrl: string;
  rsvpUrl: string;
  message: string;
  messageSecondary: string;
  heroImage: string;
  bgImage: string;
  gallery: string[];
  events: string;
  music: string;
  bgVideo: string;
  bgVideoPortrait: string;
  heroImagePortrait: string;
  vidUrl: string;
  vidTitle: string;
  vidPlace: 'intro' | 'events' | 'gallery' | 'end';
  vidShape: 'rect' | 'round' | 'arch';
  vidMusic: string;
  heroText: string;
  headText: string;
  bodyText: string;
  pageBg: string;
  imgBorder: 'none' | 'line' | 'double' | 'dashed' | 'gold' | 'polaroid';
  borderColor: string;
  borderWidth: number;
  imgRadius: number;
  decoStyle: 'none' | 'corners' | 'garland' | 'both';
  decoIcon: string;
  effects: string[];
  textAnim: 'letters' | 'fade' | 'blur';
  picAnim: 'slide' | 'zoom' | 'flip';
  sectionAnim: 'slide_up' | 'fade' | 'zoom' | 'bounce' | 'flip' | 'blur' | 'float' | 'none';
  accent: string;
  blocks: SlideBlock[];
  comments: GuestComment[];
  rsvpResponses: RsvpResponse[];
  predefinedGuests: PredefinedGuest[];
}

const DEFAULT_BLOCKS: SlideBlock[] = [
  {
    id: 'b1',
    type: 'hero',
    heading: 'The Royal Wedding Invitation',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    imageSize: 'large',
    detailsHeading: 'A Celebration of Timeless Love',
    lines: ['With the divine blessings of our parents', 'Mr. & Mrs. Sharma & Mr. & Mrs. Malhotra', 'Cordially invite you to celebrate the sacred wedding ceremony of their children'],
    showSeparator: true,
    separatorStyle: 'floral',
    anim: 'slide_up',
    animTrigger: 'immediate'
  },
  {
    id: 'b2',
    type: 'countdown',
    heading: 'Save the Dates',
    imageSize: 'medium',
    detailsHeading: 'Countdown to Forever',
    lines: ['11th & 12th December 2026', 'The Grand Palace Resort & Spa, Jaipur, Rajasthan'],
    showSeparator: true,
    separatorStyle: 'sparkle',
    anim: 'zoom',
    animTrigger: 'on-scroll'
  },
  {
    id: 'b3',
    type: 'slideshow',
    heading: 'Our Love Story Gallery',
    imageSize: 'medium',
    detailsHeading: 'Memories in Motion',
    lines: ['A visual journey of our cherished moments together.'],
    showSeparator: true,
    separatorStyle: 'dots',
    anim: 'fade',
    animTrigger: 'on-scroll',
    slides: [
      { id: 's1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', heading: 'The Magical Proposal', description: 'Under a canopy of starlight in Udaipur.' },
      { id: 's2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', heading: 'Mehendi & Sangeet Night', description: 'Dancing and laughter with our dearest friends and family.' },
      { id: 's3', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800', heading: 'Sunset Romance', description: 'Quiet moments before stepping into our forever.' }
    ]
  },
  {
    id: 'b4',
    type: 'event_room',
    heading: 'Day 1 路 Mehendi & Sangeet',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    imageSize: 'medium',
    detailsHeading: 'Royal Garden Lawn',
    lines: ['Date: 11 December 2026', 'Time: 4:00 PM onwards', 'Dress Code: Vibrant Ethnic / Festive Brights', 'Join us for musical performances, floral mehendi application, and cocktail gala.'],
    showSeparator: true,
    separatorStyle: 'line',
    anim: 'flip',
    animTrigger: 'on-scroll'
  },
  {
    id: 'b5',
    type: 'event_room',
    heading: 'Day 2 路 Wedding & Reception',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
    imageSize: 'medium',
    detailsHeading: 'Grand Ballroom & Palace Terrace',
    lines: ['Date: 12 December 2026', 'Baraat Assembly: 4:00 PM | Vows: 6:30 PM | Reception: 9:00 PM', 'Dress Code: Royal Formal / Black Tie', 'Experience the regal wedding rituals followed by a lavish royal banquet.'],
    showSeparator: true,
    separatorStyle: 'floral',
    anim: 'blur',
    animTrigger: 'on-scroll'
  },
  {
    id: 'b6',
    type: 'venue',
    heading: 'Venue & Travel Information',
    imageSize: 'medium',
    detailsHeading: 'The Grand Palace, Jaipur',
    lines: ['Complimentary valet parking at main palace entrance.', 'Special accommodation rates available using booking code LUMIERE2026.', 'Airport pickup and shuttle services arranged for out-of-town guests.'],
    showSeparator: true,
    separatorStyle: 'sparkle',
    anim: 'slide_up',
    animTrigger: 'on-scroll'
  },
  {
    id: 'b7',
    type: 'blessings_wall',
    heading: 'Guest Blessings Wall',
    imageSize: 'medium',
    detailsHeading: 'Leave Your Warm Wishes',
    lines: ['Post your heartfelt blessings in English, Hindi, Punjabi, or any language!'],
    showSeparator: true,
    separatorStyle: 'dots',
    anim: 'fade',
    animTrigger: 'on-scroll'
  },
  {
    id: 'b8',
    type: 'rsvp',
    heading: 'RSVP Confirmation',
    imageSize: 'medium',
    detailsHeading: 'Please Respond by 15 November 2026',
    lines: ['Let us know if you can join our celebration. We eagerly await your presence!'],
    showSeparator: false,
    separatorStyle: 'floral',
    anim: 'bounce',
    animTrigger: 'on-scroll'
  }
];

const DEFAULT_CONFIG: Config = {
  editor: true,
  format: '916',
  cover: 'envelope',
  coverText: 'Tap to open invitation',
  coverBg: '#f4e4d0',
  coverAccent: '#c59b27',
  eventsTitle: 'Celebration Schedule',
  eventsTitleSecondary: 'Programa de Celebraci贸n',
  introTitle: 'Our Special Day',
  introTitleSecondary: 'Nuestro D铆a Especial',
  galleryTitle: 'Moments Together',
  galleryTitleSecondary: 'Momentos Juntos',
  primaryLangName: 'EN',
  secondaryLangName: 'ES',
  mode: 'scroll',
  tilt: 'on',
  emblem: 'on',
  galleryShow: 'on',
  clipLen: '10',
  customOrn: '',
  ornMode: 'corners',
  lite: 'auto',
  fontPairing: 'script_serif',
  customGoogleFont: '',
  customFonts: [],
  headingFont: '',
  bodyFont: '',
  socialTags: '#AaravWedsMeera #JaipurWedding #LumiereStudio',
  notice: '',
  rsvpWhatsapp: '+1987654321',
  liveUrl: 'https://youtube.com/live/sample',
  albumUrl: 'https://photos.app.goo.gl/sample',
  thanks: 'Thank you for celebrating with us 馃挍',
  thanksSecondary: '隆Gracias por celebrar con nosotros 馃挍!',
  footerCredit: 'Design created by Lumi猫re Digital',
  dressCode: 'Formal / Evening Attire',
  dressCodeSecondary: 'Atuendo formal / de noche',
  dressColors: '#c9893b, #2b2320, #f9e79a',
  travel: 'Hotel Grand Palace offers special room rates for guests. Use code LUMIERE2026.',
  travelSecondary: 'Hotel Grand Palace ofrece tarifas especiales para invitados. Usa el c贸digo LUMIERE2026.',
  faq: 'Are children welcome? | Yes, absolutely! | Is parking available? | Valet parking is complimentary at the main entrance.',
  contacts: 'Wedding Planner (Sarah) | +1 555-0192',
  giftInfo: 'Your presence is our greatest gift. Should you wish to bless us with a token, a registry is available.',
  giftInfoSecondary: 'Su presencia es nuestro mayor regalo.',
  preset: 'wedding',
  eyebrow: 'Together with their families',
  eyebrowSecondary: 'Junto con sus familias',
  title: 'Aarav & Meera',
  titleSecondary: 'Aarav y Meera',
  tagline: 'invite you to celebrate their wedding',
  taglineSecondary: 'te invitan a celebrar su boda',
  date: '2026-12-12T18:00',
  dateText: 'Saturday, 12 December 2026 路 6:00 PM',
  venue: 'The Grand Palace, Jaipur',
  venueSecondary: 'El Gran Palacio, Jaipur',
  mapUrl: 'https://maps.google.com/?q=Jaipur',
  rsvpUrl: 'https://forms.gle/sample',
  message: 'Your presence and blessings will make our day complete as we embark on this sacred journey of love.',
  messageSecondary: 'Tu presencia y bendiciones har谩n nuestro d铆a completo mientras emprendemos este viaje sagrado de amor.',
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
  bgImage: '',
  gallery: [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800'
  ],
  events: '# Day 1\nMehendi Night | 11 Dec, 4 PM | Garden Lawn\n# Day 2\nWedding Ceremony | 12 Dec, 6 PM | Grand Hall\nReception | 12 Dec, 9 PM | Palace Terrace',
  music: '',
  bgVideo: '',
  bgVideoPortrait: '',
  heroImagePortrait: '',
  vidUrl: '',
  vidTitle: '',
  vidPlace: 'intro',
  vidShape: 'rect',
  vidMusic: '',
  heroText: 'Welcome to Our Celebration',
  headText: 'Special Events',
  bodyText: '#4a5568',
  pageBg: '#fcf6f0',
  imgBorder: 'line',
  borderColor: '#d4a373',
  borderWidth: 2,
  imgRadius: 16,
  decoStyle: 'corners',
  decoIcon: '馃尭',
  effects: ['petals'],
  textAnim: 'fade',
  picAnim: 'zoom',
  sectionAnim: 'slide_up',
  accent: '#c59b27',
  blocks: DEFAULT_BLOCKS,
  comments: [
    { id: 'c1', name: 'Priya Sharma', message: 'Wishing you a lifetime of love and joy! Can鈥檛 wait to celebrate.', date: '2 hours ago' },
    { id: 'c2', name: 'Rahul & Ananya', message: 'Heartiest congratulations to the gorgeous couple!', date: 'Yesterday' }
  ],
  rsvpResponses: [
    { id: 'r1', name: 'Aarav Sharma', email: 'aarav@example.com', status: 'attending', guestsCount: 2, message: 'So excited for the big day!', date: '1 day ago' },
    { id: 'r2', name: 'Neha Gupta', email: 'neha@example.com', status: 'attending', guestsCount: 1, message: 'Looking forward to celebrating with you.', date: '3 hours ago' }
  ],
  predefinedGuests: [
    { id: 'g1', name: 'Rajesh Sharma', relationship: 'Family', contact: '+91 98765 43210' },
    { id: 'g2', name: 'Priya Patel', relationship: 'Close Friend', contact: 'priya@example.com' },
    { id: 'g3', name: 'Vikram Malhotra', relationship: 'VIP / Colleague', contact: '+91 91234 56789' }
  ]
};

export default function App() {
  const [config, setConfig] = useState<Config>(() => {
    const saved = localStorage.getItem('lumiere_config');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          cover: 'none',
          rsvpResponses: parsed.rsvpResponses || DEFAULT_CONFIG.rsvpResponses,
          comments: parsed.comments || DEFAULT_CONFIG.comments,
          blocks: parsed.blocks || DEFAULT_CONFIG.blocks,
          predefinedGuests: parsed.predefinedGuests || DEFAULT_CONFIG.predefinedGuests,
        };
      } catch (e) {}
    }
    return DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<'studio' | 'preview' | 'ai'>('studio');
  const [activeLanguage, setActiveLanguage] = useState<'primary' | 'secondary'>('primary');
  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'tablet' | 'desktop' | 'full'>('full');
  const [isOpened, setIsOpened] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'core' | 'style' | 'media' | 'slides' | 'extra'>('style');
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [pdfPrintMode, setPdfPrintMode] = useState<'color' | 'bw'>('color');
  const [htmlUpdateStatus, setHtmlUpdateStatus] = useState<string | null>(null);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestRel, setNewGuestRel] = useState('Family');
  const [newGuestContact, setNewGuestContact] = useState('');

  // Load custom fonts (Google + uploaded) into the page
  useEffect(() => {
    const href = googleFontsHref(config.customFonts);
    let link = document.getElementById('inv-google-fonts') as HTMLLinkElement | null;
    if (href) {
      if (!link) { link = document.createElement('link'); link.id = 'inv-google-fonts'; link.rel = 'stylesheet'; document.head.appendChild(link); }
      if (link.href !== href) link.href = href;
    } else if (link) link.remove();
    let st = document.getElementById('inv-custom-font-css') as HTMLStyleElement | null;
    if (!st) { st = document.createElement('style'); st.id = 'inv-custom-font-css'; document.head.appendChild(st); }
    st.textContent = customFontCss(config);
  }, [config.customFonts, config.headingFont, config.bodyFont, config.customGoogleFont]);

  const [newFontName, setNewFontName] = useState('');
  const [fontStatus, setFontStatus] = useState<string | null>(null);

  const addGoogleFont = async () => {
    const name = cleanFontName(newFontName);
    if (!name) return;
    if ((config.customFonts || []).some(f => f.name.toLowerCase() === name.toLowerCase())) { setFontStatus('That font is already added.'); return; }
    setFontStatus('Checking font on Google Fonts鈥�');
    try {
      const probe = document.createElement('link');
      probe.rel = 'stylesheet';
      probe.href = googleFontsHref([{ id: 'x', name, source: 'google' }]);
      const ok = await new Promise<boolean>(resolve => {
        probe.onload = () => resolve(true);
        probe.onerror = () => resolve(false);
        document.head.appendChild(probe);
        setTimeout(() => resolve(false), 8000);
      });
      probe.remove();
      if (!ok) { setFontStatus('Font "' + name + '" not found. Check the exact name on fonts.google.com.'); return; }
      const font: CustomFont = { id: 'f_' + Date.now(), name, source: 'google' };
      setConfig(c => ({ ...c, customFonts: [...(c.customFonts || []), font] }));
      setNewFontName('');
      setFontStatus('Added "' + name + '" 鉁� Now pick it as Heading or Body font below.');
    } catch { setFontStatus('Could not add font. Check your internet connection.'); }
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/\.(ttf|otf|woff2?)$/i.test(file.name)) { setFontStatus('Please choose a .ttf, .otf, .woff or .woff2 file.'); return; }
    if (file.size > 1.5 * 1024 * 1024) { setFontStatus('Font file is too large (max 1.5 MB).'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const name = cleanFontName(file.name.replace(/\.[^.]+$/, '')) || 'Custom Font';
      const font: CustomFont = { id: 'f_' + Date.now(), name, source: 'upload', data: String(reader.result) };
      setConfig(c => ({ ...c, customFonts: [...(c.customFonts || []).filter(f => f.name !== name), font] }));
      setFontStatus('Uploaded "' + name + '" 鉁� Now pick it as Heading or Body font below.');
    };
    reader.readAsDataURL(file);
  };

  const removeCustomFont = (id: string) => {
    setConfig(c => {
      const f = (c.customFonts || []).find(x => x.id === id);
      return {
        ...c,
        customFonts: (c.customFonts || []).filter(x => x.id !== id),
        headingFont: f && c.headingFont === f.name ? '' : c.headingFont,
        bodyFont: f && c.bodyFont === f.name ? '' : c.bodyFont,
      };
    });
  };

  const handleUpdateHtmlCode = () => {
    try {
      localStorage.setItem('lumiere_config', JSON.stringify(config));
      const testJson = JSON.stringify(config);
      if (!testJso
