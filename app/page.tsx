'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Menu, X, Heart, Trophy, Handshake, TrendingUp, Palette, Sparkles, Check, Plus, Phone, Instagram, MapPin, ChevronLeft, ChevronRight, ChevronDown, Languages } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons';
import { clubs, photos as originalPhotos, text, Lang, Words } from '@/lib/content';
import { Purpose, Benefits, Founder, Journey, Questions, Testimonials, WhoCanJoinSection } from '@/components/story-sections';
import { activityCatalogue } from '@/lib/activities';
import { membershipHighlights } from '@/lib/details';
import { trackEvent } from '@/lib/analytics';
import HeroCarousel from '@/components/hero-carousel';

import { useMedia } from '@/lib/use-media';
import { clubSlots, defaultClubsMedia } from '@/lib/media';
const photoUrl = (src: string) => src.startsWith('https://') ? src : `/images/${src}.webp`;
import { useMembershipFee } from '@/lib/use-membership';
import { useContact } from '@/lib/use-contact';
const icons = [Heart, Trophy, Handshake, TrendingUp, Palette, Sparkles];

const languages: { code: Lang; label: string }[] = [
  { code: 'mix', label: 'EN + ગુ' },
  { code: 'en', label: 'English' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'hi', label: 'हिन्दी' },
];

