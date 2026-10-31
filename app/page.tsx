'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import {ArrowUpRight,ArrowRight,Menu,X,Heart,Trophy,Handshake,TrendingUp,Palette,Sparkles,Check,Plus,Phone,Instagram,ChevronLeft,ChevronRight} from 'lucide-react';
import {clubs,photos,text,Lang,Words} from '@/lib/content';
import {Purpose,Benefits,Founder,Journey,Questions,Testimonials,WhoCanJoinSection} from '@/components/story-sections';
import {activityCatalogue} from '@/lib/activities';
import {membershipHighlights} from '@/lib/details';

const icons=[Heart,Trophy,Handshake,TrendingUp,Palette,Sparkles];
const wa='https://wa.me/919712112110';

export default function Home(){
  const [lang,setLang]=useState<Lang>('mix');
  const [menu,setMenu]=useState(false);
  const [club,setClub]=useState(0);
  const [filter,setFilter]=useState('All');
  const [photo,setPhoto]=useState<number|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const opener=useRef<HTMLElement|null>(null);

  const t=(en:string,gu:string,hi:string)=>text([en,gu,hi],lang);
  const heading=(en:string,gu:string,hi:string)=>lang==='mix'?en:t(en,gu,hi);
  const c=clubs[club];
  const Icon=icons[club];

  useEffect(()=>{
    const saved=localStorage.getItem('zunoon-language');
    if(['mix','en','gu','hi'].includes(saved||''))setLang(saved as Lang);
  },[]);

  useEffect(()=>{
    document.documentElement.lang=lang==='mix'?'gu':lang;
    localStorage.setItem('zunoon-language',lang);
  },[lang]);

  useEffect(()=>{
    if(photo!==null){
      opener.current=document.activeElement as HTMLElement;
      dialog.current?.showModal();
      document.body.style.overflow='hidden';
    } else {
      dialog.current?.close();
      document.body.style.overflow='';
      opener.current?.focus();
    }
    return()=>{document.body.style.overflow=''};
  },[photo]);

  const nav=[
    [heading('Our story','અમારી વાત','हमारी कहानी'),'about'],
    [heading('Six clubs','છ ક્લબ','छह क्लब'),'clubs'],
    [heading('Community','સભ્યો','समुदाय'),'who-can-join'],
    [heading('Experiences','અનુભવો','अनुभव'),'testimonials'],
    [heading('Life at Zunoon','ઝુનૂનની પળો','ज़ुनून के पल'),'gallery'],
    [heading('Membership','મેમ્બરશિપ','सदस्यता'),'membership']
  ];

  const join=`${wa}?text=${encodeURIComponent('Hello Zunoon Club! I would like to know more about annual membership and activities.')}`;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="announcement">
        {t('One community. Six clubs. A fuller life.','એક કમ્યુનિટી. છ ક્લબ. જીવનના અનંત અનુભવો.','एक समुदाय. छह क्लब. जीवन के अनगिनत अनुभव.')}
        <span>SURAT, GUJARAT, INDIA</span>
      </div>

      <header>
        <a href="#" className="brand" aria-label="Zunoon Club home">
          <Image src="/images/logo.webp" alt="Zunoon — A Celebration of Life" width={225} height={75} priority/>
        </a>
        <nav aria-label="Main navigation" id="main-nav" className={menu?'open':''}>
          {nav.map(([title,id])=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{title}</a>)}
        </nav>
        <div className="header-actions">
          <label className="sr-only" htmlFor="language">Website language</label>
          <select id="language" value={lang} onChange={e=>setLang(e.target.value as Lang)}>
            <option value="mix">EN + ગુ</option>
            <option value="en">English</option>
            <option value="gu">ગુજરાતી</option>
            <option value="hi">हिन्दी</option>
          </select>
          <a className="button header-join" href="#membership">
            {heading('Join the club','જોડાઓ','जुड़ें')}<ArrowUpRight size={16}/>
          </a>
          <button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="main-nav" aria-label={menu?'Close navigation':'Open navigation'}>
            {menu?<X/>:<Menu/>}</button>
        </div>
      </header>

      <main id="main">
        {/* SECTION 01: HERO BANNER */}
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="hero-badge-wrap">
              <span className="hero-badge-item"><strong>5</strong> {t('Life Zones','લાઇફ ઝોન','लाइफ ज़ोन')}</span>
              <span className="hero-badge-item"><strong>6</strong> {t('Clubs','ક્લબ','क्लब')}</span>
              <span className="hero-badge-item"><strong>30</strong> {t('Categories','કેટેગરીઝ','श्रेणियाँ')}</span>
              <span className="hero-badge-item"><strong>100+</strong> {t('Experiences','અનુભવો','अनुभव')}</span>
            </div>
            <div className="eyebrow"><span/> A CELEBRATION OF LIFE · HUMAN 360° COMMUNITY</div>
            <h1>
              {heading('A Celebration of Life.','જીવનનો એક સુંદર ઉત્સવ.','जीवन का एक सुंदर उत्सव.')}<br/>
              <em>{heading('Live Better Together.','સાથે મળીને સુંદર જીવો.','साथ मिलकर बेहतर जिएँ.')}</em>
            </h1>
            <p>
              {t(
                'Life is not just about professional success, but about healthy living, deeper friendships, pursuing passions, social contribution and celebrating every precious moment together.',
                'જીવન માત્ર સફળતા મેળવવા માટે નથી, પરંતુ સ્વસ્થ રહેવા, નવા લોકો સાથે જોડાવા, નવી Skills શીખવા, પોતાની Passionને ઓળખવા, સમાજમાં યોગદાન આપવા અને જીવનની દરેક ખાસ પળને Celebrate કરવા માટે પણ છે.',
                'जीवन सिर्फ सफलता पाने के लिए नहीं, बल्कि स्वस्थ रहने, नए लोगों से जुड़ने, नई स्किल सीखने, अपने शौक को समय देने, समाज में योगदान देने और हर पल का जश्न साथ मनाने के लिए है.'
              )}
            </p>
            <div className="hero-actions">
              <a className="button" href="#membership">
                {heading('Join Zunoon Now · ₹2,100','ઝુનૂન સાથે જોડાઓ · ₹2,100','ज़ुनून से जुड़ें · ₹2,100')}<ArrowUpRight size={18}/>
              </a>
              <a className="text-link" href="#clubs">
                {heading('Explore Our Clubs','અમારા ક્લબ્સ જુઓ','हमारे क्लब देखें')}<ArrowRight size={17}/>
              </a>
            </div>
            <div className="hero-note">
              <span className="little-flower">✳</span>
              <span>{t('Live better. Connect deeper. Grow together. Celebrate life.','લાઇવ બેટર. કનેક્ટ ડીપર. ગ્રો ટુગેધર. સેલિબ્રેટ લાઇફ.','बेहतर जिएँ. गहराई से जुड़ें. साथ बढ़ें. जीवन का जश्न मनाएँ.')}</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-photo">
              <Image src="/images/hero.webp" fill sizes="(max-width:800px) 100vw, 50vw" alt="Zunoon members sharing a moment together outdoors" priority/>
              <span className="photo-label">THE BEST PART? THE PEOPLE.</span>
            </div>
            <div className="photo-inset">
              <Image src="/images/music.webp" fill sizes="240px" alt="Members gathered for a music session"/>
            </div>
            <div className="circle-note">
              One community.<br/>
              <strong>Countless<br/>possibilities.</strong>
              <Sparkles size={22}/>
            </div>
            <span className="art-star" aria-hidden="true">✳</span>
          </div>
        </section>

        {/* CLUB RIBBON */}
        <div className="club-ribbon" aria-label="Six Zunoon clubs">
          <span className="ribbon-star" aria-hidden="true">✳</span>
          {clubs.map((c, i) => (
            <span key={c.name} className="ribbon-entry">
              <a href="#clubs" onClick={() => setClub(i)}>
                {c.name}
              </a>
              <span className="ribbon-star" aria-hidden="true">✳</span>
            </span>
          ))}
        </div>

        {/* SECTION 02: ABOUT ZUNOON */}
        <section className="wrap section about" id="about">
          <div>
            <span className="eyebrow">01 / THE ZUNOON WAY</span>
            <h2>
              {heading('Life is bigger','જીવન માત્ર','ज़िंदगी सिर्फ')}<br/>
              {heading('than your routine.','રૂટિનથી આગળ છે.','रूटीन से आगे है.')}
            </h2>
            <div className="about-caption">HUMAN 360° GROWTH &<br/>LIFE EXPERIENCE COMMUNITY</div>
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
              <div><strong>06</strong><span>{heading('Connected clubs','મુખ્ય ક્લબ','मुख्य क्लब')}</span></div>
              <div><strong>30</strong><span>{heading('Activity categories','એક્ટિવિટી કેટેગરી','गतिविधि श्रेणियाँ')}</span></div>
              <div><strong>100+</strong><span>{heading('Life experiences','લાઇફ એક્સપિરિયન્સ','जीवन अनुभव')}</span></div>
            </div>
          </div>
        </section>

        {/* SECTION 03 & 04: VISION, MISSION, VALUES & WHY ZUNOON (WITH 6 QUESTIONS) */}
        <Purpose lang={lang}/>
        <Benefits lang={lang}/>

        {/* SECTION 07-12: SIX ACTIVITY CLUBS & 30 CATEGORIES */}
        <section className="clubs-section" id="clubs">
          <div className="wrap section">
            <div className="section-top">
              <div>
                <span className="eyebrow">02 / SIX WAYS TO FEEL MORE ALIVE</span>
                <h2>
                  {heading('Follow your curiosity.','તમારી રુચિથી શરૂઆત કરો.','अपनी रुचि से शुरुआत करें.')}<br/>
                  <em>{heading('Find your people.','તમારા લોકો સાથે જોડાઓ.','अपने लोगों से जुड़ें.')}</em>
                </h2>
              </div>
              <p>{t('One membership connects you to a whole world of interests. Where will you begin?','એક કમ્યુનિટી, અનેક રુચિઓ. તમારા મનપસંદ ક્લબથી શરૂઆત કરો.','एक समुदाय, अनेक रुचियाँ. अपने पसंदीदा क्लब से शुरुआत करें.')}</p>
            </div>

            <div className="club-tabs" role="tablist" aria-label="Explore clubs">
              {clubs.map((c,i)=>{
                const I=icons[i];
                return (
                  <button
                    key={c.name}
                    id={`club-tab-${i}`}
                    role="tab"
                    aria-selected={club===i}
                    aria-controls="club-content"
                    tabIndex={club===i?0:-1}
                    className={club===i?'active':''}
                    onClick={()=>setClub(i)}
                    onKeyDown={e=>{
                      if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
                      e.preventDefault();
                      const n=e.key==='Home'?0:e.key==='End'?5:(i+(e.key==='ArrowRight'?1:5))%6;
                      setClub(n);
                      document.getElementById(`club-tab-${n}`)?.focus();
                    }}
                  >
                    <I size={22}/>
                    <span>{heading(c.name,c.local[1].replace(' ક્લબ',''),c.local[2].replace(' क्लब',''))}</span>
                  </button>
                );
              })}
            </div>

            <div id="club-content" role="tabpanel" aria-labelledby={`club-tab-${club}`} className="club-content" style={{background:c.color}}>
              <div className="club-intro">
                {(club===1||club===2||club===5)&&(
                  <figure className="club-scene">
                    <Image
                      src={club===1?'/images/sports-illustration.webp':club===2?'/images/volunteering.webp':'/images/celebration-bhajan.webp'}
                      width={1200}
                      height={700}
                      sizes="(max-width:800px) 100vw, 45vw"
                      alt={club===1?'Illustration of a friendly cricket game and badminton in a park':club===2?'Zunoon volunteers preparing donated clothes for distribution':'Zunoon members enjoying live music, tabla and bhajan during celebration'}
                    />
                    <figcaption>
                      {club===1?t('Cricket, games & team spirit · Activity illustration','ક્રિકેટ, રમતો અને ટીમ સ્પિરિટ · પ્રવૃત્તિનું ચિત્ર','क्रिकेट, खेल और टीम भावना · गतिविधि का चित्रण'):club===2?t('Care becomes action.','સેવાની ભાવનાથી કાર્ય તરફ.','सेवा की भावना से काम तक.'):t('Bhajans, music & celebration of life · Community gathering','ભજન, સંગીત અને ઉત્સવની પળો · કમ્યુનિટી મેળાવડો','भजन, संगीत और उत्सव के पल · सामुदायिक सभा')}
                    </figcaption>
                  </figure>
                )}
                <div className="club-large-icon"><Icon size={60} strokeWidth={1}/></div>
                <span className="eyebrow">ZUNOON {c.name.toUpperCase()} CLUB</span>
                <h3>{text(c.tag,lang)}</h3>
                <p>{text(c.description,lang)}</p>
                <a className="text-link" target="_blank" rel="noopener noreferrer" href={`${wa}?text=${encodeURIComponent(`Hello! I would like to explore the Zunoon ${c.name} Club activities.`)}`}>
                  {heading('Explore with us','વધુ જાણો','और जानें')}<ArrowUpRight size={18}/>
                </a>
              </div>

              <div className="activity-list">
                {c.categories.map((cat,i)=>(
                  <details key={`${club}-${i}`}>
                    <summary>
                      <span>0{i+1}</span>
                      {text(cat,lang)}
                      <Plus size={18}/>
                    </summary>
                    <p>{text(c.examples[i],lang)}</p>
                    <ul className="activity-catalogue">
                      {activityCatalogue[club][i].map(activity=>(
                        <li key={activity} lang="en">{activity}</li>
                      ))}
                    </ul>
                  </details>
                ))}
                <small>{t('Ask the team about current activities, schedules and registration.','હાલની એક્ટિવિટીઝ, સમય અને રજિસ્ટ્રેશન માટે ટીમનો સંપર્ક કરો.','वर्तमान गतिविधियों, समय और रजिस्ट्रेशन के लिए टीम से संपर्क करें.')}</small>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 06: WHO CAN JOIN (8 PERSONAS) */}
        <WhoCanJoinSection lang={lang}/>

        {/* SECTION 07: MEET OUR FOUNDER */}
        <Founder lang={lang}/>

        {/* SECTION 08: LIFE AT ZUNOON (GALLERY) */}
        <section className="gallery-section" id="gallery">
          <div className="wrap section">
            <div className="section-top">
              <div>
                <span className="eyebrow">03 / LIFE AT ZUNOON</span>
                <h2>
                  {heading('Less scrolling.','સ્ક્રીનથી થોડું દૂર.','स्क्रीन से थोड़ा दूर.')}<br/>
                  <em>{heading('More living.','જીવનની વધુ નજીક.','ज़िंदगी के और करीब.')}</em>
                </h2>
              </div>
              <p>{t('A glimpse of the people, passions and shared moments that bring us together.','સેવા, દાન, સંગીત, મિત્રતા અને ઉજવણીની યાદગાર પળોની એક ઝલક.','सेवा, दान, संगीत, दोस्ती और उत्सव के यादगार पलों की एक झलक.')}</p>
            </div>

            <div className="gallery-filters">
              {['All','Donation','Volunteering','Music','Outdoors','Celebration','Community'].map((f,i)=>(
                <button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>
                  {heading(
                    ['All moments','Donation','Volunteering','Music','Outdoors','Celebration','Community'][i],
                    ['બધી પળો','દાન','સેવા','સંગીત','પ્રકૃતિ','ઉજવણી','કમ્યુનિટી'][i],
                    ['सभी पल','दान','सेवा','संगीत','प्रकृति','उत्सव','समुदाय'][i]
                  )}
                </button>
              ))}
            </div>

            <div className="gallery-grid">
              {photos.map((p,i)=>({...p,i})).filter(p=>filter==='All'||p.category===filter).map(p=>(
                <button className="gallery-photo" key={p.src} onClick={()=>setPhoto(p.i)} aria-label={text(p.label,lang)}>
                  <Image src={`/images/${p.src}.webp`} fill sizes="(max-width:600px) 100vw, 33vw" alt={text(p.label,lang)}/>
                  <span>{text(p.label,lang)}<ArrowUpRight size={20}/></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 09: MEMBER TESTIMONIALS (REAL VOICES) */}
        <Testimonials lang={lang}/>

        {/* HOW ZUNOON WORKS */}
        <Journey lang={lang}/>

        {/* SECTION 11: MEMBERSHIP DETAILS & 10 HIGHLIGHTS */}
        <section className="membership-section" id="membership">
          <div className="wrap section membership-layout">
            <div>
              <span className="eyebrow">05 / MAKE ROOM FOR MORE</span>
              <h2>
                {heading('A little commitment.','એક નાનકડું પગલું.','एक छोटा सा कदम.')}<br/>
                <em>{heading('A whole new circle.','સંબંધોની નવી દુનિયા.','रिश्तों की नई दुनिया.')}</em>
              </h2>
              <p>{t('Your membership is an invitation to explore the sides of life you want to make more time for.','તમારા રસ પ્રમાણે વિવિધ ક્લબની એક્ટિવિટીઝમાં જોડાઓ. નવા લોકો, નવા અનુભવો અને નવી ખુશીઓ મેળવો.','अपनी रुचि के अनुसार अलग-अलग क्लब की गतिविधियों से जुड़ें. नए लोग, नए अनुभव और नई खुशियाँ पाएँ.')}</p>

              <ol className="join-steps">
                {[
                  ['Say hello','સંપર્ક કરો','संपर्क करें'],
                  ['Complete registration & membership payment','રજિસ્ટ્રેશન અને મેમ્બરશિપ ફી પૂર્ણ કરો','रजिस्ट्रेशन और सदस्यता शुल्क पूरा करें'],
                  ['Choose your interests. Join the experiences.','તમારી રુચિ પસંદ કરો અને એક્ટિવિટીઝમાં જોડાઓ','अपनी रुचि चुनें और गतिविधियों से जुड़ें']
                ].map((w,i)=>(
                  <li key={i}>
                    <span>0{i+1}</span>
                    {text(w as Words,lang)}
                  </li>
                ))}
              </ol>
            </div>

            <div className="membership-card">
              <span className="eyebrow">ZUNOON CLUB ANNUAL MEMBERSHIP</span>
              <div className="price">
                <s>₹4,999</s>
                <strong>₹2,100<span> / {heading('year','વર્ષ','वर्ष')}</span></strong>
              </div>
              <p>{t('One year validity. One community. Endless experiences.','વાર્ષિક માન્યતા: 1 વર્ષ. એક કમ્યુનિટી. અનંત અનુભવો.','एक वर्ष की मान्यता. एक समुदाय. अनगिनत अनुभव.')}</p>
              
              <ul className="highlights-full">
                {membershipHighlights.map((w)=>(
                  <li key={w[0]}>
                    <Check size={16}/>
                    {text(w,lang)}
                  </li>
                ))}
              </ul>

              <a className="button" href={join} target="_blank" rel="noopener noreferrer">
                {heading('Enquire & Join on WhatsApp','વોટ્સએપ દ્વારા જોડાઓ','व्हाट्सएप से जुड़ें')}<ArrowUpRight size={18}/>
              </a>

              <div className="fee-note">
                <strong>{t('Activity fees are separate.','એક્ટિવિટી ચાર્જ અલગ છે.','गतिविधि शुल्क अलग है.')}</strong>{' '}
                {t(
                  '₹2,100 is the annual membership fee. It does not include all activity costs. Some sessions are free; workshops, tournaments, outdoor trips and special events carry separate charges announced in advance.',
                  'નોંધ: ₹2,100/- વાર્ષિક મેમ્બરશિપ ફી છે. તમામ એક્ટિવિટીઝ અને ઇવેન્ટ્સનો ખર્ચ તેમાં સામેલ નથી. કેટલીક એક્ટિવિટીઝ ફ્રી હોઈ શકે છે; વર્કશોપ, ટુર્નામેન્ટ, ટ્રિપ અને ખાસ ઇવેન્ટ માટે અલગ ચાર્જ લાગુ થઈ શકે છે, જે અગાઉથી જણાવવામાં આવશે.',
                  'नोट: ₹2,100/- वार्षिक सदस्यता शुल्क है. सभी गतिविधियों का खर्च इसमें शामिल नहीं है. कुछ सत्र मुफ्त हो सकते हैं; वर्कशॉप, ट्रिप और विशेष आयोजनों के शुल्क पहले बताए जाएँगे.'
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: 15 FREQUENTLY ASKED QUESTIONS */}
        <Questions lang={lang}/>

        {/* SECTION 12: FINAL CALL TO ACTION */}
        <section className="contact" id="contact">
          <div className="wrap">
            <span className="eyebrow">A CELEBRATION OF LIFE · ONE COMMUNITY · SIX CLUBS</span>
            <h2>
              {heading('Life is better','જીવન સુંદર બને છે,','ज़िंदगी बेहतर बनती है,')}<br/>
              <em>{heading('when we experience it together.','જ્યારે સાથે માણીએ છીએ.','जब साथ मिलकर जीते हैं.')}</em>
            </h2>
            <p style={{maxWidth:'650px',color:'#fbece5',fontSize:'15px',lineHeight:'1.85',margin:'15px 0 20px'}}>
              {t(
                'Life is not just about work and responsibilities. Health, happiness, friendship, learning, sports, hobbies and celebrations are just as vital. Join Zunoon today and bring new life experiences into your daily routine.',
                'જીવનમાં માત્ર કામ અને જવાબદારીઓ જ નહીં, પરંતુ Health, Happiness, Friendship, Learning, Sports, Hobbies અને Celebrations પણ જરૂરી છે. Zunoon સાથે જોડાઓ અને જીવનના દરેક ક્ષેત્રમાં નવા Experiences મેળવવાની શરૂઆત કરો.',
                'जीवन में सिर्फ काम और ज़िम्मेदारियाँ ही नहीं, बल्कि स्वास्थ्य, खुशी, दोस्ती, सीखना, खेल, शौक और उत्सव भी ज़रूरी हैं. आज ही ज़ुनून से जुड़ें और जीवन के हर पहलू में नए अनुभवों की शुरुआत करें.'
              )}
            </p>
            <div className="contact-promises">
              <span className="promise-tag">🧘 {t('Live Better','લાઇવ બેટર','बेहतर जिएँ')}</span>
              <span className="promise-tag">🤝 {t('Connect Deeper','કનેક્ટ ડીપર','गहराई से जुड़ें')}</span>
              <span className="promise-tag">🏆 {t('Play Together','પ્લે ટુગેધર','साथ खेलें')}</span>
              <span className="promise-tag">🎨 {t('Discover Passion','ડિસ્કવર પેશન','शौक पहचानें')}</span>
              <span className="promise-tag">🚀 {t('Grow Together','ગ્રો ટુગેધર','साथ बढ़ें')}</span>
              <span className="promise-tag">🎊 {t('Celebrate Life','સેલિબ્રેટ લાઇફ','जीवन का जश्न')}</span>
            </div>
            <div className="contact-actions">
              <a className="button light" href="#membership">
                {heading('Join Zunoon Today · ₹2,100','આજે જ જોડાઓ · ₹2,100','आज ही जुड़ें · ₹2,100')}<ArrowUpRight size={18}/>
              </a>
              <a className="button" style={{background:'#1f2e23',borderColor:'#3a5040'}} href={join} target="_blank" rel="noopener noreferrer">
                {heading('Chat on WhatsApp','વોટ્સએપ પર સંપર્ક કરો','व्हाट्सएप पर बात करें')}<ArrowUpRight size={18}/>
              </a>
              <a className="call" href="tel:+919712112110"><Phone size={17}/>97 121 121 10</a>
            </div>
          </div>
          <span className="contact-flower" aria-hidden="true">✳</span>
        </section>
      </main>

      {/* SECTION 13: CONTACT US & FOOTER */}
      <footer className="wrap">
        <div className="footer-top">
          <div>
            <a href="#"><Image src="/images/logo.webp" alt="Zunoon — A Celebration of Life" width={220} height={74}/></a>
            <p style={{marginTop:'12px'}}>{t('Live better. Connect deeper. Grow together. Celebrate life.','લાઇવ બેટર. કનેક્ટ ડીપર. ગ્રો ટુગેધર. સેલિબ્રેટ લાઇફ.','बेहतर जिएँ. गहराई से जुड़ें. साथ बढ़ें. जीवन का जश्न मनाएँ.')}</p>
          </div>
          <div className="footer-contact">
            <strong>{t('Zunoon Club Community','ઝુનૂન ક્લબ કમ્યુનિટી','ज़ुनून क्लब समुदाय')}</strong><br/>
            <span>📍 {t('Surat, Gujarat, India','સુરત, ગુજરાત, ભારત','सूरत, गुजरात, भारत')}</span><br/>
            <span>📞 / 💬 <a href="tel:+919712112110" style={{textDecoration:'underline'}}>97 121 121 10</a></span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <a href="https://www.instagram.com/zunoon_club/" target="_blank" rel="noopener noreferrer" className="instagram">
              <Instagram size={20}/>@zunoon_club<ArrowUpRight size={16}/>
            </a>
            <a href={join} target="_blank" rel="noopener noreferrer" className="instagram" style={{color:'var(--ink)'}}>
              💬 WhatsApp: 97 121 121 10<ArrowUpRight size={16}/>
            </a>
          </div>
        </div>

        <div className="footer-extra">
          <a href="#why-join">{heading("Why join","શા માટે જોડાવું","क्यों जुड़ें")}</a>
          <a href="#clubs">{heading("Six clubs","છ ક્લબ","छह क्लब")}</a>
          <a href="#community">{heading("Who can join","કોણ જોડાઈ શકે","कौन जुड़ सकता है")}</a>
          <a href="#founder">{heading("Our founder","અમારા સ્થાપક","हमारे संस्थापक")}</a>
          <a href="#testimonials">{heading("Member experiences","સભ્યોના અનુભવો","सदस्यों के अनुभव")}</a>
          <a href="#how-it-works">{heading("How it works","કેવી રીતે જોડાવું","कैसे जुड़ें")}</a>
          <a href="#faq">{heading("FAQs","પ્રશ્નો","सवाल")}</a>
          <a href="#contact">{heading("Contact","સંપર્ક","संपर्क")}</a>
        </div>

        <div className="footer-bottom">
          <span>Copyright © 2026 Zunoon Club. All Rights Reserved.</span>
          <div>{nav.map(([title,id])=><a key={id} href={`#${id}`}>{title}</a>)}</div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON */}
      <a className="floating-join" href="#membership">
        <span>
          {heading('Join Zunoon','ઝુનૂન સાથે જોડાઓ','ज़ुनून से जुड़ें')}
          <small>₹2,100 / {heading('year','વર્ષ','वर्ष')}</small>
        </span>
        <ArrowUpRight size={22}/>
      </a>

      {/* LIGHTBOX DIALOG */}
      <dialog
        ref={dialog}
        aria-label={photo===null?'Photograph':text(photos[photo].label,lang)}
        onCancel={e=>{e.preventDefault();setPhoto(null)}}
        onClick={e=>{if(e.target===e.currentTarget)setPhoto(null)}}
      >
        <button className="close-dialog" aria-label="Close photograph" onClick={()=>setPhoto(null)}><X/></button>
        {photo!==null&&(
          <>
            <div className="lightbox">
              <Image src={`/images/${photos[photo].src}.webp`} fill sizes="90vw" alt={text(photos[photo].label,lang)}/>
            </div>
            <div className="lightbox-footer">
              <p>{text(photos[photo].label,lang)}</p>
              <div>
                <button aria-label="Previous photograph" onClick={()=>setPhoto((photo+photos.length-1)%photos.length)}><ChevronLeft/></button>
                <span>{photo+1} / {photos.length}</span>
                <button aria-label="Next photograph" onClick={()=>setPhoto((photo+1)%photos.length)}><ChevronRight/></button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
