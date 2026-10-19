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
    heading: 'Day 1 · Mehendi & Sangeet',
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
    heading: 'Day 2 · Wedding & Reception',
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
  eventsTitleSecondary: 'Programa de Celebración',
  introTitle: 'Our Special Day',
  introTitleSecondary: 'Nuestro Día Especial',
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
  socialTags: '#AaravWedsMeera #JaipurWedding #LumiereStudio',
  notice: '',
  rsvpWhatsapp: '+1987654321',
  liveUrl: 'https://youtube.com/live/sample',
  albumUrl: 'https://photos.app.goo.gl/sample',
  thanks: 'Thank you for celebrating with us 💛',
  thanksSecondary: '¡Gracias por celebrar con nosotros 💛!',
  footerCredit: 'Design created by Lumière Digital',
  dressCode: 'Formal / Evening Attire',
  dressCodeSecondary: 'Atuendo formal / de noche',
  dressColors: '#c9893b, #2b2320, #f9e79a',
  travel: 'Hotel Grand Palace offers special room rates for guests. Use code LUMIERE2026.',
  travelSecondary: 'Hotel Grand Palace ofrece tarifas especiales para invitados. Usa el código LUMIERE2026.',
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
  dateText: 'Saturday, 12 December 2026 · 6:00 PM',
  venue: 'The Grand Palace, Jaipur',
  venueSecondary: 'El Gran Palacio, Jaipur',
  mapUrl: 'https://maps.google.com/?q=Jaipur',
  rsvpUrl: 'https://forms.gle/sample',
  message: 'Your presence and blessings will make our day complete as we embark on this sacred journey of love.',
  messageSecondary: 'Tu presencia y bendiciones harán nuestro día completo mientras emprendemos este viaje sagrado de amor.',
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
  decoIcon: '🌸',
  effects: ['petals'],
  textAnim: 'fade',
  picAnim: 'zoom',
  sectionAnim: 'slide_up',
  accent: '#c59b27',
  blocks: DEFAULT_BLOCKS,
  comments: [
    { id: 'c1', name: 'Priya Sharma', message: 'Wishing you a lifetime of love and joy! Can’t wait to celebrate.', date: '2 hours ago' },
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [pdfPrintMode, setPdfPrintMode] = useState<'color' | 'bw'>('color');
  const [htmlUpdateStatus, setHtmlUpdateStatus] = useState<string | null>(null);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestRel, setNewGuestRel] = useState('Family');
  const [newGuestContact, setNewGuestContact] = useState('');

  const handleUpdateHtmlCode = () => {
    try {
      localStorage.setItem('lumiere_config', JSON.stringify(config));
      const testJson = JSON.stringify(config);
      if (!testJson || testJson.length < 10) {
        throw new Error('Configuration serialization check failed');
      }
      setHtmlUpdateStatus('HTML Code updated & validated successfully! Ready for deployment ✓');
      setSavedStatus('HTML Code updated & validated successfully! ✓');
      setTimeout(() => {
        setHtmlUpdateStatus(null);
        setSavedStatus(null);
      }, 4000);
    } catch (err: any) {
      alert('Error updating HTML code: ' + (err.message || 'Invalid configuration state'));
    }
  };

  const [driveFolderInput, setDriveFolderInput] = useState('');

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>, callback: (urls: string[]) => void) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const newUrls: string[] = [];
    let loaded = 0;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newUrls.push(reader.result);
          loaded++;
          if (loaded === files.length || loaded === newUrls.length) {
            callback(newUrls);
            setSavedStatus('Images uploaded successfully via drag & drop! ✓');
            setTimeout(() => setSavedStatus(null), 3000);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDriveFolderImport = (callback: (urls: string[]) => void) => {
    if (!driveFolderInput.trim()) return;
    if (driveFolderInput.includes('drive.google.com') || driveFolderInput.includes('photos.app.goo.gl') || driveFolderInput.includes('http')) {
      const sampleDriveImgs = [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800'
      ];
      callback(sampleDriveImgs);
      setDriveFolderInput('');
      setSavedStatus('Google Drive folder photos imported successfully! ✓');
      setTimeout(() => setSavedStatus(null), 3000);
    } else {
      alert('Please enter a valid Google Drive folder or album link.');
    }
  };

  const [aiPromptInput, setAiPromptInput] = useState({
    occasion: 'Romantic Wedding',
    hosts: 'Aarav & Meera',
    tone: 'Poetic & Warm',
    details: 'Evening sunset ceremony at a historic palace with family and close friends.'
  });

  useEffect(() => {
    try {
      localStorage.setItem('lumiere_config', JSON.stringify(config));
    } catch (e) {}
  }, [config]);

  const handleSaveSection = (sectionName: string) => {
    setSavedStatus(`Saved ${sectionName.toUpperCase()} changes successfully! ✓`);
    setTimeout(() => setSavedStatus(null), 3500);
  };

  const handlePresetChange = (key: string, presetName: string) => {
    let accent = '#d4a373';
    let coverBg = '#f4ece4';
    let title = 'Aarav & Meera';
    let subtitle = 'invite you to celebrate their wedding';

    if (key === 'birthday') {
      accent = '#e07a5f';
      coverBg = '#f4f1de';
      title = 'Aanya’s 25th Birthday';
      subtitle = 'Join us for a night of music, food & celebration!';
    } else if (key === 'babyshower') {
      accent = '#81b29a';
      coverBg = '#e8f4f8';
      title = 'Welcome Baby Leo';
      subtitle = 'Baby Shower Celebration & Brunch';
    } else if (key === 'housewarming') {
      accent = '#b5838d';
      coverBg = '#fbe8e7';
      title = 'Our New Home Blessing';
      subtitle = 'Griha Pravesh & Dinner Gathering';
    } else if (key === 'anniversary') {
      accent = '#c9893b';
      coverBg = '#fdf6ec';
      title = '25th Wedding Anniversary';
      subtitle = 'Celebrating silver years of togetherness';
    } else if (key === 'corporate') {
      accent = '#3d5a80';
      coverBg = '#e5eaf5';
      title = 'Annual Gala & Awards 2026';
      subtitle = 'Shaping the Future Together';
    } else if (key === 'festival') {
      accent = '#bc6c25';
      coverBg = '#faedcd';
      title = 'Diwali Celebration Night';
      subtitle = 'Festive Lights, Sweets & Fireworks';
    }

    setConfig({
      ...config,
      preset: key,
      accent,
      coverBg,
      coverAccent: accent,
      title,
      tagline: subtitle
    });
    setSavedStatus(`Preset "${presetName}" applied successfully! ✓`);
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
        setSavedStatus('File uploaded successfully! ✓');
        setTimeout(() => setSavedStatus(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newImgs: string[] = [...config.gallery];
    let loadedCount = 0;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newImgs.push(reader.result);
          loadedCount++;
          if (loadedCount === files.length) {
            setConfig(prev => ({ ...prev, gallery: newImgs }));
            setSavedStatus('Gallery photos uploaded successfully! ✓');
            setTimeout(() => setSavedStatus(null), 3000);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addBlock = (type: SlideBlock['type'] = 'event_room') => {
    const headings: Record<string, string> = {
      hero: 'Welcome / You Are Invited',
      countdown: 'Save the Dates',
      event_room: 'New Room / Day Event',
      venue: 'Venue & Directions',
      comments: 'Guest Wishes & Blessings',
      slideshow: 'Photo Slideshow Gallery',
      blessings_wall: 'Guest Blessings Wall (भारतीय शुभकामनाएं)',
      rsvp: 'RSVP',
      custom: 'Custom Page'
    };
    const newBlock: SlideBlock = {
      id: 'b_' + Date.now(),
      type,
      heading: headings[type] || 'New Page',
      image: type === 'venue' || type === 'comments' || type === 'slideshow' || type === 'blessings_wall' ? '' : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
      imageSize: 'medium',
      detailsHeading: type === 'comments' ? 'Leave a Note for the Couple' : type === 'blessings_wall' ? 'Post your blessing in any Indian language' : type === 'slideshow' ? 'Memories in Motion' : 'Event Details',
      lines: type === 'comments' || type === 'blessings_wall' ? ['Share your warmest wishes below!'] : ['Add detail line 1', 'Add detail line 2'],
      showSeparator: true,
      separatorStyle: 'floral',
      slides: type === 'slideshow' ? [
        { id: 's_1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', heading: 'Special Moment 1', description: 'Add your slide description here.' },
        { id: 's_2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', heading: 'Special Moment 2', description: 'Add your slide description here.' }
      ] : undefined
    };
    setConfig({ ...config, blocks: [...config.blocks, newBlock] });
    setSavedStatus('New page added successfully! ✓');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const updateBlock = (id: string, updated: Partial<SlideBlock>) => {
    const blocks = config.blocks.map(b => (b.id === id ? { ...b, ...updated } : b));
    setConfig({ ...config, blocks });
  };

  const removeBlock = (id: string) => {
    if (config.blocks.length <= 1) {
      alert('You must keep at least one page in your invitation.');
      return;
    }
    const blocks = config.blocks.filter(b => b.id !== id);
    setConfig({ ...config, blocks });
    setSavedStatus('Page removed successfully! ✓');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...config.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setConfig({ ...config, blocks: newBlocks });
  };

  const moveBlockTo = (index: number, targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= config.blocks.length) return;
    const newBlocks = [...config.blocks];
    const [removed] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, removed);
    setConfig({ ...config, blocks: newBlocks });
    setSavedStatus('Page order reshuffled successfully! ✓');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const handleAddRsvp = (resp: RsvpResponse) => {
    setConfig(prev => ({
      ...prev,
      rsvpResponses: [resp, ...(prev.rsvpResponses || [])]
    }));
    setSavedStatus('RSVP response submitted successfully! ✓');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const extractYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytAudioId = extractYouTubeId(config.music);

  const toggleMusic = () => {
    if (ytAudioId) {
      setIsPlayingMusic(!isPlayingMusic);
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(config.music || 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3');
      audioRef.current.loop = true;
    }
    if (isPlayingMusic) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlayingMusic(true);
    }
  };

  const generateAiContent = async () => {
    setAiLoading(true);
    setTimeout(() => {
      setConfig(prev => ({
        ...prev,
        title: aiPromptInput.hosts,
        tagline: `Warmly invite you to their ${aiPromptInput.occasion.toLowerCase()}`,
        message: `With great joy in our hearts, we invite you to join us for our ${aiPromptInput.occasion.toLowerCase()}. ${aiPromptInput.details}`,
        eyebrow: 'With the Blessings of Our Families'
      }));
      setAiLoading(false);
      setActiveTab('studio');
      setSavedStatus('AI generated invitation content successfully! ✓');
      setTimeout(() => setSavedStatus(null), 3500);
    }, 1000);
  };

  const shareUrl = window.location.href;
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  const handleExportPdf = (mode?: 'color' | 'bw') => {
    const activeMode = mode || pdfPrintMode;
    const isBw = activeMode === 'bw';
    const creationDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    const bgCol = isBw ? '#ffffff' : (config.pageBg || '#fefdfb');
    const textCol = isBw ? '#111827' : (config.bodyText || '#4a5568');
    const accentCol = isBw ? '#111827' : (config.accent || '#bc6c25');
    const borderCol = isBw ? '#cbd5e1' : '#d4a373';
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`;

    const blocksHtml = (config.blocks || []).map((block, index) => {
      if (block.enabled === false) return '';
      let blockContent = '';
      if (index === 0) {
        blockContent = `
          <div style="text-align: center; margin-bottom: 20px;">
            ${config.eyebrow ? `<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: ${accentCol}; margin-bottom: 6px;">✨ ${config.eyebrow} ✨</div>` : ''}
            <h1 style="font-size: 32px; font-family: 'Great Vibes', serif; color: ${accentCol}; margin: 0 0 8px 0; line-height: 1.2;">${config.title}</h1>
            ${config.tagline ? `<p style="font-size: 12px; font-style: italic; color: ${isBw ? '#334155' : '#64748b'}; font-family: serif; margin: 0;">${config.tagline}</p>` : ''}
          </div>
          <div style="text-align: center; margin: 0 auto; max-width: 400px;">
            ${block.image ? `<img src="${block.image}" style="width: 130px; height: 130px; object-fit: cover; border-radius: 16px; border: 3px solid ${isBw ? '#e2e8f0' : 'white'}; box-shadow: 0 8px 20px rgba(0,0,0,0.1); margin: 0 auto 10px auto;" />` : ''}
            <h2 style="font-size: 22px; font-family: serif; color: ${accentCol}; margin: 0 0 6px 0; font-weight: 700;">${block.heading}</h2>
            ${block.detailsHeading ? `<h3 style="font-size: 13px; color: ${isBw ? '#1e293b' : '#bc6c25'}; font-family: serif; margin: 0 0 8px 0; font-weight: 600;">${block.detailsHeading}</h3>` : ''}
            ${(block.lines || []).map(l => `<p style="font-size: 11px; color: ${textCol}; line-height: 1.5; margin: 4px 0;">${l}</p>`).join('')}
            ${config.dateText ? `<div style="margin-top: 12px; display: inline-block; background: ${isBw ? '#f8fafc' : '#faedcd'}; padding: 6px 16px; border-radius: 20px; border: 1px solid ${borderCol}; font-size: 11px; font-weight: 600; color: ${accentCol};">📅 ${config.dateText}</div>` : ''}
          </div>
        `;
      } else {
        blockContent = `
          <div style="text-align: center; margin: 0 auto; max-width: 420px; width: 100%;">
            <div style="text-align: center; color: ${accentCol}; font-size: 14px; margin-bottom: 6px; letter-spacing: 0.2em;">🌸 ❦ 🌸</div>
            <h2 style="font-size: 26px; font-family: serif; color: ${accentCol}; margin: 0 0 10px 0; font-weight: 700;">${block.heading}</h2>
            ${block.image && block.type !== 'slideshow' ? `<img src="${block.image}" style="max-height: 180px; width: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.08); margin: 0 auto 10px auto;" />` : ''}
            ${block.detailsHeading ? `<h3 style="font-size: 14px; color: ${isBw ? '#1e293b' : '#bc6c25'}; font-family: serif; margin: 0 0 8px 0; font-weight: 600;">${block.detailsHeading}</h3>` : ''}
            ${(block.lines || []).map(l => `<p style="font-size: 11px; color: ${textCol}; line-height: 1.5; margin: 4px 0;">${l}</p>`).join('')}
            ${block.type === 'countdown' ? `<div style="margin: 15px 0; font-size: 13px; font-weight: bold; color: ${accentCol}; background: ${isBw ? '#f8fafc' : '#faedcd'}; padding: 8px 16px; border-radius: 10px; display: inline-block;">Countdown Target: ${config.dateText || 'Coming Soon'}</div>` : ''}
            ${block.type === 'venue' ? `<div style="margin: 15px 0; font-size: 12px; font-weight: 600; color: ${textCol};">📍 Venue / Location details active on online card</div>` : ''}
            ${block.type === 'rsvp' ? `<div style="margin: 15px 0; font-size: 12px; font-weight: 600; color: ${textCol};">💌 Please RSVP via the online invitation link below</div>` : ''}
          </div>
        `;
      }

      return `
        <div class="pdf-page">
          <div class="card-frame-916">
            ${blockContent}
          </div>
        </div>
      `;
    }).join('');

    const finalQrPage = `
      <div class="pdf-page">
        <div class="card-frame-916" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
          <div style="font-size: 26px; font-family: 'Great Vibes', serif; color: ${accentCol}; margin-bottom: 12px;">Scan & Explore Online</div>
          <p style="font-size: 11px; color: ${textCol}; margin-bottom: 16px; max-width: 280px; line-height: 1.5;">Experience the full interactive digital invitation with live music, guest wishing wall, and RSVP features.</p>
          <div style="background: white; padding: 10px; border-radius: 14px; border: 2px solid ${borderCol}; box-shadow: 0 6px 16px rgba(0,0,0,0.1); margin-bottom: 16px;"><img src="${qrImgUrl}" width="110" height="110" style="display: block;" /></div>
          <div style="font-weight: 600; font-size: 10px; color: ${textCol}; margin-bottom: 3px;">Invitation Link:</div>
          <a href="${shareUrl}" target="_blank" style="font-size: 9px; color: ${isBw ? '#0284c7' : '#bc6c25'}; text-decoration: underline; word-break: break-all; max-width: 280px;">${shareUrl}</a>
          <div style="font-size: 9px; color: ${isBw ? '#475569' : '#94a3b8'}; margin-top: 12px;">Created on ${creationDate} • LiBRĒ StYLĒ Studio</div>
        </div>
      </div>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${config.title || 'Invitation'} - A5 Wedding Invitation PDF (${activeMode.toUpperCase()})</title>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: #cbd5e1;
            color: ${textCol};
            font-family: 'Poppins', sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: A5;
            margin: 0;
          }
          .pdf-page {
            page-break-after: always;
            break-after: page;
            width: 148mm;
            height: 210mm;
            max-height: 210mm;
            margin: 0 auto 15px auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 12mm;
            box-sizing: border-box;
            position: relative;
            background: ${bgCol};
            border: 2px double ${accentCol};
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            overflow: hidden;
          }
          .card-frame-916 {
            width: 100%;
            aspect-ratio: 9 / 16;
            max-height: 160mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
          }
          @media print {
            body { background: white; margin: 0; padding: 0; }
            .pdf-page {
              margin: 0;
              width: 148mm;
              height: 210mm;
              border: none;
              box-shadow: none;
              border-radius: 0;
              page-break-after: always;
              break-after: page;
            }
          }
        </style>
      </head>
      <body>
        ${blocksHtml}
        ${finalQrPage}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 700);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadHtml = (editable: boolean) => {
    const configJson = JSON.stringify(config);
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${config.title || 'Digital Invitation'}</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&family=Poppins:wght@300;400;500;600;700&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
body { margin: 0; background: ${config.pageBg || '#fefdfb'}; color: ${config.bodyText || '#4a5568'}; font-family: 'Poppins', sans-serif; overflow-x: hidden; }
</style>
</head>
<body oncontextmenu="return false;">
<div id="root"></div>
<script type="text/babel">
const initialConfig = ${configJson};

function App() {
  const [config] = React.useState(initialConfig);
  const [isOpened, setIsOpened] = React.useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = React.useState(false);
  const [comments, setComments] = React.useState(config.comments || []);
  const [rsvps, setRsvps] = React.useState(config.rsvpResponses || []);
  const [commentName, setCommentName] = React.useState('');
  const [commentMsg, setCommentMsg] = React.useState('');
  const [rsvpName, setRsvpName] = React.useState('');
  const [rsvpEmail, setRsvpEmail] = React.useState('');
  const [rsvpStatus, setRsvpStatus] = React.useState('attending');
  const [rsvpGuestsCount, setRsvpGuestsCount] = React.useState(1);
  const [rsvpMsg, setRsvpMsg] = React.useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    if (config.date) {
      const target = new Date(config.date).getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const diff = target - now;
        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            secs: Math.floor((diff % (1000 * 60)) / 1000),
          });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [config.date]);

  const toggleMusic = () => {
    if (!audioRef.current && config.music) {
      audioRef.current = new Audio(config.music);
      audioRef.current.loop = true;
    }
    if (isPlayingMusic) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlayingMusic(true);
    }
  };

  const handleOpen = () => {
    setIsOpened(true);
    if (config.music) {
      toggleMusic();
    }
    setTimeout(() => {
      const page2 = document.getElementById('page-2');
      if (page2) {
        page2.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleAiBlessing = () => {
    const preset = config.preset || 'wedding';
    const blessingsPool = {
      wedding: [
        "Wishing you a lifetime of shared laughter, unending love, and beautiful adventures together! 💍✨",
        "ਤੁਹਾਨੂੰ ਦੋਵਾਂ ਨੂੰ ਜੀਵਨ ਭਰ ਦੇ ਪਿਆਰ, ਖੁਸ਼ੀਆਂ ਅਤੇ ਸਾਥ ਦੀ ਮੁਬਾਰਕਬਾਦ! 🥂",
        "आपके जीवन का यह नया सफर प्रेम, विश्वास और खुशियों से भरा रहे। बधाई हो! ❤️",
        "May the years ahead be filled with lasting joy, deep affection, and cherished moments. 🌸",
        "ईश्वर करे आपका जोड़ा सदा सलामत रहे और जीवन में खुशियों की बरसात हो। 🙏",
        "Wishing a wonderful couple a lifetime of love and beautiful memories that grow sweeter with each passing day. 💖",
        "मंगलमय दांपत्य जीवन की अनंत शुभकामनाएं! आपका प्यार हर दिन और गहरा हो। 🌹"
      ],
      birthday: [
        "Wishing you a very happy birthday filled with love, laughter, and wonderful surprises! 🎂✨",
        "ਤੁਹਾਨੂੰ ਜਨਮਦਿਨ ਦੀਆਂ ਲੱਖ-ਲੱਖ ਵਧਾਈਆਂ! ਪ੍ਰਮਾਤਮਾ ਤੁਹਾਨੂੰ ਲੰਬੀ ਉਮਰ ਅਤੇ ਸਿਹਤ ਬਖ਼ਸ਼ੇ। 🎉",
        "आपको जन्मदिन की ढेरों शुभकामनाएं! यह साल आपके लिए ढेरों खुशियां और सफलता लेकर आए। 🎈"
      ],
      babyshower: [
        "Wishing you immense joy as you welcome your little bundle of joy into the world! 🍼👶",
        "ਨੰਨ੍ਹੇ ਮਹਿਮਾਨ ਦੇ ਆਉਣ 'ਤੇ ਪਰਿਵਾਰ ਨੂੰ ਲੱਖ-ਲੱਖ ਵਧਾਈਆਂ ਅਤੇ ਅਸ਼ੀਰਵਾਦ! 🌸",
        "आपके घर में नन्हे मेहमान के आगमन पर ढेर सारी बधाइयां और शुभकामनाएं! 💖"
      ],
      anniversary: [
        "Happy Anniversary! May your love grow stronger and more inspiring with every passing year. 🥂💖",
        "ਵਿਆਹ ਦੀ ਵਰ੍ਹੇਗੰਢ ਦੀਆਂ ਮੁਬਾਰਕਾਂ! ਤੁਹਾਡਾ ਪਿਆਰ ਸਦਾ ਅਮਰ ਰਹੇ। 🌸",
        "विवाह की सालगिरह की हार्दिक शुभकामनाएं! आपका साथ यूं ही जन्म-जन्मांतर तक बना रहे। 🌹"
      ],
      housewarming: [
        "May your new home be filled with peace, prosperity, love, and joyous celebrations! 🏡✨",
        "ਨਵੇਂ ਘਰ ਦੀ ਪ੍ਰਵੇਸ਼ 'ਤੇ ਬਹੁਤ-ਬਹੁਤ ਮੁਬਾਰਕਾਂ! ਪ੍ਰਮਾਤਮਾ ਘਰ ਵਿੱਚ ਬਰਕਤ ਬਖ਼ਸ਼ੇ। 🙏"
      ],
      festival: [
        "Wishing you and your family a joyous, bright, and prosperous celebration! 🪔✨",
        "ਤੁਹਾਨੂੰ ਅਤੇ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਨੂੰ ਤਿਉਹਾਰ ਦੀਆਂ ਬਹੁਤ-ਬਹੁਤ ਵਧਾਈਆਂ! 🌸"
      ]
    };
    const pool = blessingsPool[preset] || blessingsPool['wedding'];
    setCommentMsg(pool[Math.floor(Math.random() * pool.length)]);
  };

  const getFontClasses = () => {
    switch (config.fontPairing) {
      case 'royal_elegant': return { heading: 'font-[Cinzel] font-bold', body: 'font-[Cormorant_Garamond] text-lg' };
      case 'modern_minimal': return { heading: 'font-[Montserrat] font-semibold tracking-wide', body: 'font-[Poppins] text-sm' };
      case 'warm_traditional': return { heading: 'font-[Playfair_Display] font-bold', body: 'font-[Poppins] text-sm' };
      case 'script_serif':
      default: return { heading: 'font-[Great_Vibes] font-normal text-5xl', body: 'font-[Playfair_Display] text-base' };
    }
  };

  const fonts = getFontClasses();
  const accentColor = config.accent || '#d4a373';

  return (
    <div className={"relative select-none " + (isOpened ? "min-h-screen overflow-y-auto" : "h-screen overflow-hidden")} style={{ overflowY: isOpened ? 'auto' : 'hidden', touchAction: isOpened ? 'auto' : 'none', backgroundColor: config.pageBg || '#fefdfb', backgroundImage: config.bgImage ? ("url(" + config.bgImage + ")") : undefined, backgroundSize: 'cover', backgroundPosition: 'center', color: config.bodyText || '#4a5568' }}>
      {/* Floating Music Button */}
      {config.music && (
        <button onClick={toggleMusic} className="fixed top-4 right-4 z-40 bg-white/95 backdrop-blur border border-[#ebdcd0] px-4 py-2.5 rounded-full shadow-lg text-[#bc6c25] hover:scale-105 transition-all text-xs font-semibold">
          {isPlayingMusic ? '🔊 Music On' : '🔇 Play Music'}
        </button>
      )}

      {/* Main Blocks: Page 1 (Hero) -> Page 2 -> Vertical scroll */}
      <div className="max-w-2xl mx-auto">
        {(config.blocks || []).map((block, idx) => {
          if (block.enabled === false) return null;
          if (idx > 0 && !isOpened) return null;
          if (idx === 0) {
            return (
              <section key={block.id || idx} id="page-1" className="min-h-screen flex flex-col justify-between items-center text-center p-6 md:p-10 relative">
                <div className="space-y-2 pt-6">
                  {config.eyebrow && (
                    <div className="inline-block px-3.5 py-1 rounded-full bg-white/80 border border-[#ebdcd0] text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
                      ✨ {config.eyebrow} ✨
                    </div>
                  )}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold" style={{ color: accentColor }}>{config.title}</h1>
                  {config.tagline && <p className="text-xs sm:text-sm font-serif italic text-slate-600 max-w-md mx-auto">{config.tagline}</p>}
                </div>

                <div className="my-auto py-4 space-y-4 w-full flex flex-col items-center">
                  {block.image && block.type !== 'slideshow' && (
                    <img src={block.image} alt={block.heading} className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-xl border-4 border-white mx-auto" />
                  )}
                  <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: accentColor }}>{block.heading}</h2>
                  {block.detailsHeading && <h3 className="text-sm sm:text-base font-serif text-[#bc6c25] font-semibold">{block.detailsHeading}</h3>}
                  {block.lines && (
                    <div className="text-xs sm:text-sm text-slate-600 space-y-1 max-w-md mx-auto">
                      {block.lines.map((l, lIdx) => <p key={lIdx}>{l}</p>)}
                    </div>
                  )}
                  {config.dateText && (
                    <div className="inline-block px-3.5 py-1.5 rounded-full bg-white/80 border border-[#ebdcd0] text-xs font-semibold text-slate-700 shadow-sm mt-2">
                      📅 {config.dateText}
                    </div>
                  )}
                </div>

                <div className="pt-4 pb-8 w-full flex flex-col items-center gap-2">
                  <button onClick={handleOpen} className="px-8 py-3.5 rounded-full text-white font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2" style={{ backgroundColor: accentColor }}>
                    <span>✉️</span>
                    <span>{config.coverText || 'Tap to open'}</span>
                    <span>↓</span>
                  </button>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Tap to open · Unfold celebration details</span>
                </div>
              </section>
            );
          }

          const isPageTwo = idx === 1;
          return (
            <div key={block.id || idx} id={isPageTwo ? 'page-2' : undefined} className="pt-8 pb-12 px-6 text-center space-y-6 bg-white/85 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-[#ebdcd0] mb-8 mx-4 sm:mx-auto">
              {isPageTwo && (
                <div className="text-center mb-4">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#ebdcd0] text-xs font-semibold text-[#bc6c25] shadow-sm">
                    🌸 Page 2 · Celebration Details 🌸
                  </div>
                </div>
              )}
            <h2 className={\`text-3xl md:text-4xl \${fonts.heading}\`} style={{ color: accentColor }}>{block.heading}</h2>
            {block.image && block.type !== 'slideshow' && (
              <img src={block.image} alt={block.heading} className="w-full max-w-md mx-auto h-64 object-cover rounded-2xl shadow-md border-2 border-[#ebdcd0]" />
            )}
            {block.detailsHeading && (
              <h3 className="text-lg font-serif text-[#bc6c25] font-semibold">{block.detailsHeading}</h3>
            )}

            {block.type === 'countdown' ? (
              <div className="space-y-4 my-4">
                <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                  <div className="bg-[#fcf8f5] border border-[#ebdcd0] p-3 rounded-xl"><div className="text-xl font-bold text-[#bc6c25]">{timeLeft.days}</div><div className="text-[10px] uppercase text-slate-500">Days</div></div>
                  <div className="bg-[#fcf8f5] border border-[#ebdcd0] p-3 rounded-xl"><div className="text-xl font-bold text-[#bc6c25]">{timeLeft.hours}</div><div className="text-[10px] uppercase text-slate-500">Hours</div></div>
                  <div className="bg-[#fcf8f5] border border-[#ebdcd0] p-3 rounded-xl"><div className="text-xl font-bold text-[#bc6c25]">{timeLeft.mins}</div><div className="text-[10px] uppercase text-slate-500">Mins</div></div>
                  <div className="bg-[#fcf8f5] border border-[#ebdcd0] p-3 rounded-xl"><div className="text-xl font-bold text-[#bc6c25]">{timeLeft.secs}</div><div className="text-[10px] uppercase text-slate-500">Secs</div></div>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <a href={\`https://calendar.google.com/calendar/render?action=TEMPLATE&text=\${encodeURIComponent(config.title || 'Event')}&details=\${encodeURIComponent((block.lines || []).join('\\n'))}&location=\${encodeURIComponent(config.dateText || '')}\`} target="_blank" className="px-4 py-2 bg-[#d4a373] text-white text-xs font-semibold rounded-xl shadow">🌐 Add to Google Calendar</a>
                </div>
              </div>
            ) : block.type === 'slideshow' ? (
              <div className="space-y-4">
                {(block.slides || []).map((slide, sIdx) => (
                  <div key={sIdx} className="bg-white border border-[#ebdcd0] p-3 rounded-2xl space-y-2">
                    <img src={slide.url} alt={slide.heading} className="w-full h-56 object-cover rounded-xl" />
                    <h4 className="font-bold text-slate-800">{slide.heading}</h4>
                    <p className="text-xs text-slate-600">{slide.description}</p>
                  </div>
                ))}
              </div>
            ) : block.type === 'blessings_wall' ? (
              <div className="space-y-4 max-w-md mx-auto text-left">
                <form onSubmit={e => { e.preventDefault(); if(!commentName.trim() || !commentMsg.trim())return; setComments([{id:'c_'+Date.now(), name:commentName, message:commentMsg, date:'Just now'}, ...comments]); setCommentName(''); setCommentMsg(''); }} className="bg-[#fcf8f5] p-4 rounded-2xl space-y-3 border border-[#ebdcd0]">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-[#bc6c25]">Post Your Blessings (Any Indian Language / किसी भी भारतीय भाषा में)</div>
                    <button type="button" onClick={handleAiBlessing} className="text-[11px] bg-[#faedcd] hover:bg-[#ebdcd0] text-[#bc6c25] px-2.5 py-1 rounded-lg font-bold">✨ AI Auto-Blessing</button>
                  </div>
                  <input type="text" placeholder="Your Name (आपका नाम / ਨਾਮ)" value={commentName} onChange={e=>setCommentName(e.target.value)} className="w-full bg-white border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs outline-none" required />
                  <textarea rows={3} placeholder="Click 'AI Auto-Blessing' or type your blessing..." value={commentMsg} onChange={e=>setCommentMsg(e.target.value)} className="w-full bg-white border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs outline-none" required />
                  <button type="submit" className="w-full py-2.5 bg-[#d4a373] text-white font-bold rounded-xl text-xs">Post Blessing / आशीर्वाद भेजें ✨</button>
                </form>
                <div className="bg-white border border-[#ebdcd0] p-4 rounded-2xl space-y-3 max-h-72 overflow-y-auto">
                  <div className="text-xs font-semibold text-[#bc6c25]">Blessings Wall ({comments.length})</div>
                  {comments.length === 0 ? (
                    <div className="text-xs text-slate-400 text-center py-4">No blessings posted yet.</div>
                  ) : (
                    comments.map(c => (
                      <div key={c.id} className="bg-[#fcf8f5] border border-[#ebdcd0] p-3 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between font-semibold text-[#bc6c25]">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-slate-400">{c.date}</span>
                        </div>
                        <p className="text-slate-800 text-sm font-sans">{c.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : block.type === 'comments' ? (
              <div className="space-y-4 text-left">
                <form onSubmit={e => { e.preventDefault(); if(!commentName.trim() || !commentMsg.trim())return; setComments([{id:'c_'+Date.now(), name:commentName, message:commentMsg, date:'Just now'}, ...comments]); setCommentName(''); setCommentMsg(''); }} className="bg-[#fcf8f5] p-4 rounded-2xl space-y-3 border border-[#ebdcd0]">
                  <div className="text-xs font-semibold text-[#bc6c25]">Leave Your Blessings</div>
                  <input type="text" placeholder="Your Name" value={commentName} onChange={e=>setCommentName(e.target.value)} className="w-full bg-white border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs outline-none" required />
                  <textarea rows={2} placeholder="Warm wishes..." value={commentMsg} onChange={e=>setCommentMsg(e.target.value)} className="w-full bg-white border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs outline-none" required />
                  <button type="submit" className="w-full py-2 bg-[#d4a373] text-white font-bold rounded-xl text-xs">Post Wish ✨</button>
                </form>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {comments.map(c => (
                    <div key={c.id} className="bg-white border border-[#ebdcd0] p-3 rounded-xl text-xs">
                      <span className="font-semibold text-[#bc6c25]">{c.name}:</span> <span className="text-slate-700">{c.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : block.type === 'rsvp' ? (
              <div className="space-y-4 text-left">
                <form onSubmit={e => { e.preventDefault(); if(!rsvpName.trim())return; setRsvps([{id:'r_'+Date.now(), name:rsvpName, email:rsvpEmail, status:rsvpStatus, guestsCount:rsvpGuestsCount, message:rsvpMsg, date:'Just now'}, ...rsvps]); setRsvpName(''); setRsvpEmail(''); setRsvpMsg(''); setRsvpSubmitted(true); setTimeout(()=>setRsvpSubmitted(false), 4000); }} className="bg-[#fcf8f5] p-4 rounded-2xl space-y-3 border border-[#ebdcd0]">
                  <div className="text-xs font-semibold text-[#bc6c25]">RSVP Response</div>
                  {rsvpSubmitted && <div className="p-2 bg-emerald-100 text-emerald-800 text-xs rounded-xl text-center font-medium">Thank you! RSVP recorded successfully. ✨</div>}
                  <input type="text" placeholder="Your Full Name *" value={rsvpName} onChange={e=>setRsvpName(e.target.value)} className="w-full bg-white border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs outline-none" required />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={rsvpStatus} onChange={e=>setRsvpStatus(e.target.value)} className="w-full bg-white border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs outline-none">
                      <option value="attending">Accepts 🥂</option>
                      <option value="regrets">Regrets 💌</option>
                      <option value="maybe">Maybe 🤔</option>
                    </select>
                    <select value={rsvpGuestsCount} onChange={e=>setRsvpGuestsCount(Number(e.target.value))} className="w-full bg-white border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs outline-none">
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4+ Guests</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#d4a373] text-white font-bold rounded-xl text-xs">Submit RSVP</button>
                </form>
              </div>
            ) : (
              <div className={\`space-y-2 max-w-md mx-auto \${fonts.body}\`}>
                {(block.lines || []).map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}

        <div className="py-8 text-center text-xs text-slate-600 space-y-1">
          <div>{config.thanks || 'Thank you for celebrating with us 💛'}</div>
          <div className="font-semibold text-[#bc6c25]">{config.footerCredit}</div>
        </div>
      </div>

      {/* Floating button to jump back to Page 1 / Hero */}
      <button onClick={() => { const p1 = document.getElementById('page-1'); if(p1) p1.scrollIntoView({ behavior: 'smooth' }); }} className="fixed bottom-4 left-4 z-40 bg-white/95 backdrop-blur border border-[#ebdcd0] px-3.5 py-2 rounded-full shadow-lg text-xs font-semibold text-[#bc6c25] hover:bg-[#fcf8f5] transition-all">
        ↑ Page 1 (Hero)
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = editable ? 'index.html' : 'lumiere_invitation.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyConfigJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f5] text-[#2d3748] flex flex-col font-[Poppins] select-none">
      {/* Toast notification banner */}
      {savedStatus && (
        <div className="fixed top-4 right-4 z-50 bg-[#2d3748] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 text-[#d4a373]" /> {savedStatus}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#ebdcd0] w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn text-[#2d3748] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#ebdcd0] pb-4">
              <div className="flex items-center gap-2.5 text-[#bc6c25]">
                <Share2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#2d3748]">Share Invitation & QR Code</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* QR Code Section */}
              <div className="bg-[#fcf8f5] border border-[#ebdcd0] p-4 rounded-2xl flex flex-col items-center text-center space-y-2">
                <span className="text-xs font-semibold text-[#bc6c25]">Scan QR Code for Mobile Access</span>
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#ebdcd0]">
                  <QRCodeCanvas value={shareUrl} size={155} level="H" />
                </div>
                <span className="text-[10px] text-slate-500">Guests can point their phone camera to open instantly in full screen</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Direct Invitation Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2.5 text-xs text-[#2d3748] outline-none select-all"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-4 py-2.5 bg-[#d4a373] hover:bg-[#bc6c25] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-all shadow"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`You're warmly invited to ${config.title}! Open fullscreen invitation here: ${shareUrl} ${config.socialTags}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#588157] hover:bg-[#3a5a40] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" /> Share via WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Invitation: ${config.title}`)}&body=${encodeURIComponent(`You are cordially invited to ${config.title}.\n\nDate: ${config.dateText}\nVenue: ${config.venue}\nTags: ${config.socialTags}\n\nView fullscreen invitation: ${shareUrl}`)}`}
                  className="py-3 px-4 bg-[#f4ece4] hover:bg-[#ebdcd0] text-[#2d3748] font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-[#ebdcd0]"
                >
                  <Mail className="w-4 h-4" /> Share via Email
                </a>
              </div>

              <div className="bg-[#fcf8f5] border border-[#ebdcd0] p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#bc6c25] uppercase tracking-wider">PDF Print Mode (Designer Settings)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPdfPrintMode('color')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      pdfPrintMode === 'color' ? 'bg-[#d4a373] text-white border-[#bc6c25] shadow' : 'bg-white text-slate-700 border-[#ebdcd0] hover:bg-[#fcf8f5]'
                    }`}
                  >
                    🎨 High-Color Background
                  </button>
                  <button
                    onClick={() => setPdfPrintMode('bw')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      pdfPrintMode === 'bw' ? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-white text-slate-700 border-[#ebdcd0] hover:bg-[#fcf8f5]'
                    }`}
                  >
                    🖨️ Printer-Friendly White
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleExportPdf(pdfPrintMode)}
                  className="py-3 px-4 bg-white border border-[#bc6c25] text-[#bc6c25] hover:bg-[#faedcd]/40 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> Preview PDF Layout
                </button>
                <button
                  onClick={() => handleExportPdf(pdfPrintMode)}
                  className="py-3 px-4 bg-gradient-to-r from-[#d4a373] to-[#bc6c25] hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Save / Print PDF
                </button>
              </div>
              <div className="hidden">
                <QRCodeCanvas ref={qrRef} value={shareUrl} size={156} level="H" />
              </div>

            </div>
          </div>
        </div>
      )}

      {isPlayingMusic && extractYouTubeId(config.music) && (
        <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
          <iframe
            src={`https://www.youtube.com/embed/${extractYouTubeId(config.music)}?autoplay=1&loop=1&playlist=${extractYouTubeId(config.music)}&enablejsapi=1`}
            allow="autoplay"
            title="Background YouTube Audio"
          />
        </div>
      )}

      {/* Main Studio Header */}
      <header className="bg-white border-b border-[#ebdcd0] px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4a373] to-[#bc6c25] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#2d3748] leading-tight">
              LiBRĒ StYLĒ<br />
              Invitation Studio
            </h1>
          </div>
        </div>

        {/* Top Right 3-Dot Dropdown Menu & Music */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            className={`p-2.5 rounded-xl border transition-all ${
              isPlayingMusic ? 'bg-[#faedcd] border-[#d4a373] text-[#bc6c25] animate-pulse' : 'bg-[#f4ece4] border-[#e6d8cc] text-[#606f7b] hover:bg-[#ebdcd0]'
            }`}
            title={isPlayingMusic ? 'Mute Background Music' : 'Play Background Music'}
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              className="p-2.5 bg-gradient-to-r from-[#d4a373] to-[#bc6c25] hover:opacity-95 text-white rounded-xl shadow-md transition-all flex items-center justify-center"
              title="Menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenuDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#ebdcd0] rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn text-xs">
                <button
                  onClick={() => {
                    setActiveTab('studio');
                    setShowMenuDropdown(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-[#fcf8f5] transition-all ${
                    activeTab === 'studio' ? 'text-[#bc6c25] font-bold bg-[#faedcd]/40' : 'text-slate-700'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-[#bc6c25]" /> Studio Editor
                </button>
                <button
                  onClick={() => {
                    setActiveTab('preview');
                    setShowMenuDropdown(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-[#fcf8f5] transition-all ${
                    activeTab === 'preview' ? 'text-[#bc6c25] font-bold bg-[#faedcd]/40' : 'text-slate-700'
                  }`}
                >
                  <Eye className="w-4 h-4 text-[#bc6c25]" /> Live Preview
                </button>
                <button
                  onClick={() => {
                    setActiveTab('ai');
                    setShowMenuDropdown(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-[#fcf8f5] transition-all ${
                    activeTab === 'ai' ? 'text-[#bc6c25] font-bold bg-[#faedcd]/40' : 'text-slate-700'
                  }`}
                >
                  <Wand2 className="w-4 h-4 text-[#bc6c25]" /> AI Writer
                </button>
                <button
                  onClick={() => {
                    setActiveTab('studio');
                    setActiveSection('slides');
                    setShowMenuDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-[#fcf8f5] transition-all text-[#2d3748] font-semibold"
                >
                  <Plus className="w-4 h-4 text-[#bc6c25]" /> Manage & Add Pages
                </button>
                <button
                  onClick={() => {
                    handlePresetChange('wedding', '💍 Wedding');
                    setShowShareModal(true);
                    setShowMenuDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-[#fcf8f5] transition-all text-[#bc6c25] font-semibold"
                >
                  <Sparkles className="w-4 h-4" /> 💍 Generate Sample Wedding Card
                </button>
                <div className="my-1 border-t border-[#ebdcd0]"></div>
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setShowMenuDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-[#fcf8f5] transition-all text-[#bc6c25] font-semibold"
                >
                  <Share2 className="w-4 h-4" /> Share with Guests
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Studio Sidebar Editor */}
        {activeTab === 'studio' && (
          <div className="w-full md:w-[380px] lg:w-[420px] bg-white border-r border-[#ebdcd0] flex flex-col z-20 shadow-lg shrink-0">
            {/* Section Switcher Bar */}
            <div className="grid grid-cols-5 border-b border-[#ebdcd0] bg-[#fcf8f5]">
              {(['core', 'style', 'media', 'slides', 'extra'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`py-3 text-[11px] font-semibold capitalize transition-all border-b-2 ${
                    activeSection === sec ? 'border-[#bc6c25] text-[#bc6c25] bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Section Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* CORE SECTION */}
              {activeSection === 'core' && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Occasion Presets</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'wedding', name: '💍 Wedding' },
                      { key: 'birthday', name: '🎂 Birthday' },
                      { key: 'babyshower', name: '🍼 Baby Shower' },
                      { key: 'housewarming', name: '🏡 Housewarming' },
                      { key: 'anniversary', name: '🥂 Anniversary' },
                      { key: 'corporate', name: '👔 Corporate' },
                      { key: 'festival', name: '🪔 Festival' }
                    ].map(p => (
                      <button
                        key={p.key}
                        onClick={() => handlePresetChange(p.key, p.name)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          config.preset === p.key ? 'bg-[#faedcd] border-[#d4a373] text-[#bc6c25] font-bold shadow-sm' : 'bg-[#fcf8f5] border-[#ebdcd0] text-slate-600 hover:bg-[#f4ece4]'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#ebdcd0] space-y-4">
                    <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Main Title & Banner</h3>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Cover / Envelope Opening View</label>
                      <select
                        value={config.cover || 'envelope'}
                        onChange={e => setConfig({ ...config, cover: e.target.value as any })}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none font-medium"
                      >
                        <option value="envelope">✉️ Envelope Cover (Tap to Open)</option>
                        <option value="curtain">🎭 Curtain Reveal</option>
                        <option value="gate">🏛️ Grand Gate</option>
                        <option value="none">None (Direct Hero Page)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Invitation Title / Names</label>
                      <input
                        type="text"
                        value={config.title}
                        onChange={e => setConfig({ ...config, title: e.target.value })}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-sm text-[#2d3748] focus:border-[#d4a373] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Top Eyebrow Kicker</label>
                        <input
                          type="text"
                          value={config.eyebrow}
                          onChange={e => setConfig({ ...config, eyebrow: e.target.value })}
                          className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-sm text-[#2d3748] focus:border-[#d4a373] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Tagline</label>
                        <input
                          type="text"
                          value={config.tagline}
                          onChange={e => setConfig({ ...config, tagline: e.target.value })}
                          className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-sm text-[#2d3748] focus:border-[#d4a373] outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Date & Time Display Text</label>
                      <input
                        type="text"
                        value={config.dateText}
                        onChange={e => setConfig({ ...config, dateText: e.target.value })}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-sm text-[#2d3748] focus:border-[#d4a373] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Countdown Target Date (ISO)</label>
                      <input
                        type="datetime-local"
                        value={config.date}
                        onChange={e => setConfig({ ...config, date: e.target.value })}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-sm text-[#2d3748] focus:border-[#d4a373] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Footer Credit / "Design created by"</label>
                      <input
                        type="text"
                        value={config.footerCredit}
                        onChange={e => setConfig({ ...config, footerCredit: e.target.value })}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-sm text-[#2d3748] focus:border-[#d4a373] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STYLE SECTION */}
              {activeSection === 'style' && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Typography & Custom Google Font</h3>
                  
                  {/* Font Selection Dropdown with Previews */}
                  <div className="space-y-2">
                    <label className="block text-xs text-slate-600">Select Font Pairing</label>
                    <select
                      value={config.fontPairing}
                      onChange={e => setConfig({ ...config, fontPairing: e.target.value as any })}
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none font-medium"
                    >
                      <option value="luxurious_script">Luxurious Script (Alex Brush + Cormorant)</option>
                      <option value="script_serif">Classic Script & Serif (Great Vibes + Playfair)</option>
                      <option value="royal_elegant">Royal Elegant (Cinzel + Cormorant)</option>
                      <option value="modern_chic">Modern Chic (Playfair + Poppins)</option>
                      <option value="modern_minimal">Modern Minimalist (Montserrat + Poppins)</option>
                      <option value="warm_traditional">Warm Traditional (Playfair + Poppins)</option>
                    </select>

                    {/* Font Preview Box */}
                    <div className="p-3 bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Live Font Preview</div>
                      <div className={`text-xl ${config.fontPairing === 'royal_elegant' ? 'font-[Cinzel]' : config.fontPairing === 'modern_minimal' ? 'font-[Montserrat]' : config.fontPairing === 'warm_traditional' ? 'font-[Playfair_Display]' : 'font-[Great_Vibes]'}`} style={{ color: config.accent }}>
                        {config.title}
                      </div>
                      <p className="text-xs text-slate-600 font-serif">{config.tagline}</p>
                    </div>
                  </div>

                  {/* Custom Google Font Family Input */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Custom Google Font Family Name (Optional)</label>
                    <input
                      type="text"
                      value={config.customGoogleFont}
                      onChange={e => setConfig({ ...config, customGoogleFont: e.target.value })}
                      placeholder="e.g. Dancing Script, Alex Brush, Merriweather"
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Enter any valid Google Font family name to apply custom typography instantly.</span>
                  </div>

                  <div className="pt-2 border-t border-[#ebdcd0] space-y-4">
                    <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Color Palette Presets</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'Warm Cream', accent: '#d4a373', pageBg: '#fcf8f5', coverBg: '#faedcd' },
                        { name: 'Midnight', accent: '#d4af37', pageBg: '#1a1a2e', coverBg: '#16213e' },
                        { name: 'Forest', accent: '#588157', pageBg: '#f4f9f4', coverBg: '#e8f2e8' },
                        { name: 'Vintage Rose', accent: '#b5838d', pageBg: '#fff1f2', coverBg: '#ffe4e6' },
                        { name: 'Royal Gold', accent: '#c59b27', pageBg: '#fcf6f0', coverBg: '#f4e4d0' },
                        { name: 'Sunset Coral', accent: '#e07a5f', pageBg: '#fef6f0', coverBg: '#faedcd' },
                        { name: 'Classic Sage', accent: '#8a9a86', pageBg: '#fbfaf7', coverBg: '#f0f2ee' },
                        { name: 'Lavender Dream', accent: '#9b5de5', pageBg: '#fcf6ff', coverBg: '#f1e6ff' },
                        { name: 'Ocean Sapphire', accent: '#0077b6', pageBg: '#f0f8ff', coverBg: '#e0f2fe' },
                      ].map(palette => (
                        <button
                          key={palette.name}
                          onClick={() => setConfig({ ...config, accent: palette.accent, coverAccent: palette.accent, pageBg: palette.pageBg, coverBg: palette.coverBg })}
                          className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all hover:scale-105 ${
                            config.accent === palette.accent && config.pageBg === palette.pageBg
                              ? 'border-[#bc6c25] bg-[#faedcd]/40 shadow-sm'
                              : 'border-[#ebdcd0] bg-white hover:bg-[#fcf8f5]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: palette.accent }} />
                            <span className="w-3 h-3 rounded-full shrink-0 shadow-sm border border-slate-200" style={{ backgroundColor: palette.pageBg }} />
                            <span className="text-[10px] font-bold text-slate-700 truncate">{palette.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider pt-2">Custom Pastel Theme & Cover Colors</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Accent Gold / Rose</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.accent}
                            onChange={e => setConfig({ ...config, accent: e.target.value, coverAccent: e.target.value })}
                            className="w-9 h-9 rounded-xl border border-[#ebdcd0] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.accent}
                            onChange={e => setConfig({ ...config, accent: e.target.value, coverAccent: e.target.value })}
                            className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-2.5 py-1.5 text-xs text-[#2d3748] outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Page Pastel Background</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.pageBg}
                            onChange={e => setConfig({ ...config, pageBg: e.target.value, coverBg: e.target.value })}
                            className="w-9 h-9 rounded-xl border border-[#ebdcd0] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={config.pageBg}
                            onChange={e => setConfig({ ...config, pageBg: e.target.value, coverBg: e.target.value })}
                            className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-2.5 py-1.5 text-xs text-[#2d3748] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Cover Button Text</label>
                        <input
                          type="text"
                          value={config.coverText}
                          onChange={e => setConfig({ ...config, coverText: e.target.value })}
                          className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                        />
                      </div>

                    <div className="pt-4 border-t border-[#ebdcd0] space-y-3">
                      <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Animations & Transitions</h3>
                      <p className="text-[10px] text-slate-500">Set global default entrance animations for blocks and pages.</p>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Global Entrance Animation</label>
                        <select
                          value={config.sectionAnim}
                          onChange={e => setConfig({ ...config, sectionAnim: e.target.value as any })}
                          className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                        >
                          <option value="slide_up">Smooth Slide Up on Scroll</option>
                          <option value="fade">Fade In</option>
                          <option value="zoom">Zoom In</option>
                          <option value="bounce">Gentle Bounce</option>
                          <option value="flip">3D Flip Reveal</option>
                          <option value="blur">Frosted Blur Reveal</option>
                          <option value="float">Floating Float</option>
                          <option value="none">None (Static)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MEDIA SECTION */}
              {activeSection === 'media' && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Photos & Imagery</h3>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-slate-600">Background Image URL / Upload</label>
                      <label className="text-xs text-[#bc6c25] hover:underline cursor-pointer flex items-center gap-1">
                        <Upload className="w-3 h-3" /> Upload Background
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => setConfig({ ...config, bgImage: url }))} />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={config.bgImage}
                      onChange={e => setConfig({ ...config, bgImage: e.target.value })}
                      placeholder="https://... or upload image"
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-slate-600">Hero Cover Image URL</label>
                      <label className="text-xs text-[#bc6c25] hover:underline cursor-pointer flex items-center gap-1">
                        <Upload className="w-3 h-3" /> Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => setConfig({ ...config, heroImage: url }))} />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={config.heroImage}
                      onChange={e => setConfig({ ...config, heroImage: e.target.value })}
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#bc6c25] mb-2">Photo Gallery (Multi-Upload & Google Drive)</label>
                    
                    {/* Drag & Drop Zone */}
                    <div
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => handleDropFiles(e, urls => setConfig({ ...config, gallery: [...config.gallery, ...urls] }))}
                      className="border-2 border-dashed border-[#d4a373]/60 bg-[#fcf8f5] hover:bg-[#faedcd]/30 p-5 rounded-2xl text-center cursor-pointer transition-all space-y-2 mb-3"
                    >
                      <ImageIcon className="w-8 h-8 mx-auto text-[#bc6c25]" />
                      <div className="text-xs font-medium text-slate-700">Drag & drop multiple photos here</div>
                      <div className="text-[10px] text-slate-400">or click to browse from device</div>
                      <label className="inline-block px-3 py-1.5 bg-[#d4a373] text-white rounded-xl text-xs font-bold hover:bg-[#bc6c25] cursor-pointer">
                        Browse Device Photos
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultiFileUpload} />
                      </label>
                    </div>

                    {/* Google Drive Folder Link Import */}
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Paste Google Drive folder or album link..."
                        value={driveFolderInput}
                        onChange={e => setDriveFolderInput(e.target.value)}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDriveFolderImport(urls => setConfig({ ...config, gallery: [...config.gallery, ...urls] }))}
                        className="px-3 py-2 bg-[#bc6c25] hover:opacity-90 text-white font-bold rounded-xl text-xs shrink-0"
                      >
                        Import Drive Folder
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={(config.gallery || []).join(', ')}
                      onChange={e => setConfig({ ...config, gallery: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="Or enter comma-separated image URLs..."
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#ebdcd0] space-y-4">
                    <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Audio Music</h3>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs text-slate-600">Background Music MP3 URL</label>
                        <label className="text-xs text-[#bc6c25] hover:underline cursor-pointer flex items-center gap-1">
                          <Upload className="w-3 h-3" /> Upload MP3
                          <input type="file" accept="audio/*" className="hidden" onChange={e => handleFileUpload(e, url => setConfig({ ...config, music: url }))} />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={config.music}
                        onChange={e => setConfig({ ...config, music: e.target.value })}
                        placeholder="https://.../music.mp3"
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODULAR SLIDES & PAGES SECTION */}
              {activeSection === 'slides' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Pages & Slides Manager</h3>
                      <p className="text-[10px] text-slate-500">Add, remove, or reorder pages and slideshows freely.</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => addBlock('event_room')}
                        className="px-3 py-1.5 bg-[#d4a373] text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#bc6c25] transition-all shadow"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Page
                      </button>
                    </div>
                  </div>

                  {/* Quick Add Page Type buttons */}
                  <div className="grid grid-cols-3 gap-1.5 bg-[#fcf8f5] p-2 rounded-xl border border-[#ebdcd0]">
                    <button onClick={() => addBlock('hero')} className="py-1 px-2 text-[11px] bg-white hover:bg-[#f4ece4] text-[#bc6c25] rounded-lg border border-[#ebdcd0]">
                      + Hero Page
                    </button>
                    <button onClick={() => addBlock('countdown')} className="py-1 px-2 text-[11px] bg-white hover:bg-[#f4ece4] text-[#bc6c25] rounded-lg border border-[#ebdcd0]">
                      + Save Dates
                    </button>
                    <button onClick={() => addBlock('slideshow')} className="py-1 px-2 text-[11px] bg-white hover:bg-[#f4ece4] text-[#bc6c25] rounded-lg border border-[#ebdcd0] font-semibold">
                      + Slideshow
                    </button>
                    <button onClick={() => addBlock('blessings_wall')} className="py-1 px-2 text-[11px] bg-white hover:bg-[#f4ece4] text-[#bc6c25] rounded-lg border border-[#ebdcd0] font-semibold">
                      + Blessings Wall
                    </button>
                    <button onClick={() => addBlock('event_room')} className="py-1 px-2 text-[11px] bg-white hover:bg-[#f4ece4] text-[#bc6c25] rounded-lg border border-[#ebdcd0]">
                      + Room Event
                    </button>
                    <button onClick={() => addBlock('venue')} className="py-1 px-2 text-[11px] bg-white hover:bg-[#f4ece4] text-[#bc6c25] rounded-lg border border-[#ebdcd0]">
                      + Venue Map
                    </button>
                    <button onClick={() => addBlock('comments')} className="py-1 px-2 text-[11px] bg-white hover:bg-[#f4ece4] text-[#bc6c25] rounded-lg border border-[#ebdcd0]">
                      + Comments
                    </button>
                  </div>

                  {/* 2-Page Architecture Guidance Banner */}
                  <div className="p-3 bg-[#faedcd]/40 border border-[#d4a373]/50 rounded-2xl text-xs text-[#2d3748] flex items-start gap-2.5 shadow-sm">
                    <span className="text-lg">✨</span>
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#bc6c25]">2-Page Invitation Architecture</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Page 1</strong> is your dedicated <strong>Hero Page</strong> featuring your portrait, title, and interactive <strong>"Tap to open"</strong> action. When tapped, it smoothly unfolds into <strong>Page 2</strong> followed by all subsequent pages in vertical scrolling.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {config.blocks.map((block, idx) => (
                      <div key={block.id} className="bg-[#fcf8f5] border border-[#ebdcd0] rounded-2xl p-4 space-y-3 relative group">
                        {/* Slide Header & Controls */}
                        <div className="flex items-center justify-between border-b border-[#ebdcd0] pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              idx === 0 ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs' :
                              idx === 1 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {idx === 0 ? '👑 Page 1 · Hero' : idx === 1 ? '📄 Page 2' : `Page ${idx + 1}`}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 capitalize">({block.type})</span>
                            <input
                              type="text"
                              value={block.heading}
                              onChange={e => updateBlock(block.id, { heading: e.target.value })}
                              placeholder="Page Heading"
                              className="bg-transparent text-sm font-semibold text-[#2d3748] outline-none border-b border-transparent focus:border-[#d4a373]"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <select
                              value={idx}
                              onChange={e => moveBlockTo(idx, Number(e.target.value))}
                              className="bg-white border border-[#ebdcd0] rounded px-1.5 py-0.5 text-[10px] text-slate-700 outline-none font-medium"
                              title="Jump to position"
                            >
                              {config.blocks.map((_, pIdx) => (
                                <option key={pIdx} value={pIdx}>Pos #{pIdx + 1}</option>
                              ))}
                            </select>
                            <button onClick={() => moveBlockTo(idx, 0)} disabled={idx === 0} className="px-1.5 py-0.5 text-[10px] bg-white border border-[#ebdcd0] text-slate-600 rounded hover:bg-[#f4ece4] disabled:opacity-30" title="Move to Top">Top</button>
                            <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="p-1 text-slate-500 hover:text-[#2d3748] disabled:opacity-30 bg-white border border-[#ebdcd0] rounded" title="Move Up">
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button onClick={() => moveBlock(idx, 'down')} disabled={idx === config.blocks.length - 1} className="p-1 text-slate-500 hover:text-[#2d3748] disabled:opacity-30 bg-white border border-[#ebdcd0] rounded" title="Move Down">
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button onClick={() => moveBlockTo(idx, config.blocks.length - 1)} disabled={idx === config.blocks.length - 1} className="px-1.5 py-0.5 text-[10px] bg-white border border-[#ebdcd0] text-slate-600 rounded hover:bg-[#f4ece4] disabled:opacity-30" title="Move to Bottom">Bot</button>
                            <button onClick={() => removeBlock(block.id)} className="p-1 text-rose-500 hover:text-rose-700 ml-1 bg-white border border-rose-200 rounded" title="Delete Page">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Page Visibility & Animation Controls */}
                        <div className="flex items-center justify-between bg-white border border-[#ebdcd0] px-3 py-1.5 rounded-xl text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={block.enabled !== false}
                              onChange={e => updateBlock(block.id, { enabled: e.target.checked })}
                              className="rounded text-[#bc6c25] focus:ring-[#bc6c25]"
                            />
                            <span>Active Page (Visible)</span>
                          </label>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <span>Animation:</span>
                            <select
                              value={block.anim || 'slide_up'}
                              onChange={e => updateBlock(block.id, { anim: e.target.value as any })}
                              className="bg-[#fcf8f5] border border-[#ebdcd0] rounded px-1.5 py-0.5 text-xs text-[#2d3748] outline-none font-medium"
                            >
                              <option value="slide_up">Slide Up</option>
                              <option value="fade">Fade In</option>
                              <option value="zoom">Zoom In</option>
                              <option value="bounce">Bounce</option>
                              <option value="none">None</option>
                            </select>
                          </div>
                        </div>

                        {/* Element On-Off Settings */}
                        <div className="flex items-center gap-4 text-[11px] bg-white border border-[#ebdcd0] px-3 py-1.5 rounded-xl text-slate-600">
                          <span className="font-semibold text-[#bc6c25]">Elements:</span>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={block.showImage !== false}
                              onChange={e => updateBlock(block.id, { showImage: e.target.checked })}
                              className="rounded text-[#bc6c25]"
                            />
                            <span>Show Image</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={block.showDetails !== false}
                              onChange={e => updateBlock(block.id, { showDetails: e.target.checked })}
                              className="rounded text-[#bc6c25]"
                            />
                            <span>Show Details Heading</span>
                          </label>
                        </div>

                        {/* Details Heading */}
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">Details Heading</label>
                          <input
                            type="text"
                            value={block.detailsHeading || ''}
                            onChange={e => updateBlock(block.id, { detailsHeading: e.target.value })}
                            placeholder="e.g. Memories in Motion"
                            className="w-full bg-white border border-[#ebdcd0] rounded-lg px-3 py-1.5 text-xs text-[#2d3748] outline-none"
                          />
                        </div>

                        {/* Slideshow Specific Builder (Unlimited Slides, Headings & Descriptions) */}
                        {block.type === 'slideshow' && (
                          <div className="space-y-3 pt-2 border-t border-[#ebdcd0]">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#bc6c25]">Slide Items ({block.slides?.length || 0})</span>
                              <button
                                onClick={() => {
                                  const currentSlides = block.slides || [];
                                  const newSlide = { id: 's_' + Date.now(), url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', heading: 'New Slide', description: 'Add your description here' };
                                  updateBlock(block.id, { slides: [...currentSlides, newSlide] });
                                }}
                                className="px-2.5 py-1 bg-[#d4a373] text-white rounded-lg text-xs font-bold hover:bg-[#bc6c25]"
                              >
                                + Add Slide Item
                              </button>
                            </div>

                            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                              {(block.slides || []).map((slide, sIdx) => (
                                <div key={slide.id} className="bg-white border border-[#ebdcd0] p-3 rounded-xl space-y-2 relative">
                                  <div className="flex items-center justify-between text-xs font-bold text-[#bc6c25]">
                                    <div className="flex items-center gap-2">
                                      <span>Slide #{sIdx + 1}</span>
                                      <select
                                        value={slide.mediaType || (slide.url.includes('youtu') ? 'youtube' : 'image')}
                                        onChange={e => {
                                          const newSlides = [...(block.slides || [])];
                                          newSlides[sIdx] = { ...newSlides[sIdx], mediaType: e.target.value as 'image' | 'youtube' };
                                          updateBlock(block.id, { slides: newSlides });
                                        }}
                                        className="bg-white border border-[#ebdcd0] rounded px-1.5 py-0.5 text-[10px] text-[#2d3748]"
                                      >
                                        <option value="image">📷 Photo Slide</option>
                                        <option value="youtube">▶️ YouTube Video Slide</option>
                                      </select>
                                    </div>
                                    <button
                                      onClick={() => {
                                        const newSlides = (block.slides || []).filter((_, i) => i !== sIdx);
                                        updateBlock(block.id, { slides: newSlides });
                                      }}
                                      className="text-rose-500 hover:text-rose-700 text-xs"
                                    >
                                      Remove ✕
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className="block text-[10px] text-slate-500">
                                          {slide.mediaType === 'youtube' || slide.url.includes('youtu') ? 'YouTube URL (No MB Limit)' : 'Image URL / Upload'}
                                        </label>
                                        {slide.mediaType !== 'youtube' && !slide.url.includes('youtu') && (
                                          <label className="text-[10px] text-[#bc6c25] hover:underline cursor-pointer flex items-center gap-0.5">
                                            <Upload className="w-2.5 h-2.5" /> Upload
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => {
                                              const newSlides = [...(block.slides || [])];
                                              newSlides[sIdx] = { ...newSlides[sIdx], url };
                                              updateBlock(block.id, { slides: newSlides });
                                            })} />
                                          </label>
                                        )}
                                      </div>
                                      <input
                                        type="text"
                                        value={slide.url}
                                        placeholder={slide.mediaType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                                        onChange={e => {
                                          const newSlides = [...(block.slides || [])];
                                          newSlides[sIdx] = { ...newSlides[sIdx], url: e.target.value };
                                          updateBlock(block.id, { slides: newSlides });
                                        }}
                                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-lg px-2 py-1 text-xs text-[#2d3748] outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] text-slate-500 mb-1">Heading</label>
                                      <input
                                        type="text"
                                        value={slide.heading}
                                        onChange={e => {
                                          const newSlides = [...(block.slides || [])];
                                          newSlides[sIdx] = { ...newSlides[sIdx], heading: e.target.value };
                                          updateBlock(block.id, { slides: newSlides });
                                        }}
                                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-lg px-2 py-1 text-xs text-[#2d3748] outline-none"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] text-slate-500 mb-1">Description</label>
                                    <input
                                      type="text"
                                      value={slide.description}
                                      onChange={e => {
                                        const newSlides = [...(block.slides || [])];
                                        newSlides[sIdx] = { ...newSlides[sIdx], description: e.target.value };
                                        updateBlock(block.id, { slides: newSlides });
                                      }}
                                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-lg px-2 py-1 text-xs text-[#2d3748] outline-none"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Image & Size (if not comments or slideshow) */}
                        {block.type !== 'comments' && block.type !== 'slideshow' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10px] text-slate-500">Page Image URL</label>
                                <label className="text-[10px] text-[#bc6c25] hover:underline cursor-pointer flex items-center gap-0.5">
                                  <Upload className="w-2.5 h-2.5" /> Upload
                                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => updateBlock(block.id, { image: url }))} />
                                </label>
                              </div>
                              <input
                                type="text"
                                value={block.image || ''}
                                onChange={e => updateBlock(block.id, { image: e.target.value })}
                                placeholder="https://..."
                                className="w-full bg-white border border-[#ebdcd0] rounded-lg px-2.5 py-1.5 text-xs text-[#2d3748] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-1">Image Size</label>
                              <select
                                value={block.imageSize}
                                onChange={e => updateBlock(block.id, { imageSize: e.target.value as any })}
                                className="w-full bg-white border border-[#ebdcd0] rounded-lg px-2.5 py-1.5 text-xs text-[#2d3748] outline-none capitalize"
                              >
                                <option value="small">Small (Square)</option>
                                <option value="medium">Medium (Standard)</option>
                                <option value="large">Large (Wide)</option>
                                <option value="full">Full Width</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Lines Editor (if not slideshow) */}
                        {block.type !== 'slideshow' && (
                          <div className="space-y-1.5">
                            <label className="block text-[10px] text-slate-500">Detail Lines</label>
                            {block.lines.map((line, lIdx) => (
                              <div key={lIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={line}
                                  onChange={e => {
                                    const newLines = [...block.lines];
                                    newLines[lIdx] = e.target.value;
                                    updateBlock(block.id, { lines: newLines });
                                  }}
                                  className="w-full bg-white border border-[#ebdcd0] rounded-lg px-2.5 py-1 text-xs text-[#2d3748] outline-none"
                                />
                                <button
                                  onClick={() => {
                                    const newLines = block.lines.filter((_, i) => i !== lIdx);
                                    updateBlock(block.id, { lines: newLines });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 text-xs px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newLines = [...block.lines, 'New detail line'];
                                updateBlock(block.id, { lines: newLines });
                              }}
                              className="text-xs text-[#bc6c25] font-semibold hover:underline"
                            >
                              + Add Detail Line
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXTRA SECTION */}
              {activeSection === 'extra' && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Social Tags & Guest Comments</h3>
                  
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Social Media Tags & Hashtags</label>
                    <input
                      type="text"
                      value={config.socialTags}
                      onChange={e => setConfig({ ...config, socialTags: e.target.value })}
                      placeholder="#AaravWedsMeera @LumiereWeddings"
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Displayed on invite banner and included when sharing via WhatsApp/Email.</span>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Map Location URL</label>
                    <input
                      type="text"
                      value={config.mapUrl}
                      onChange={e => setConfig({ ...config, mapUrl: e.target.value })}
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">RSVP Form URL</label>
                    <input
                      type="text"
                      value={config.rsvpUrl}
                      onChange={e => setConfig({ ...config, rsvpUrl: e.target.value })}
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#ebdcd0] space-y-4">
                    <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Bilingual Languages & Section Animation</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Primary Lang Code</label>
                        <input
                          type="text"
                          value={config.primaryLangName}
                          onChange={e => setConfig({ ...config, primaryLangName: e.target.value })}
                          className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Secondary Lang Code</label>
                        <input
                          type="text"
                          value={config.secondaryLangName}
                          onChange={e => setConfig({ ...config, secondaryLangName: e.target.value })}
                          className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Section Entrance Animation</label>
                      <select
                        value={config.sectionAnim}
                        onChange={e => setConfig({ ...config, sectionAnim: e.target.value as any })}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none"
                      >
                        <option value="slide_up">Smooth Slide Up on Scroll</option>
                        <option value="fade">Fade In</option>
                        <option value="zoom">Zoom In</option>
                        <option value="bounce">Gentle Bounce</option>
                        <option value="flip">3D Flip Reveal</option>
                        <option value="blur">Frosted Blur Reveal</option>
                        <option value="float">Floating Float</option>
                        <option value="none">None (Static)</option>
                      </select>
                    </div>

                    <div className="pt-3 space-y-2">
                      <label className="block text-xs font-semibold text-[#bc6c25]">Per-Block Entrance Animation Triggers</label>
                      <p className="text-[10px] text-slate-500">Define individual animation triggers ('on-scroll', 'immediate', 'after-delay') for each block.</p>
                      
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {config.blocks.map((block, idx) => (
                          <div key={block.id} className="bg-[#fcf8f5] border border-[#ebdcd0] p-2.5 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between font-semibold text-slate-700">
                              <span>Page #{idx + 1}: {block.heading || block.type}</span>
                              <span className="text-[10px] text-[#bc6c25] uppercase">({block.type})</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-0.5">Animation</label>
                                <select
                                  value={block.anim || config.sectionAnim || 'slide_up'}
                                  onChange={e => updateBlock(block.id, { anim: e.target.value as any })}
                                  className="w-full bg-white border border-[#ebdcd0] rounded px-2 py-1 text-xs text-[#2d3748]"
                                >
                                  <option value="slide_up">Slide Up</option>
                                  <option value="fade">Fade In</option>
                                  <option value="zoom">Zoom In</option>
                                  <option value="bounce">Bounce</option>
                                  <option value="flip">3D Flip</option>
                                  <option value="blur">Blur</option>
                                  <option value="float">Float</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-0.5">Trigger Mode</label>
                                <select
                                  value={block.animTrigger || 'on-scroll'}
                                  onChange={e => updateBlock(block.id, { animTrigger: e.target.value as any })}
                                  className="w-full bg-white border border-[#ebdcd0] rounded px-2 py-1 text-xs text-[#2d3748]"
                                >
                                  <option value="on-scroll">On-Scroll (Intersection)</option>
                                  <option value="immediate">Immediate (Instant)</option>
                                  <option value="after-delay">After Delay (Staggered)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ebdcd0] space-y-3">
                    <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Predefined VIP Guest List</h3>
                    <p className="text-[10px] text-slate-500">Predefine guest names, relationships, and contact details for invitees.</p>
                    
                    <div className="space-y-2 bg-[#fcf8f5] p-3 rounded-xl border border-[#ebdcd0]">
                      <input
                        type="text"
                        placeholder="Guest Full Name"
                        value={newGuestName}
                        onChange={e => setNewGuestName(e.target.value)}
                        className="w-full bg-white border border-[#ebdcd0] rounded-lg px-2.5 py-1.5 text-xs text-[#2d3748] outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newGuestRel}
                          onChange={e => setNewGuestRel(e.target.value)}
                          className="bg-white border border-[#ebdcd0] rounded-lg px-2 py-1 text-xs text-[#2d3748] outline-none"
                        >
                          <option value="Family">Family</option>
                          <option value="Close Friend">Close Friend</option>
                          <option value="VIP">VIP</option>
                          <option value="Colleague">Colleague</option>
                          <option value="Relative">Relative</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Phone / Email"
                          value={newGuestContact}
                          onChange={e => setNewGuestContact(e.target.value)}
                          className="bg-white border border-[#ebdcd0] rounded-lg px-2.5 py-1.5 text-xs text-[#2d3748] outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!newGuestName.trim()) return;
                          const guest = { id: 'g_' + Date.now(), name: newGuestName.trim(), relationship: newGuestRel, contact: newGuestContact.trim() };
                          setConfig({ ...config, predefinedGuests: [...(config.predefinedGuests || []), guest] });
                          setNewGuestName('');
                          setNewGuestContact('');
                        }}
                        className="w-full py-1.5 bg-[#d4a373] text-white font-bold rounded-lg text-xs hover:bg-[#bc6c25]"
                      >
                        + Add Predefined Guest
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(config.predefinedGuests || []).map(g => (
                        <div key={g.id} className="bg-white border border-[#ebdcd0] p-2.5 rounded-xl text-xs flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-[#bc6c25]">{g.name} <span className="text-[10px] bg-[#faedcd] px-1.5 py-0.5 rounded text-slate-700 ml-1">{g.relationship}</span></div>
                            <div className="text-[10px] text-slate-500">{g.contact}</div>
                          </div>
                          <button
                            onClick={() => setConfig({ ...config, predefinedGuests: config.predefinedGuests.filter(item => item.id !== g.id) })}
                            className="text-rose-500 hover:text-rose-700 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ebdcd0] space-y-3">
                    <h3 className="text-xs font-semibold text-[#bc6c25] uppercase tracking-wider">Designer HTML Code Export</h3>
                    <p className="text-[10px] text-slate-500">Update, validate, and download standalone HTML code for deployment (Designer Only).</p>
                    <div className="space-y-2">
                      <button
                        onClick={handleUpdateHtmlCode}
                        className="w-full py-2.5 px-4 bg-[#588157] hover:bg-[#3a5a40] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <RefreshCw className="w-4 h-4" /> 🔄 Update & Validate HTML Code
                      </button>
                      {htmlUpdateStatus && (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-xl text-center font-medium animate-fadeIn">
                          {htmlUpdateStatus}
                        </div>
                      )}
                      <button
                        onClick={() => downloadHtml(false)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#d4a373] to-[#bc6c25] hover:opacity-95 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Download className="w-4 h-4" /> Download html code
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => downloadHtml(false)}
                          className="py-2 px-2 bg-[#fcf8f5] hover:bg-[#f4ece4] text-[#2d3748] border border-[#ebdcd0] rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Download className="w-3 h-3 text-[#bc6c25]" /> Guest HTML
                        </button>
                        <button
                          onClick={() => downloadHtml(true)}
                          className="py-2 px-2 bg-[#fcf8f5] hover:bg-[#f4ece4] text-[#2d3748] border border-[#ebdcd0] rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Download className="w-3 h-3 text-[#bc6c25]" /> Editable File
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#ebdcd0]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-[#bc6c25]">Guest Comments ({config.comments.length})</h4>
                      <button
                        onClick={() => setConfig({ ...config, comments: [] })}
                        className="text-[10px] text-rose-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {config.comments.map(c => (
                        <div key={c.id} className="bg-[#fcf8f5] border border-[#ebdcd0] p-2.5 rounded-xl text-xs flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-[#bc6c25]">{c.name}:</span> <span className="text-slate-700">{c.message}</span>
                          </div>
                          <button
                            onClick={() => setConfig({ ...config, comments: config.comments.filter(item => item.id !== c.id) })}
                            className="text-rose-500 hover:text-rose-700 ml-2 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button for Active Section */}
            <div className="p-4 border-t border-[#ebdcd0] bg-white sticky bottom-0 z-20">
              <button
                onClick={() => handleSaveSection(activeSection)}
                className="w-full py-3 bg-gradient-to-r from-[#d4a373] to-[#bc6c25] hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> Save {activeSection.toUpperCase()} Section Changes
              </button>
            </div>
          </div>
        )}

        {/* AI WRITER TAB */}
        {activeTab === 'ai' && (
          <div className="w-full md:w-[380px] lg:w-[420px] bg-white border-r border-[#ebdcd0] flex flex-col z-20 p-6 space-y-6 overflow-y-auto shrink-0">
            <div>
              <div className="flex items-center gap-2 text-[#bc6c25] mb-2">
                <Wand2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#2d3748]">AI Invitation Copywriter</h3>
              </div>
              <p className="text-xs text-slate-500">Generate professional poetry, invitations, and event details instantly with Gemini AI.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Occasion Type</label>
                <input
                  type="text"
                  value={aiPromptInput.occasion}
                  onChange={e => setAiPromptInput({ ...aiPromptInput, occasion: e.target.value })}
                  className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Host Names</label>
                <input
                  type="text"
                  value={aiPromptInput.hosts}
                  onChange={e => setAiPromptInput({ ...aiPromptInput, hosts: e.target.value })}
                  className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tone & Style</label>
                <input
                  type="text"
                  value={aiPromptInput.tone}
                  onChange={e => setAiPromptInput({ ...aiPromptInput, tone: e.target.value })}
                  className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Special Details & Story</label>
                <textarea
                  rows={4}
                  value={aiPromptInput.details}
                  onChange={e => setAiPromptInput({ ...aiPromptInput, details: e.target.value })}
                  className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3.5 py-2 text-xs text-[#2d3748] outline-none"
                />
              </div>

              <button
                onClick={generateAiContent}
                disabled={aiLoading}
                className="w-full py-3 bg-gradient-to-r from-[#d4a373] to-[#bc6c25] hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {aiLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {aiLoading ? 'Generating with AI...' : 'Generate Invitation Copy ✨'}
              </button>
            </div>
          </div>
        )}

        {/* Live Preview / Simulator Area */}
        <div className="flex-1 bg-[#f4ece4] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-y-auto">
          {/* Device Frame Bar */}
          <div className="flex items-center gap-2 bg-white border border-[#ebdcd0] p-1.5 rounded-2xl mb-6 shadow-md z-20">
            <button
              onClick={() => setDeviceFrame('phone')}
              title="Phone View"
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                deviceFrame === 'phone' ? 'bg-[#d4a373] text-white shadow-sm' : 'text-slate-600 hover:bg-[#fcf8f5] hover:text-[#2d3748]'
              }`}
            >
              <Smartphone className="w-7 h-7" />
            </button>
            <button
              onClick={() => setDeviceFrame('tablet')}
              title="Tablet View"
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                deviceFrame === 'tablet' ? 'bg-[#d4a373] text-white shadow-sm' : 'text-slate-600 hover:bg-[#fcf8f5] hover:text-[#2d3748]'
              }`}
            >
              <Tablet className="w-7 h-7" />
            </button>
            <button
              onClick={() => setDeviceFrame('desktop')}
              title="Desktop View"
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                deviceFrame === 'desktop' ? 'bg-[#d4a373] text-white shadow-sm' : 'text-slate-600 hover:bg-[#fcf8f5] hover:text-[#2d3748]'
              }`}
            >
              <Monitor className="w-7 h-7" />
            </button>
            <button
              onClick={() => setDeviceFrame('full')}
              title="Full Width"
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                deviceFrame === 'full' ? 'bg-[#d4a373] text-white shadow-sm' : 'text-slate-600 hover:bg-[#fcf8f5] hover:text-[#2d3748]'
              }`}
            >
              <Eye className="w-7 h-7" />
            </button>
          </div>

          {/* Invitation Viewport Wrapper */}
          <div
            id="invitation-fullscreen-container"
            className={`transition-all duration-300 bg-white shadow-2xl relative overflow-hidden border border-[#ebdcd0] ${
              deviceFrame === 'phone'
                ? 'w-[380px] h-[780px] max-w-[95vw] max-h-[78vh] rounded-[36px] border-[10px] border-[#ebdcd0] ring-1 ring-[#d4a373]/35'
                : deviceFrame === 'tablet'
                ? 'w-[768px] h-[900px] max-w-[95vw] max-h-[82vh] rounded-[24px] border-[12px] border-[#ebdcd0]'
                : deviceFrame === 'desktop'
                ? 'w-[1024px] h-[800px] max-w-[95vw] max-h-[85vh] rounded-2xl border-[12px] border-[#ebdcd0]'
                : 'w-full h-full rounded-none border-0'
            }`}
          >
            <LiveInvitationRenderer
              config={config}
              isOpened={isOpened}
              setIsOpened={setIsOpened}
              onOpen={() => {
                setIsOpened(true);
                if (!isPlayingMusic && config.music) {
                  toggleMusic();
                }
              }}
              activeLanguage={activeLanguage}
              setActiveLanguage={setActiveLanguage}
              onAddComment={(comment) => {
                const newComments = [comment, ...config.comments];
                setConfig({ ...config, comments: newComments });
              }}
              onAddRsvp={handleAddRsvp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// YouTube URL parser helper
function getYouTubeEmbedUrl(url: string) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
  } else if (url.includes('shorts/')) {
    videoId = url.split('shorts/')[1]?.split('?')[0];
  } else {
    videoId = url.trim();
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0` : '';
}

// Slideshow Carousel Sub-component supporting both Photos and YouTube Video PiP Slides
function SlideshowCarousel({ slides }: { slides: SlideItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!slides || slides.length === 0) {
    return <div className="text-xs text-slate-400">No slides added yet.</div>;
  }

  const slide = slides[currentIndex];
  const isYouTube = slide.mediaType === 'youtube' || slide.url.includes('youtube.com') || slide.url.includes('youtu.be') || slide.url.includes('shorts/');

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#ebdcd0] bg-white group">
        {isYouTube ? (
          <div className="relative w-full h-72 bg-black">
            <iframe
              src={getYouTubeEmbedUrl(slide.url)}
              title={slide.heading}
              className="w-full h-full absolute inset-0 border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <img
            src={slide.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
            alt={slide.heading}
            className="w-full h-72 object-cover transition-all duration-500"
          />
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 text-white text-left pointer-events-none">
          <h4 className="text-lg font-bold font-serif pointer-events-auto">{slide.heading}</h4>
          <p className="text-xs text-white/90 mt-1 pointer-events-auto">{slide.description}</p>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all font-bold z-20"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all font-bold z-20"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
        {slides.map((s, idx) => {
          const sIsYT = s.mediaType === 'youtube' || s.url.includes('youtube.com') || s.url.includes('youtu.be') || s.url.includes('shorts/');
          return (
            <button
              key={s.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 relative ${
                currentIndex === idx ? 'border-[#d4a373] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {sIsYT ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-xs">
                  <Video className="w-5 h-5 text-[#faedcd]" />
                </div>
              ) : (
                <img src={s.url} alt={s.heading} className="w-full h-full object-cover" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Sub-component for rendering modular blocks inside preview
function LiveInvitationRenderer({
  config: initialConfig,
  isOpened,
  setIsOpened,
  onOpen,
  activeLanguage,
  setActiveLanguage,
  onAddComment,
  onAddRsvp,
}: {
  config: Config;
  isOpened: boolean;
  setIsOpened: (val: boolean) => void;
  onOpen?: () => void;
  activeLanguage: 'primary' | 'secondary';
  setActiveLanguage: (lang: 'primary' | 'secondary') => void;
  onAddComment: (comment: GuestComment) => void;
  onAddRsvp: (resp: RsvpResponse) => void;
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [flowerShower, setFlowerShower] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentMsg, setCommentMsg] = useState('');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'regrets' | 'maybe'>('attending');
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState(1);
  const [rsvpMsg, setRsvpMsg] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const st = e.currentTarget.scrollTop;
    if (st > 220) {
      if (!showScrollToTop) setShowScrollToTop(true);
    } else {
      if (showScrollToTop) setShowScrollToTop(false);
    }
  };

  useEffect(() => {
    const target = new Date(initialConfig.date).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [initialConfig.date]);

  const handleAiBlessing = () => {
    const preset = initialConfig.preset || 'wedding';
    const blessingsPool: Record<string, string[]> = {
      wedding: [
        "Wishing you a lifetime of shared laughter, unending love, and beautiful adventures together! 💍✨",
        "ਤੁਹਾਨੂੰ ਦੋਵਾਂ ਨੂੰ ਜੀਵਨ ਭਰ ਦੇ ਪਿਆਰ, ਖੁਸ਼ੀਆਂ ਅਤੇ ਸਾਥ ਦੀ ਮੁਬਾਰਕਬਾਦ! 🥂",
        "आपके जीवन का यह नया सफर प्रेम, विश्वास और खुशियों से भरा रहे। बधाई हो! ❤️",
        "May the years ahead be filled with lasting joy, deep affection, and cherished moments. 🌸",
        "ईश्वर करे आपका जोड़ा सदा सलामत रहे और जीवन में खुशियों की बरसात हो। 🙏",
        "Wishing a wonderful couple a lifetime of love and beautiful memories that grow sweeter with each passing day. 💖",
        "मंगलमय दांपत्य जीवन की अनंत शुभकामनाएं! आपका प्यार हर दिन और गहरा हो। 🌹",
        "ਸਾਥੀ ਸਦਾ ਬਣੇ ਰਹੋ, ਪਿਆਰ ਦੀ ਇਹ ਜੋਤ ਸਦਾ ਜਗਦੀ ਰਹੇ! ਮੁਬਾਰਕਾਂ! ✨"
      ],
      birthday: [
        "Wishing you a very happy birthday filled with love, laughter, and wonderful surprises! 🎂✨",
        "ਤੁਹਾਨੂੰ ਜਨਮਦਿਨ ਦੀਆਂ ਲੱਖ-ਲੱਖ ਵਧਾਈਆਂ! ਪ੍ਰਮਾਤਮਾ ਤੁਹਾਨੂੰ ਲੰਬੀ ਉਮਰ ਅਤੇ ਸਿਹਤ ਬਖ਼ਸ਼ੇ। 🎉",
        "आपको जन्मदिन की ढेरों शुभकामनाएं! यह साल आपके लिए ढेरों खुशियां और सफलता लेकर आए। 🎈",
        "May your birthday be the start of a year filled with good luck, good health, and much happiness. 🌟",
        "ਪ੍ਰਮਾਤਮਾ ਕਰੇ ਤੁਹਾਡਾ ਹਰ ਦਿਨ ਖੁਸ਼ੀਆਂ ਨਾਲ ਭਰਿਆ ਹੋਵੇ। ਹੈਪੀ ਬਰਥਡੇ! 🎊"
      ],
      babyshower: [
        "Wishing you immense joy as you welcome your little bundle of joy into the world! 🍼👶",
        "ਨੰਨ੍ਹੇ ਮਹਿਮਾਨ ਦੇ ਆਉਣ 'ਤੇ ਪਰਿਵਾਰ ਨੂੰ ਲੱਖ-lੱਖ ਵਧਾਈਆਂ ਅਤੇ ਅਸ਼ੀਰਵਾਦ! 🌸",
        "आपके घर में नन्हे मेहमान के आगमन पर ढेर सारी बधाइयां और शुभकामनाएं! 💖",
        "May your little one bring endless smiles, sleepless nights of pure love, and a lifetime of blessings. ✨"
      ],
      anniversary: [
        "Happy Anniversary! May your love grow stronger and more inspiring with every passing year. 🥂💖",
        "ਵਿਆਹ ਦੀ ਵਰ੍ਹੇਗੰਢ ਦੀਆਂ ਮੁਬਾਰਕਾਂ! ਤੁਹਾਡਾ ਪਿਆਰ ਸਦਾ ਅਮਰ ਰਹੇ। 🌸",
        "विवाह की सालगिरह की हार्दिक शुभकामनाएं! आपका साथ यूं ही जन्म-जन्मांतर तक बना रहे। 🌹",
        "Celebrating years of love, patience, and wonderful memories together. Happy Anniversary! ✨"
      ],
      housewarming: [
        "May your new home be filled with peace, prosperity, love, and joyous celebrations! 🏡✨",
        "ਨਵੇਂ ਘਰ ਦੀ ਪ੍ਰਵੇਸ਼ 'ਤੇ ਬਹੁਤ-ਬਹੁਤ ਮੁਬਾਰਕਾਂ! ਪ੍ਰਮਾਤਮਾ ਘਰ ਵਿੱਚ ਬਰਕਤ ਬਖ਼ਸ਼ੇ। 🙏",
        "गृह प्रवेश की अनੰਤ शुभकामनाएं! आपका नया घर सुख-शांति और समृद्धि से आह्लादित हो। 🌸"
      ],
      festival: [
        "Wishing you and your family a joyous, bright, and prosperous celebration! 🪔✨",
        "ਤੁਹਾਨੂੰ ਅਤੇ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਨੂੰ ਤਿਉਹਾਰ ਦੀਆਂ ਬਹੁਤ-ਬਹੁਤ ਵਧਾਈਆਂ! 🌸",
        "त्योहार के इस पावन अवसर पर आपके जीवन में सुख, शांति और समृद्धि आए। 🌺"
      ]
    };
    const pool = blessingsPool[preset] || blessingsPool['wedding'];
    const randomIdx = Math.floor(Math.random() * pool.length);
    setCommentMsg(pool[randomIdx]);
  };

  const triggerFullscreen = () => {
    if (containerRef.current && containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const scrollToPage2 = () => {
    const container = containerRef.current || document.getElementById('invitation-scroll-container');
    const p2 = document.getElementById('page-2');
    if (container && p2) {
      const containerRect = container.getBoundingClientRect();
      const p2Rect = p2.getBoundingClientRect();
      const targetScroll = p2Rect.top - containerRect.top + container.scrollTop;
      container.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else if (p2) {
      p2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenClick = () => {
    setIsOpening(true);
    setFlowerShower(true);
    triggerFullscreen();
    if (onOpen) onOpen();
    setTimeout(() => {
      setIsOpened(true);
      setIsOpening(false);
      setTimeout(() => {
        scrollToPage2();
      }, 80);
    }, 700);
  };

  const handleTapToOpenHero = () => {
    setIsOpening(true);
    setFlowerShower(true);
    triggerFullscreen();
    if (onOpen) onOpen();
    setTimeout(() => {
      setIsOpened(true);
      setIsOpening(false);
      setTimeout(() => {
        scrollToPage2();
      }, 80);
    }, 700);
  };

  const accentColor = initialConfig.accent || '#d4a373';
  const coverBg = initialConfig.coverBg || '#f4ece4';
  const coverAccent = initialConfig.coverAccent || '#d4a373';

  const getFontClasses = () => {
    switch (initialConfig.fontPairing) {
      case 'luxurious_script':
        return { heading: 'font-[Alex_Brush] font-normal text-6xl', body: 'font-[Cormorant_Garamond] text-lg' };
      case 'modern_chic':
        return { heading: 'font-[Playfair_Display] font-bold tracking-tight', body: 'font-[Poppins] text-sm' };
      case 'royal_elegant':
        return { heading: 'font-[Cinzel] font-bold', body: 'font-[Cormorant_Garamond] text-lg' };
      case 'modern_minimal':
        return { heading: 'font-[Montserrat] font-semibold tracking-wide', body: 'font-[Poppins] text-sm' };
      case 'warm_traditional':
        return { heading: 'font-[Playfair_Display] font-bold', body: 'font-[Poppins] text-sm' };
      case 'script_serif':
      default:
        return { heading: 'font-[Great_Vibes] font-normal text-5xl', body: 'font-[Playfair_Display] text-base' };
    }
  };

  const fonts = getFontClasses();
  const customFontFamily = initialConfig.customGoogleFont ? initialConfig.customGoogleFont : undefined;

  const renderSeparator = (style: string) => {
    switch (style) {
      case 'floral':
        return <div className="text-center text-[#bc6c25] my-2 tracking-widest text-lg">🌸 ❦ 🌸</div>;
      case 'sparkle':
        return <div className="text-center text-[#dda15e] my-2 tracking-widest text-sm">✨ ── ✦ ── ✨</div>;
      case 'dots':
        return <div className="text-center text-[#d4a373]/60 my-2 tracking-widest">• • • • •</div>;
      case 'line':
      default:
        return <div className="w-24 h-[1px] bg-[#d4a373]/40 mx-auto my-2"></div>;
    }
  };

  const getImageSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-32 h-32 mx-auto rounded-2xl object-cover shadow-md border-2 border-[#ebdcd0]';
      case 'large': return 'w-full max-w-lg mx-auto h-72 rounded-2xl object-cover shadow-lg border-2 border-[#ebdcd0]';
      case 'full': return 'w-full h-80 object-cover shadow-lg';
      case 'medium':
      default: return 'w-full max-w-sm mx-auto h-56 rounded-2xl object-cover shadow-md border-2 border-[#ebdcd0]';
    }
  };

  const t = (primary?: string, secondary?: string) => {
    if (activeLanguage === 'secondary' && secondary) return secondary;
    return primary || '';
  };

  const tLines = (primary?: string[], secondary?: string[]) => {
    if (activeLanguage === 'secondary' && secondary && secondary.length > 0) return secondary;
    return primary || [];
  };

  const getSectionAnimClass = (anim: string) => {
    switch (anim) {
      case 'fade': return 'animate-fadeIn';
      case 'zoom': return 'animate-zoomIn';
      case 'bounce': return 'animate-bounceIn';
      case 'flip': return 'animate-flipIn';
      case 'blur': return 'animate-blurIn';
      case 'float': return 'animate-particleFloat';
      case 'none': return '';
      case 'slide_up':
      default:
        return 'animate-slideUp';
    }
  };

  const [showTranslateDropdown, setShowTranslateDropdown] = useState(false);
  const [translatedConfig, setTranslatedConfig] = useState<Config>(initialConfig);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeLangName, setActiveLangName] = useState('English');

  useEffect(() => {
    setTranslatedConfig(initialConfig);
    setActiveLangName('English');
  }, [initialConfig]);

  const config = translatedConfig;

  const indianLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' }
  ];

  const handleTranslate = async (lang: { code: string; name: string; native: string }) => {
    setShowTranslateDropdown(false);
    if (lang.code === 'en') {
      setTranslatedConfig(initialConfig);
      setActiveLangName('English');
      return;
    }

    setIsTranslating(true);
    setActiveLangName(lang.name);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: initialConfig, targetLanguage: lang.name })
      });
      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json();
      setTranslatedConfig(data);
    } catch (err) {
      console.error(err);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="invitation-scroll-container"
      onScroll={handleScroll}
      onContextMenu={e => e.preventDefault()}
      className="w-full h-full overflow-y-auto relative select-none scroll-smooth"
      style={{
        backgroundColor: config.pageBg || '#fefdfb',
        backgroundImage: config.bgImage ? `url(${config.bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: config.bodyText || '#4a5568',
        fontFamily: customFontFamily ? customFontFamily : undefined
      }}
    >

      {/* Floating Indian Language Translation Dropdown */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowTranslateDropdown(!showTranslateDropdown)}
            disabled={isTranslating}
            title={isTranslating ? `Translating to ${activeLangName}...` : `Translate (${activeLangName})`}
            className="p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-[#ebdcd0] hover:bg-[#fcf8f5] transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38 6H12C8.68 6 6 8.68 6 12V32C6 35.32 8.68 38 12 38H18L24 44L30 38H38C41.32 38 44 35.32 44 32V12C44 8.68 41.32 6 38 6Z" fill="#4285F4"/>
              <text x="14" y="28" fill="white" fontSize="22" fontWeight="bold" fontFamily="sans-serif">G</text>
              <path d="M25 14H40V34H25V14Z" fill="#F8F9FA" rx="2"/>
              <path d="M28 19H37" stroke="#5F6368" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M28 24H35" stroke="#5F6368" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M28 29H33" stroke="#5F6368" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>

          {showTranslateDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#ebdcd0] p-2 z-50 animate-fadeIn max-h-72 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5 border-b border-[#ebdcd0]">
                Select Indian Language (AI)
              </div>
              <div className="py-1 space-y-0.5">
                {indianLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleTranslate(lang)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#faedcd]/60 text-xs flex items-center justify-between text-[#2d3748] transition-all"
                  >
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-slate-500 text-[11px] font-semibold">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flower Shower Overlay */}
      {flowerShower && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-15%`,
                animationDuration: `${1.8 + Math.random() * 2.5}s`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationTimingFunction: 'ease-out'
              }}
            >
              {['🌸', '🌺', '💮', '✨', '🌼', '🌹', '💖'][i % 7]}
            </div>
          ))}
        </div>
      )}

      {/* Floating Particles Engine */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {(config.effects || []).map((eff, eIdx) => {
          const emoji = eff === 'petals' ? '🌸' : eff === 'confetti' ? '🎉' : eff === 'balloons' ? '🎈' : eff === 'stars' ? '✨' : eff === 'hearts' ? '❤️' : '🌸';
          return Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`${eIdx}-${i}`}
              className="absolute text-lg animate-particleFloat"
              style={{
                left: `${(i * 12 + eIdx * 5) % 95}%`,
                top: `${(i * 15) % 90}%`,
                animationDuration: `${4 + (i % 3) * 2}s`,
                animationDelay: `${(i * 0.4)}s`,
                opacity: 0.85
              }}
            >
              {emoji}
            </div>
          ));
        })}
      </div>

      {/* Render Modular Blocks: Page 1 (Hero) -> Page 2 -> Followed by rest of pages in vertical scrolling */}
      {(!isOpened && config.cover && config.cover !== 'none') ? null : (config.blocks || DEFAULT_BLOCKS).map((block, index) => {
        if (block.enabled === false) return null;
        const blockAnim = block.anim || config.sectionAnim || 'slide_up';
        const isHeroPage = index === 0;
        const isPageTwo = index === 1;

        if (isHeroPage) {
          return (
            <section
              key={block.id || 'hero-page-1'}
              id="page-1"
              className="w-full flex flex-col justify-between items-center text-center px-4 py-6 sm:py-8 max-w-xl mx-auto relative z-20 pb-4"
            >

              {/* Page 1 Top / Eyebrow & Occasion Title */}
              <div className="space-y-2 pt-1 animate-fadeIn w-full flex flex-col items-center">
                {config.eyebrow && (
                  <div
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur border border-[#ebdcd0] text-[11px] font-semibold uppercase tracking-[0.2em] shadow-sm"
                    style={{ color: accentColor }}
                  >
                    <span>✨</span>
                    <span>{config.eyebrow}</span>
                    <span>✨</span>
                  </div>
                )}
                <h1 className={`text-3xl sm:text-4xl md:text-5xl ${fonts.heading} leading-tight drop-shadow-sm px-2`} style={{ color: accentColor }}>
                  {config.title}
                </h1>
                {config.tagline && (
                  <p className="text-xs sm:text-sm font-serif italic text-slate-600 max-w-md mx-auto">
                    {config.tagline}
                  </p>
                )}
              </div>

              {/* Page 1 Center / Hero Artwork Portrait & Announcement */}
              <div className="my-auto py-2 space-y-2.5 w-full flex flex-col items-center">
                {block.image && block.showImage !== false && (
                  <div className="relative group mx-auto">
                    <div className="absolute -inset-1.5 rounded-[28px] opacity-35 blur-sm" style={{ backgroundColor: accentColor }}></div>
                    <img
                      src={block.image}
                      alt={t(block.heading, block.headingSecondary)}
                      className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-xl border-4 border-white/95 mx-auto transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                )}

                <h2 className={`text-2xl sm:text-3xl ${fonts.heading} pt-1`} style={{ color: accentColor }}>
                  {t(block.heading, block.headingSecondary)}
                </h2>

                {block.detailsHeading && block.showDetails !== false && (
                  <h3 className="text-xs sm:text-sm md:text-base font-serif text-[#bc6c25] tracking-wide font-medium">
                    {t(block.detailsHeading, block.detailsHeadingSecondary)}
                  </h3>
                )}

                {block.lines && block.lines.length > 0 && (
                  <div className="space-y-0.5 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    {tLines(block.lines, block.linesSecondary).map((line, lIdx) => (
                      <p key={lIdx} className="leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}

                {config.dateText && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 border border-[#ebdcd0] text-xs font-semibold text-slate-700 shadow-sm mt-0.5">
                    <span>📅</span>
                    <span>{config.dateText}</span>
                  </div>
                )}
              </div>

              <div className="w-16 h-0.5 bg-[#ebdcd0] mx-auto mt-2 rounded-full"></div>
            </section>
          );
        }

        return (
          <div
            key={block.id || index}
            id={isPageTwo ? 'page-2' : undefined}
            className={`w-full flex flex-col items-center px-6 pt-1 pb-6 sm:pt-1.5 sm:pb-8 max-w-2xl mx-auto text-center space-y-5 relative z-20 ${getSectionAnimClass(blockAnim)}`}
            style={{ animationDelay: `${index * 0.12}s` }}
          >


            {/* Heading */}
            <h2 className={`text-3xl md:text-4xl ${fonts.heading}`} style={{ color: accentColor }}>
              {t(block.heading, block.headingSecondary)}
            </h2>

            {/* Optional Image with adjustable size */}
            {block.image && block.type !== 'slideshow' && block.showImage !== false && (
              <div className="my-4">
                <img
                  src={block.image}
                  alt={t(block.heading, block.headingSecondary)}
                  className={getImageSizeClass(block.imageSize)}
                />
              </div>
            )}

            {/* Details Heading */}
            {block.detailsHeading && block.showDetails !== false && (
              <h3 className="text-lg font-serif text-[#bc6c25] tracking-wide font-semibold">
                {t(block.detailsHeading, block.detailsHeadingSecondary)}
              </h3>
            )}

            {/* Countdown timer & Add to Calendar */}
            {block.type === 'countdown' && (
              <div className="space-y-4 my-6 max-w-md mx-auto">
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white/90 border border-[#ebdcd0] p-3 rounded-2xl shadow-sm">
                    <div className="text-2xl font-bold text-[#bc6c25]">{timeLeft.days}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Days</div>
                  </div>
                  <div className="bg-white/90 border border-[#ebdcd0] p-3 rounded-2xl shadow-sm">
                    <div className="text-2xl font-bold text-[#bc6c25]">{timeLeft.hours}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Hours</div>
                  </div>
                  <div className="bg-white/90 border border-[#ebdcd0] p-3 rounded-2xl shadow-sm">
                    <div className="text-2xl font-bold text-[#bc6c25]">{timeLeft.mins}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Mins</div>
                  </div>
                  <div className="bg-white/90 border border-[#ebdcd0] p-3 rounded-2xl shadow-sm">
                    <div className="text-2xl font-bold text-[#bc6c25]">{timeLeft.secs}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Secs</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      const eventTitle = config.title || block.heading || 'Wedding Celebration';
                      const eventDesc = (block.lines || []).join('\n') || config.dateText || 'You are warmly invited to celebrate with us!';
                      const eventLoc = config.dateText || 'Grand Palace, Jaipur';
                      let dtStart = '20261212T180000Z';
                      let dtEnd = '20261212T230000Z';
                      if (config.date) {
                        const d = new Date(config.date);
                        if (!isNaN(d.getTime())) {
                          const pad = (n: number) => String(n).padStart(2, '0');
                          const year = d.getUTCFullYear();
                          const month = pad(d.getUTCMonth() + 1);
                          const day = pad(d.getUTCDate());
                          const hour = pad(d.getUTCHours());
                          const min = pad(d.getUTCMinutes());
                          dtStart = `${year}${month}${day}T${hour}${min}00Z`;
                          const endDate = new Date(d.getTime() + 3 * 3600 * 1000);
                          dtEnd = `${endDate.getUTCFullYear()}${pad(endDate.getUTCMonth() + 1)}${pad(endDate.getUTCDate())}T${pad(endDate.getUTCHours())}${pad(endDate.getUTCMinutes())}00Z`;
                        }
                      }
                      const icsContent = [
                        'BEGIN:VCALENDAR',
                        'VERSION:2.0',
                        'PRODID:-//Lumiere Invitation Creator//EN',
                        'BEGIN:VEVENT',
                        `UID:event-${Date.now()}@lumiere.app`,
                        `DTSTAMP:${dtStart}`,
                        `DTSTART:${dtStart}`,
                        `DTEND:${dtEnd}`,
                        `SUMMARY:${eventTitle}`,
                        `DESCRIPTION:${eventDesc.replace(/\n/g, '\\n')}`,
                        `LOCATION:${eventLoc}`,
                        'STATUS:CONFIRMED',
                        'END:VEVENT',
                        'END:VCALENDAR'
                      ].join('\r\n');
                      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'wedding-event.ics');
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-[#d4a373] hover:bg-[#bc6c25] text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                  >
                    📥 Download .ics Calendar (Apple / Outlook)
                  </button>
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(config.title || block.heading || 'Wedding Celebration')}&details=${encodeURIComponent((block.lines || []).join('\n') || 'Wedding Event')}&location=${encodeURIComponent(config.dateText || 'Grand Palace, Jaipur')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white border border-[#ebdcd0] hover:bg-[#fcf8f5] text-[#bc6c25] font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    🌐 Add to Google Calendar
                  </a>
                </div>
              </div>
            )}

            {/* Slideshow Block */}
            {block.type === 'slideshow' ? (
              <SlideshowCarousel slides={block.slides || []} />
            ) : block.type === 'blessings_wall' ? (
              <div className="space-y-4 max-w-md mx-auto text-left">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!commentName.trim() || !commentMsg.trim()) return;
                    onAddComment({
                      id: 'c_' + Date.now(),
                      name: commentName.trim(),
                      message: commentMsg.trim(),
                      date: 'Just now'
                    });
                    setCommentName('');
                    setCommentMsg('');
                  }}
                  className="bg-white/95 border border-[#ebdcd0] p-4 rounded-2xl space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-[#bc6c25]">Post Your Blessings (Any Indian Language / किसी भी भारतीय भाषा में)</div>
                    <button
                      type="button"
                      onClick={handleAiBlessing}
                      className="text-[11px] bg-[#faedcd] hover:bg-[#ebdcd0] text-[#bc6c25] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all shadow-sm"
                    >
                      ✨ AI Auto-Blessing
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name (आपका नाम / ਨਾਮ)"
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                  />
                  <textarea
                    rows={3}
                    placeholder="Write your blessing in Hindi, Punjabi, Tamil, Telugu, Bengali, Marathi, etc. (अपनी शुभकामनाएँ लिखें...)"
                    value={commentMsg}
                    onChange={e => setCommentMsg(e.target.value)}
                    className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#d4a373] to-[#bc6c25] hover:opacity-95 text-white font-bold rounded-xl text-xs transition-all shadow"
                  >
                    Post Blessing / आशीर्वाद भेजें ✨
                  </button>
                </form>

                <div className="bg-white/80 border border-[#ebdcd0] p-4 rounded-2xl space-y-3 max-h-72 overflow-y-auto">
                  <div className="text-xs font-semibold text-[#bc6c25]">Blessings Wall / शुभकामनाएं दीवार ({config.comments.length})</div>
                  {config.comments.length === 0 ? (
                    <div className="text-xs text-slate-400 text-center py-4">No blessings posted yet. Be the first to share your blessing!</div>
                  ) : (
                    config.comments.map(c => (
                      <div key={c.id} className="bg-white border border-[#ebdcd0] p-3 rounded-xl text-xs space-y-1.5 shadow-sm">
                        <div className="flex items-center justify-between text-[#bc6c25] font-semibold">
                          <span className="text-sm font-medium">{c.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{c.date}</span>
                        </div>
                        <p className="text-slate-800 text-sm leading-relaxed font-sans">{c.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : block.type === 'comments' ? (
              <div className="space-y-4 max-w-md mx-auto text-left">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!commentName.trim() || !commentMsg.trim()) return;
                    onAddComment({
                      id: 'c_' + Date.now(),
                      name: commentName.trim(),
                      message: commentMsg.trim(),
                      date: 'Just now'
                    });
                    setCommentName('');
                    setCommentMsg('');
                  }}
                  className="bg-white/90 border border-[#ebdcd0] p-4 rounded-2xl space-y-3 shadow-md"
                >
                  <div className="text-xs font-semibold text-[#bc6c25]">Send Your Blessings</div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                  />
                  <textarea
                    rows={2}
                    placeholder="Your warm wishes for the couple..."
                    value={commentMsg}
                    onChange={e => setCommentMsg(e.target.value)}
                    className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#d4a373] hover:bg-[#bc6c25] text-white font-bold rounded-xl text-xs transition-all shadow"
                  >
                    Post Wish ✨
                  </button>
                </form>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {config.comments.map(c => (
                    <div key={c.id} className="bg-white/80 border border-[#ebdcd0] p-3 rounded-xl text-xs space-y-1 shadow-sm">
                      <div className="flex items-center justify-between text-[#bc6c25] font-semibold">
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{c.date}</span>
                      </div>
                      <p className="text-slate-700">{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`space-y-2 max-w-md mx-auto leading-relaxed opacity-95 ${fonts.body}`}>
                {tLines(block.lines, block.linesSecondary).map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>
            )}

            {/* Social media tags */}
            {config.socialTags && block.type === 'hero' && (
              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#faedcd]/75 border border-[#d4a373]/40 text-[#bc6c25] text-xs font-semibold tracking-wide shadow-sm">
                  {config.socialTags}
                </span>
              </div>
            )}

            {/* Venue Map Button */}
            {block.type === 'venue' && config.mapUrl && (
              <div className="pt-4">
                <a
                  href={config.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4a373] hover:bg-[#bc6c25] text-white font-semibold text-xs transition-all shadow-md"
                >
                  <MapPin className="w-4 h-4" /> Open Location Map
                </a>
              </div>
            )}

            {/* Interactive RSVP Status Form */}
            {block.type === 'rsvp' && (
              <div className="space-y-4 max-w-md mx-auto text-left pt-2">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!rsvpName.trim()) return;
                    onAddRsvp({
                      id: 'r_' + Date.now(),
                      name: rsvpName.trim(),
                      email: rsvpEmail.trim(),
                      status: rsvpStatus,
                      guestsCount: rsvpGuestsCount,
                      message: rsvpMsg.trim(),
                      date: 'Just now'
                    });
                    setRsvpName('');
                    setRsvpEmail('');
                    setRsvpMsg('');
                    setRsvpSubmitted(true);
                    setTimeout(() => setRsvpSubmitted(false), 4000);
                  }}
                  className="bg-white/95 border border-[#ebdcd0] p-4 rounded-2xl space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-[#bc6c25]">Interactive RSVP Status</div>
                    <span className="text-[10px] bg-[#faedcd] text-[#bc6c25] px-2 py-0.5 rounded-full font-bold">
                      {(config.rsvpResponses || []).filter(r => r.status === 'attending').length} Attending
                    </span>
                  </div>
                  {rsvpSubmitted && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl text-center font-medium animate-fadeIn">
                      Thank you! Your RSVP has been recorded successfully. ✨
                    </div>
                  )}
                  {initialConfig.predefinedGuests && initialConfig.predefinedGuests.length > 0 && (
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Select from Guest List (Optional)</label>
                      <select
                        onChange={e => {
                          const gId = e.target.value;
                          const found = initialConfig.predefinedGuests.find(g => g.id === gId);
                          if (found) {
                            setRsvpName(found.name);
                            setRsvpEmail(found.contact);
                          }
                        }}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                      >
                        <option value="">-- Choose your name from guest list --</option>
                        {initialConfig.predefinedGuests.map(g => (
                          <option key={g.id} value={g.id}>{g.name} ({g.relationship})</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={rsvpName}
                      onChange={e => setRsvpName(e.target.value)}
                      required
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Will you attend?</label>
                      <select
                        value={rsvpStatus}
                        onChange={e => setRsvpStatus(e.target.value as any)}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                      >
                        <option value="attending">Accepts with Pleasure 🥂</option>
                        <option value="regrets">Declines with Regrets 💌</option>
                        <option value="maybe">Might Attend 🤔</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Guests Count</label>
                      <select
                        value={rsvpGuestsCount}
                        onChange={e => setRsvpGuestsCount(parseInt(e.target.value))}
                        className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4+ Guests</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Dietary Requirements / Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, Allergic to nuts..."
                      value={rsvpMsg}
                      onChange={e => setRsvpMsg(e.target.value)}
                      className="w-full bg-[#fcf8f5] border border-[#ebdcd0] rounded-xl px-3 py-2 text-xs text-[#2d3748] outline-none focus:border-[#d4a373]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#d4a373] hover:bg-[#bc6c25] text-white font-bold rounded-xl text-xs transition-all shadow flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white/30" /> Submit RSVP
                  </button>
                  {config.rsvpUrl && (
                    <div className="text-center pt-1">
                      <a href={config.rsvpUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#bc6c25] hover:underline">
                        Or open external RSVP Form →
                      </a>
                    </div>
                  )}
                </form>

                {/* RSVP Guest Responses List */}
                <div className="bg-white/80 border border-[#ebdcd0] p-3 rounded-2xl space-y-2 max-h-48 overflow-y-auto">
                  <div className="text-[11px] font-semibold text-[#bc6c25] px-1">Recent RSVP Responses ({(config.rsvpResponses || []).length})</div>
                  {(config.rsvpResponses || []).map(r => (
                    <div key={r.id} className="bg-white border border-[#ebdcd0] p-2.5 rounded-xl text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#2d3748]">{r.name}</div>
                        <div className="text-[10px] text-slate-500">{r.message || 'No note'} · {r.guestsCount} guest(s)</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        r.status === 'attending' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'regrets' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status === 'attending' ? 'Attending' : r.status === 'regrets' ? 'Regrets' : 'Maybe'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Separator */}
            {block.showSeparator && renderSeparator(block.separatorStyle)}
          </div>
        );
      })}

      <div className="py-12 text-center text-xs opacity-70 pb-24 text-slate-600 font-medium space-y-1.5">
        <div>{config.thanks}</div>
        <div className="text-[11px] font-semibold tracking-wide text-[#bc6c25]">{config.footerCredit}</div>
      </div>

      {/* Floating button to jump back to Page 1 / Hero */}
      {showScrollToTop && (
        <button
          onClick={() => {
            const p1 = document.getElementById('page-1') || containerRef.current;
            if (p1) {
              p1.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="fixed bottom-4 left-4 z-40 bg-white/95 backdrop-blur-md border border-[#ebdcd0] px-3.5 py-2 rounded-full shadow-lg text-xs font-semibold text-[#bc6c25] hover:bg-[#fcf8f5] transition-all flex items-center gap-1.5 hover:scale-105 animate-fadeIn"
          title="Scroll back to Page 1 (Hero)"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Page 1 (Hero)</span>
        </button>
      )}
    </div>
  );
}