export default function Home() {
  const contact = useContact();
  const wa = `https://wa.me/${contact.whatsappNumber.replace(/\D/g, '') || '919712112110'}`;
  const feePaise = useMembershipFee();
  const feeRupees = feePaise / 100;
  const feeLabel = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(feeRupees);
  const media = useMedia();
  const allPhotos = media.gallery.length > 0
    ? media.gallery.map(p => ({
      id: p.id,
      src: p.url,
      category: p.category || 'Community',
      alt: p.alt || ''
    }))
    : originalPhotos.map((p, idx) => ({
      id: `orig-${idx}`,
      src: photoUrl(p.src),
      category: p.category,
      alt: ''
    }));

  const defaultSections = ['Donation', 'Volunteering', 'Music', 'Outdoors', 'Celebration', 'Community'];
  const activeSections = [
    'All',
    ...Array.from(
      new Set([
        ...(media.gallerySections && media.gallerySections.length > 0
          ? media.gallerySections
          : defaultSections),
        ...allPhotos.map(p => p.category)
      ])
    )
  ];

  const [lang, setLang] = useState<Lang>('mix');
  const [langOpen, setLangOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [club, setClub] = useState(0);
  const [openActivity, setOpenActivity] = useState<number>(0);
  const [filter, setFilter] = useState('All');
  const [photo, setPhoto] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const filteredPhotos = filter === 'All' ? allPhotos : allPhotos.filter(p => p.category === filter);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    if (deltaX > 45) {
      setPhoto(prev => (prev === null ? null : (prev + 1) % filteredPhotos.length));
    } else if (deltaX < -45) {
      setPhoto(prev => (prev === null ? null : (prev + filteredPhotos.length - 1) % filteredPhotos.length));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const t = (en: string, gu: string, hi: string) => text([en, gu, hi], lang);
  const heading = (en: string, gu: string, hi: string) => lang === 'mix' ? en : t(en, gu, hi);
  const c = clubs[club];
  const Icon = icons[club];

  useEffect(() => {
    if (photo === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setPhoto(prev => (prev === null ? null : (prev + 1) % filteredPhotos.length));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setPhoto(prev => (prev === null ? null : (prev + filteredPhotos.length - 1) % filteredPhotos.length));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setPhoto(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photo, filteredPhotos.length]);

  useEffect(() => {
    const saved = localStorage.getItem('zunoon-language');
    if (['mix', 'en', 'gu', 'hi'].includes(saved || '')) setLang(saved as Lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'mix' ? 'gu' : lang;
    localStorage.setItem('zunoon-language', lang);
  }, [lang]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setLangOpen(false);
    }
    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langOpen]);

  useEffect(() => {
    if (photo !== null) {
      opener.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.current?.close();
      document.body.style.overflow = '';
      opener.current?.focus();
    }
    return () => { document.body.style.overflow = '' };
  }, [photo]);

  const nav = [
    [heading('Our story', 'અમારી વાત', 'हमारी कहानी'), 'about'],
    [heading('Club', 'ક્લબ', 'क्लब'), 'clubs'],
    [heading('Experiences', 'અનુભવો', 'अनुभव'), 'testimonials'],
    [heading('Community', 'કમ્યુનિટી', 'समुदाय'), 'community'],
    [heading('Life at Zunoon', 'ઝુનૂનમાં જીવન', 'ज़ुनून में जीवन'), 'gallery'],
    [heading('Contact us', 'સંપર્ક કરો', 'संपर्क करें'), 'contact']
  ];

  const join = `${wa}?text=${encodeURIComponent('Hello Zunoon Club! I would like to know more about annual membership and activities.')}`;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>

      <header>
        <a href="#" className="brand" aria-label="Zunoon Club home">
          <Image src="/images/logo.webp" alt="Zunoon — A Celebration of Life" width={225} height={75} priority />
        </a>
        <nav aria-label="Main navigation" id="main-nav" className={menu ? 'open' : ''}>
          {nav.map(([title, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{title}</a>)}
        </nav>
        <div className="header-actions">
          <div className="lang-switcher-wrapper" ref={langDropdownRef}>
            <button
              type="button"
              className="lang-icon-btn"
              onClick={() => setLangOpen(prev => !prev)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label="Select website language"
              title="Select language"
            >
              <Languages size={18} aria-hidden="true" />
            </button>
            {langOpen && (
              <div className="lang-dropdown" role="listbox" aria-label="Website language">
                {languages.map((opt) => {
                  const isSelected = lang === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`lang-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setLang(opt.code);
                        setLangOpen(false);
                        trackEvent({ action: 'select_language', category: 'Preferences', label: opt.code });
                      }}
                    >
                      <span className="lang-option-label">{opt.label}</span>
                      {isSelected && <Check size={16} className="lang-check" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <a
            className="button header-join"
            href="#membership"
            onClick={() => trackEvent({ action: 'click_cta', category: 'Navigation', label: 'Header Get Membership Button' })}
          >
            {heading('Get Membership', 'મેમ્બરશિપ મેળવો', 'सदस्यता लें')}<ArrowUpRight size={16} />
          </a>
          <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="main-nav" aria-label={menu ? 'Close navigation' : 'Open navigation'}>
            {menu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="main">
        {/* SECTION 01: 16:9 HERO CAROUSEL BANNER (AUTO & MANUAL SWIPE) */}
        <HeroCarousel />

        {/* SECTION 02: ABOUT ZUNOON */}
        <section className="wrap section about" id="about">
          <div>
            <h2>{heading('Our Story', 'અમારી વાત', 'हमारी कहानी')}</h2>
            <div className="about-caption">HUMAN 360° GROWTH &amp; LIFE EXPERIENCE COMMUNITY</div>
          </div>
          <div className="about-copy">
            <p className="lead">
              {t(
                'A healthier you. A wider circle. A little more joy in the everyday.',
                'હેલ્થ, સંબંધો, શોખ, વિકાસ અને ખુશીઓ — જીવનના દરેક પાસાને સાથે જોડતી કમ્યુનિટી.',
                'सेहत, रिश्ते, शौक, विकास और खुशियाँ — जीवन के हर पहलू को जोड़ता एक समुदाय.'
              )}
            </p>
            <p>
              {t(
                'Zunoon brings people together to move, play, learn, create, contribute and celebrate. Because success is also about how well you live, the people you share it with and the experiences you make time for.',
                'ઝુનૂન એક એવી કમ્યુનિટી છે જ્યાં વ્યક્તિના જીવનના વિવિધ પાસાઓને એકસાથે જોડવાનો પ્રયાસ કરવામાં આવે છે. જીવન માત્ર પૈસા કમાવવા કે સફળતા પૂરતું નથી, પરંતુ સ્વસ્થ રહેવા, કંઈક નવું શીખવા, ટેલેન્ટ ઓળખવા અને સાથે મળીને સુંદર પળો ઉજવવા માટે છે.',
                'ज़ुनून ऐसा समुदाय है जहाँ स्वस्थ रहने, नया सीखने, अपना हुनर पहचानने, समाज में योगदान देने और खूबसूरत पल साथ मनाने के अवसर मिलते हैं.'
              )}
            </p>
            <div className="about-stats">
              <div><strong>06</strong><span>{heading('Connected clubs', 'મુખ્ય ક્લબ', 'मुख्य क्लब')}</span></div>
              <div><strong>30</strong><span>{heading('Activity categories', 'એક્ટિવિટી કેટેગરી', 'गतिविधि श्रेणियाँ')}</span></div>
              <div><strong>100+</strong><span>{heading('Life experiences', 'લાઇફ એક્સપિરિયન્સ', 'जीवन अनुभव')}</span></div>
            </div>
          </div>
        </section>

        {/* MEET OUR FOUNDER (Directly below Our Story) */}
        <Founder lang={lang} />

        {/* SECTION 03 & 04: VISION, MISSION, VALUES & WHY ZUNOON (WITH 6 QUESTIONS) */}
        <Purpose lang={lang} />
        <Benefits lang={lang} />

        {/* SECTION 07-12: SIX ACTIVITY CLUBS & 30 CATEGORIES */}
        <section className="clubs-section" id="clubs">
          <div className="wrap section">
            <div className="section-top">
              <div>
                <span className="eyebrow">OUR CLUBS</span>
                <h2>
                  {heading('Follow your curiosity. ', 'તમારી રુચિથી શરૂઆત કરો. ', 'अपनी रुचि से शुरुआत करें. ')}
                  <em>{heading('Find your people.', 'તમારા લોકો સાથે જોડાઓ.', 'अपने लोगों से जुड़ें.')}</em>
                </h2>
              </div>
            </div>

            <div className="club-tabs" role="tablist" aria-label="Explore clubs">
              {clubs.map((c, i) => {
                const I = icons[i];
                return (
                  <button
                    key={c.name}
                    id={`club-tab-${i}`}
                    role="tab"
                    aria-selected={club === i}
                    aria-controls="club-content"
                    tabIndex={club === i ? 0 : -1}
                    className={club === i ? 'active' : ''}
                    onClick={() => {
                      setClub(i);
                      setOpenActivity(0);
                      trackEvent({ action: 'view_club_tab', category: 'Clubs', label: c.name });
                    }}
                    onKeyDown={e => {
                      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
                      e.preventDefault();
                      const n = e.key === 'Home' ? 0 : e.key === 'End' ? 5 : (i + (e.key === 'ArrowRight' ? 1 : 5)) % 6;
                      setClub(n);
                      setOpenActivity(0);
                      document.getElementById(`club-tab-${n}`)?.focus();
                    }}
                  >
                    <I size={22} />
                    <span>{heading(c.name, c.local[1].replace(' ક્લબ', ''), c.local[2].replace(' क्लब', ''))}</span>
                  </button>
                );
              })}
            </div>

            <div id="club-content" role="tabpanel" aria-labelledby={`club-tab-${club}`} className="club-content" style={{ '--club-bg': c.color } as React.CSSProperties}>
              {/* Left Column: Intro, Photo & Motto */}
              <div className="club-intro">
                <div className="club-badge-row">
                  <span className="club-eyebrow-pill">{c.emoji} ZUNOON {c.name.toUpperCase()} CLUB {c.emoji}</span>
                </div>
                <h3 className="club-title">{text(c.tag, lang)}</h3>
                <p className="club-desc">{text(c.description, lang)}</p>

                {(() => {
                  const clubSlot = clubSlots[club];
                  const clubImg = media.clubs?.[clubSlot] || defaultClubsMedia[clubSlot];
                  return clubImg?.url ? (
                    <div className="club-photo-frame">
                      <Image
                        src={clubImg.url}
                        width={1200}
                        height={675}
                        sizes="(max-width:800px) 100vw, 45vw"
                        alt={clubImg.alt || `Zunoon ${c.name} Club`}
                        className="club-photo-img"
                      />
                    </div>
                  ) : null;
                })()}

                {c.motto && (
                  <div className="club-quote-card">
                    <p className="club-motto-text"><strong>{c.motto}</strong></p>
                    {c.callToAction && <p className="club-cta-text"><em>{c.callToAction}</em></p>}
                  </div>
                )}
              </div>

              {/* Right Column: 5 Main Activities */}
              <div className="activity-column">
                <div className="activities-header">
                  <h4 className="activities-heading-text">{c.activitiesHeading}</h4>
                  <span className="activities-sub-count">{t('5 Categories · All Included', '૫ કેટેગરીઝ · તમામ સામેલ', '5 श्रेणियाँ · सब शामिल')}</span>
                </div>

                <div className="activity-accordion">
                  {c.categories.map((cat, i) => {
                    const isOpen = openActivity === i;
                    return (
                      <div key={`${club}-${i}`} className={`activity-card ${isOpen ? 'active' : ''}`}>
                        <button
                          type="button"
                          className="activity-card-header"
                          aria-expanded={isOpen}
                          onClick={() => setOpenActivity(isOpen ? -1 : i)}
                        >
                          <span className="activity-card-title">{text(cat, lang)}</span>
                          <ChevronDown size={19} className={`activity-chevron ${isOpen ? 'open' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="activity-card-body">
                            <div className="activity-chips-grid">
                              {activityCatalogue[club][i].map(activity => (
                                <span key={activity} className="activity-chip" lang="en">
                                  <span className="chip-dot" />
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 06: WHO CAN JOIN (8 PERSONAS) */}
        <WhoCanJoinSection lang={lang} />

        {/* SECTION 08: LIFE AT ZUNOON (GALLERY) */}
        <section className="gallery-section" id="gallery">
          <div className="wrap section">
            <div className="section-top">
              <div>
                <span className="eyebrow">LIFE AT ZUNOON</span>
                <h2>
                  {heading('Less scrolling. ', 'સ્ક્રીનથી થોડું દૂર. ', 'स्क्रीन से थोड़ा दूर. ')}
                  <em>{heading('More living.', 'જીવનની વધુ નજીક.', 'ज़िंदगी के और करीब.')}</em>
                </h2>
              </div>
            </div>

            <div className="gallery-filters">
              {activeSections.map(f => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => {
                    setFilter(f);
                    trackEvent({ action: 'filter_gallery', category: 'Gallery', label: f });
                  }}
                >
                  {f === 'All' ? heading('All moments', 'બધી પળો', 'सभी पल') : f}
                </button>
              ))}
            </div>

            <div className="gallery-grid">
              {filteredPhotos.map((p, idx) => (
                <button
                  className="gallery-photo"
                  key={p.id}
                  onClick={() => {
                    setPhoto(idx);
                    trackEvent({ action: 'view_gallery_photo', category: 'Gallery', label: p.src });
                  }}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <Image src={p.src} fill sizes="(max-width:600px) 100vw, 33vw" alt={p.alt || 'Life at Zunoon'} />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 09: MEMBER TESTIMONIALS (REAL VOICES) */}
        <Testimonials lang={lang} />

        {/* HOW ZUNOON WORKS */}
        <Journey lang={lang} />

        {/* SECTION 11: MEMBERSHIP DETAILS & 10 HIGHLIGHTS */}
        <section className="membership-section" id="membership">
          <div className="wrap section membership-layout">
            <div>
              <span className="eyebrow">MEMBERSHIP</span>
              <h2>
                {heading('A little commitment. ', 'એક નાનકડું પગલું. ', 'एक छोटा सा कदम. ')}
                <em>{heading('A whole new circle.', 'સંબંધોની નવી દુનિયા.', 'रिश्तों की नई दुनिया.')}</em>
              </h2>
              <p>{t('Your membership is an invitation to explore the sides of life you want to make more time for.', 'તમારા રસ પ્રમાણે વિવિધ ક્લબની એક્ટિવિટીઝમાં જોડાઓ. નવા લોકો, નવા અનુભવો અને નવી ખુશીઓ મેળવો.', 'अपनी रुचि के अनुसार अलग-अलग क्लब की गतिविधियों से जुड़ें. नए लोग, नए अनुभव और नई खुशियाँ पाएँ.')}</p>

              <ol className="join-steps">
                {[
                  ['Say hello', 'સંપર્ક કરો', 'संपर्क करें'],
                  ['Complete registration & membership payment', 'રજિસ્ટ્રેશન અને મેમ્બરશિપ ફી પૂર્ણ કરો', 'रजिस्ट्रेशन और सदस्यता शुल्क पूरा करें'],
                  ['Choose your interests. Join the experiences.', 'તમારી રુચિ પસંદ કરો અને એક્ટિવિટીઝમાં જોડાઓ', 'अपनी रुचि चुनें और गतिविधियों से जुड़ें']
                ].map((w, i) => (
                  <li key={i}>
                    <span>0{i + 1}</span>
                    {text(w as Words, lang)}
                  </li>
                ))}
              </ol>
            </div>

            <div className="membership-card">
              <span className="eyebrow">ZUNOON CLUB ANNUAL MEMBERSHIP</span>
              <div className="price">
                <strong>₹{feeLabel}<span> / {heading('year', 'વર્ષ', 'वर्ष')}</span></strong>
              </div>

              <ul className="highlights-full">
                {membershipHighlights.map((w) => (
                  <li key={w[0]}>
                    <Check size={16} />
                    {text(w, lang)}
                  </li>
                ))}
              </ul>

              <a
                className="button"
                href="/join/"

                rel="noopener noreferrer"
                onClick={() => trackEvent({ action: 'begin_checkout', category: 'Conversion', label: 'Membership Payment', value: feeRupees })}
              >
                {heading('Pay & Join Zunoon', 'પેમેન્ટ કરીને જોડાઓ', 'भुगतान करके जुड़ें')}<ArrowUpRight size={18} />
              </a>

              <div className="fee-note">
                <strong>{t('Activity fees are separate.', 'એક્ટિવિટી ચાર્જ અલગ છે.', 'गतिविधि शुल्क अलग है.')}</strong>{' '}
                {t(
                  `₹${feeLabel} is the annual membership fee. It does not include all activity costs. Some sessions are free; workshops, tournaments, outdoor trips and special events carry separate charges announced in advance.`,
                  `નોંધ: ₹${feeLabel}/- વાર્ષિક મેમ્બરશિપ ફી છે. તમામ એક્ટિવિટીઝ અને ઇવેન્ટ્સનો ખર્ચ તેમાં સામેલ નથી. કેટલીક એક્ટિવિટીઝ ફ્રી હોઈ શકે છે; વર્કશોપ, ટુર્નામેન્ટ, ટ્રિપ અને ખાસ ઇવેન્ટ માટે અલગ ચાર્જ લાગુ થઈ શકે છે, જે અગાઉથી જણાવવામાં આવશે.`,
                  `नोट: ₹${feeLabel}/- वार्षिक सदस्यता शुल्क है. सभी गतिविधियों का खर्च इसमें शामिल नहीं है. कुछ सत्र मुफ्त हो सकते हैं; वर्कशॉप, ट्रिप और विशेष आयोजनों के शुल्क पहले बताए जाएँगे.`
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: 15 FREQUENTLY ASKED QUESTIONS */}
        <Questions lang={lang} feeLabel={feeLabel} />

        {/* SECTION 12: FINAL CALL TO ACTION */}
        <section className="contact" id="contact">
          <div className="wrap">
            <span className="eyebrow">A CELEBRATION OF LIFE · ONE COMMUNITY · SIX CLUBS</span>
            <h2>
              {heading('Life is better', 'જીવન સુંદર બને છે,', 'ज़िंदगी बेहतर बनती है,')}<br />
              <em>{heading('when we experience it together.', 'જ્યારે સાથે માણીએ છીએ.', 'जब साथ मिलकर जीते हैं.')}</em>
            </h2>
            <p style={{ maxWidth: '650px', color: '#fbece5', fontSize: '15px', lineHeight: '1.85', margin: '15px 0 20px' }}>
              {t(
                'Life is not just about work and responsibilities. Health, happiness, friendship, learning, sports, hobbies and celebrations are just as vital. Join Zunoon today and bring new life experiences into your daily routine.',
                'જીવનમાં માત્ર કામ અને જવાબદારીઓ જ નહીં, પરંતુ Health, Happiness, Friendship, Learning, Sports, Hobbies અને Celebrations પણ જરૂરી છે. Zunoon સાથે જોડાઓ અને જીવનના દરેક ક્ષેત્રમાં નવા Experiences મેળવવાની શરૂઆત કરો.',
                'जीवन में सिर्फ काम और ज़िम्मेदारियाँ ही नहीं, बल्कि स्वास्थ्य, खुशी, दोस्ती, सीखना, खेल, शौक और उत्सव भी ज़रूरी हैं. आज ही ज़ुनून से जुड़ें और जीवन के हर पहलू में नए अनुभवों की शुरुआत करें.'
              )}
            </p>
            <div className="contact-promises">
              <span className="promise-tag">🧘 {t('Live Better', 'લાઇવ બેટર', 'बेहतर जिएँ')}</span>
              <span className="promise-tag">🤝 {t('Connect Deeper', 'કનેક્ટ ડીપર', 'गहराई से जुड़ें')}</span>
              <span className="promise-tag">🏆 {t('Play Together', 'પ્લે ટુગેધર', 'साथ खेलें')}</span>
              <span className="promise-tag">🎨 {t('Discover Passion', 'ડિસ્કવર પેશન', 'शौक पहचानें')}</span>
              <span className="promise-tag">🚀 {t('Grow Together', 'ગ્રો ટુગેધર', 'साथ बढ़ें')}</span>
              <span className="promise-tag">🎊 {t('Celebrate Life', 'સેલિબ્રેટ લાઇફ', 'जीवन का जश्न')}</span>
            </div>
            <div className="contact-actions">
              <a
                className="button light"
                href="#membership"
                onClick={() => trackEvent({ action: 'click_cta', category: 'Conversion', label: 'Contact Join Button', value: feeRupees })}
              >
                {heading(`Join Zunoon Today · ₹${feeLabel}`, `આજે જ જોડાઓ · ₹${feeLabel}`, `आज ही जुड़ें · ₹${feeLabel}`)}<ArrowUpRight size={18} />
              </a>
              <a
                className="button contact-wa-btn"
                href={join}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent({ action: 'whatsapp_lead', category: 'Conversion', label: 'Contact Section WhatsApp', value: feeRupees })}
              >
                <WhatsAppIcon size={20} />
                <span>{heading('Chat on WhatsApp', 'વોટ્સએપ પર સંપર્ક કરો', 'व्हाट्सएप पर बात करें')}</span>
                <ArrowUpRight size={18} />
              </a>
              <a
                className="call"
                href={`tel:${contact.telNumber}`}
                onClick={() => trackEvent({ action: 'phone_call_click', category: 'Lead', label: contact.displayPhone })}
              >
                <Phone size={18} />
                <span>{contact.displayPhone}</span>
              </a>
            </div>
          </div>
          <span className="contact-flower" aria-hidden="true">✳</span>
        </section>
      </main>

      {/* SECTION 13: CONTACT US & FOOTER */}
      <footer className="wrap">
        <div className="footer-top">
          <div>
            <a href="#"><Image src="/images/logo.webp" alt="Zunoon — A Celebration of Life" width={220} height={74} /></a>
          </div>
          <div className="footer-contact">
            <strong className="footer-title">{t('Zunoon Club Community', 'ઝુનૂન ક્લબ કમ્યુનિટી', 'ज़ुनून क्लब समुदाय')}</strong>
            <div className="footer-contact-item">
              <MapPin size={17} className="footer-item-icon location-icon" aria-hidden="true" />
              <span>{t(contact.addressEn, contact.addressGu, contact.addressHi)}</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={17} className="footer-item-icon phone-icon" aria-hidden="true" />
              <a href={`tel:${contact.telNumber}`}>{contact.displayPhone}</a>
            </div>
          </div>
          <div className="footer-social-column">
            <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link instagram-link">
              <Instagram size={19} className="social-icon instagram-brand-icon" aria-hidden="true" />
              <span>{contact.instagramHandle}</span>
              <ArrowUpRight size={16} />
            </a>
            <a href={join} target="_blank" rel="noopener noreferrer" className="footer-social-link whatsapp-link">
              <WhatsAppIcon size={19} className="social-icon whatsapp-brand-icon" aria-hidden="true" />
              <span>WhatsApp: {contact.displayPhone}</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className="footer-extra">
          <a href="#why-join">{heading("Why join", "શા માટે જોડાવું", "क्यों जुड़ें")}</a>
          <a href="#clubs">{heading("Six clubs", "છ ક્લબ", "छह क्लब")}</a>
          <a href="#community">{heading("Who can join", "કોણ જોડાઈ શકે", "कौन जुड़ सकता है")}</a>
          <a href="#founder">{heading("Our founder", "અમારા સ્થાપક", "हमारे संस्थापक")}</a>
          <a href="#testimonials">{heading("Member experiences", "સભ્યોના અનુભવો", "सदस्यों के अनुभव")}</a>
          <a href="#how-it-works">{heading("How it works", "કેવી રીતે જોડાવું", "कैसे जुड़ें")}</a>
          <a href="#faq">{heading("FAQs", "પ્રશ્નો", "सवाल")}</a>
          <a href="#contact">{heading("Contact", "સંપર્ક", "संपर्क")}</a>
        </div>

        <div className="footer-legal">
          <a href="/privacy">{heading("Privacy Policy", "પ્રાઈવસી પોલિસી", "गोपनीयता नीति")}</a>
          <span className="footer-legal-dot">•</span>
          <a href="/terms">{heading("Terms & Conditions", "નિયમો અને શરતો", "नियम एवं शर्तें")}</a>
          <span className="footer-legal-dot">•</span>
          <a href="/refund">{heading("Refund Policy", "રિફંડ પોલિસી", "रिफंड नीति")}</a>
        </div>

        <div className="footer-bottom">
          <span>Copyright © 2026 Zunoon Club. All Rights Reserved.</span>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON */}
      <a
        className="floating-join"
        href="#membership"
        onClick={() => trackEvent({ action: 'click_cta', category: 'Conversion', label: 'Floating Join Button', value: feeRupees })}
      >
        <span>
          {heading('Join Zunoon', 'ઝુનૂન સાથે જોડાઓ', 'ज़ुनून से जुड़ें')}
          <small>₹{feeLabel} / {heading('year', 'વર્ષ', 'वर्ष')}</small>
        </span>
        <ArrowUpRight size={22} />
      </a>

      {/* LIGHTBOX DIALOG */}
      <dialog
        ref={dialog}
        aria-label="Photograph viewer"
        onCancel={e => { e.preventDefault(); setPhoto(null) }}
        onClick={e => { if (e.target === e.currentTarget) setPhoto(null) }}
      >
        <button className="close-dialog" aria-label="Close photograph" onClick={() => setPhoto(null)}><X /></button>
        {photo !== null && filteredPhotos[photo] && (
          <div
            className="lightbox-touch-area"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="lightbox">
              <Image src={filteredPhotos[photo].src} fill sizes="90vw" alt={filteredPhotos[photo].alt || 'Life at Zunoon'} priority />
            </div>
            <div className="lightbox-footer">
              <div className="lightbox-nav-row">
                <button aria-label="Previous photograph" onClick={() => setPhoto((photo + filteredPhotos.length - 1) % filteredPhotos.length)}><ChevronLeft /></button>
                <span>{photo + 1} / {filteredPhotos.length}</span>
                <button aria-label="Next photograph" onClick={() => setPhoto((photo + 1) % filteredPhotos.length)}><ChevronRight /></button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
