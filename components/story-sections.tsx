'use client';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import {useMedia} from '@/lib/use-media';
import {defaultValuesMedia, defaultWhyMedia, defaultFounderMedia, whySlots, communitySlots, defaultCommunityMedia} from '@/lib/media';
import {Lang,Words,text} from '@/lib/content';
import {values,valuesDetail,journey,faqs,questionsWhy,testimonials,whoCanJoin} from '@/lib/details';
import {MemberReview, defaultMemberReviews} from '@/lib/testimonials';
import {Heart,TrendingUp,Sparkles,BookOpen,Users,Plus,ArrowUpRight,Quote,Compass} from 'lucide-react';

const valueIconsMap = {
  users: Users,
  compass: Compass,
  book: BookOpen,
  trending: TrendingUp,
  heart: Heart,
  sparkles: Sparkles
};

function copy(lang:Lang){
  return {
    t:(en:string,gu:string,hi:string)=>text([en,gu,hi],lang),
    h:(en:string,gu:string,hi:string)=>lang==='mix'?en:text([en,gu,hi],lang),
    w:(v:Words)=>text(v,lang)
  };
}

export function Purpose({lang}:{lang:Lang}){
  const media=useMedia();
  const {t,h,w}=copy(lang);
  return (
    <section className="purpose wrap" id="purpose">
      {/* 1. VISION & MISSION IN 1 SECTION */}
      <div className="section-head-simple">
        <h2>{h('Our Vision and Mission','અમારું વિઝન અને મિશન','हमारा विज़न और मिशन')}</h2>
      </div>
      <div className="vm-single-box">
        <span className="eyebrow">OUR VISION & MISSION</span>
        <h3>{h('A fuller life, for everyone.','સૌ માટે સમૃદ્ધ જીવન.','सबके लिए समृद्ध जीवन.')}</h3>
        <p className="vm-single-text">
          {t(
            'Our vision and mission is to make room for what truly matters—bringing health, meaningful connections, sports, hobbies, personal growth and shared celebrations together on a single community platform, so everyone has the opportunity to live fully, grow continuously, and celebrate life beyond routine.',
            'ઝુનૂનનું વિઝન અને મિશન દરેક વ્યક્તિને પોતાના વ્યસ્ત જીવનમાંથી મહત્વની બાબતો માટે સમય કાઢી સ્વાસ્થ્ય, સામાજિક સંબંધો, સ્પોર્ટ્સ, શોખ, વ્યક્તિગત વિકાસ અને ઉજવણીને એક મંચ પર સાથે જોડવાનું છે — જ્યાં સફળતા માત્ર કરિયર પૂરતી સીમિત ન રહેતાં, દરેક વ્યક્તિને જોડાવા, શીખવા, આગળ વધવા અને જીવનને સુંદર રીતે અનુભવવાની તક મળે.',
            'ज़ुनून का विज़न और मिशन हर व्यक्ति को अपनी व्यस्त दिनचर्या से ज़रूरी बातों के लिए समय निकालकर सेहत, सामाजिक रिश्तों, खेल, शौक, व्यक्तिगत विकास और उत्सव को एक साझा मंच पर जोड़ना है — ताकि सफलता केवल करियर तक सीमित न रहे, बल्कि हर किसी को जुड़ने, सीखने, आगे बढ़ने और एक संपूर्ण जीवन जीने का अवसर मिले.'
          )}
        </p>
      </div>

      <div className="vm-single-box values-box" id="values" aria-labelledby="values-heading">
        <span className="eyebrow">OUR VALUES</span>
        <h3 id="values-heading">{h('Six guiding principles.','છ મુખ્ય મૂલ્યો.','छह मुख्य मूल्य.')}</h3>
        <div className="values-image-grid">
          {values.map(v => {
            const key = v[0].toLowerCase();
            const item = media.values[key] || defaultValuesMedia[key];
            return (
              <figure key={v[0]} className="value-image-card">
                {item?.url && (
                  <Image
                    src={item.url}
                    alt={item.alt || `${v[0]} value`}
                    fill
                    sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 33vw"
                  />
                )}
                <figcaption><span className="value-image-title">{lang==='mix'?v[0]:w(v)}</span></figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Benefits({lang}:{lang:Lang}){
  const media=useMedia();
  const {t,h,w}=copy(lang);
  return (
    <section className="benefits-section" id="why-join">
      <div className="wrap section">
        <div className="section-top">
          <div>
            <span className="eyebrow">WHY TO JOIN ZUNOON?</span>
            <h2>{h('For every side of your life.','તમારા જીવનના દરેક પાસા માટે.','आपके जीवन के हर पहलू के लिए.')}</h2>
          </div>
        </div>
        <div className="why-questions">
          <span className="eyebrow questions-eyebrow">{h('DOES THIS SOUND FAMILIAR?','શું તમારી સાથે પણ આવું થાય છે?','क्या आपके साथ भी ऐसा होता है?')}</span>
          <div className="questions-grid">
            {questionsWhy.map((item,idx)=>{
              const slot = whySlots[idx];
              const img = media.why?.[slot] || defaultWhyMedia[slot];
              return (
                <div key={idx} className="question-card">
                  {img?.url && (
                    <div className="question-image-wrap">
                      <Image
                        src={img.url}
                        alt={img.alt || (lang==='mix'?item.area[0]:w(item.area))}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                      />
                      <div className="question-image-gradient" />
                    </div>
                  )}
                  <div className="question-card-body">
                    <span className="question-idx">{lang==='mix'?item.area[0]:w(item.area)}</span>
                    <p>{w(item.q)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhoCanJoinSection({lang}:{lang:Lang}){
  const {t,h,w}=copy(lang);
  const media=useMedia();
  return (
    <section className="wrap section who-section" id="community">
      <div className="section-top">
        <div>
          <span className="eyebrow">WHO CAN JOIN ZUNOON</span>
          <h2>{h('There is a place ','અહીં સૌના માટે ','यहाँ सबके लिए ')}<em>{h('for you here.','એક જગ્યા છે.','एक जगह છે.')}</em></h2>
        </div>
      </div>
      <div className="who-grid">
        {whoCanJoin.map((item,idx)=>{
          const slot = communitySlots[idx];
          const img = media.community?.[slot] || defaultCommunityMedia[slot];
          return (
            <div key={idx} className="who-card">
              {img?.url && (
                <div className="who-image-wrap">
                  <Image
                    src={img.url}
                    alt={img.alt || (lang==='mix'?item.role[0]:w(item.role))}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
                    className="who-card-img"
                  />
                  <div className="who-image-gradient" />
                </div>
              )}
              <div className="who-card-body">
                <h3>{lang==='mix'?item.role[0]:w(item.role)}</h3>
                <p>{w(item.description)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Founder({lang}:{lang:Lang}){
  const {t,h}=copy(lang);
  const media=useMedia();
  const founderImg = media.founder || defaultFounderMedia;
  return (
    <section className="founder-section wrap section" id="founder">
      <div className="founder-header">
        <span className="eyebrow">{h('MEET OUR FOUNDER','અમારા સ્થાપક','हमारे संस्थापक')}</span>
        <h2>{h('Growth beyond achievement.','સફળતાથી આગળનો વિકાસ.','उपलब्धियों से आगे का विकास.')}</h2>
      </div>
      <div className="founder-grid">
        <div className="founder-profile">
          <div className="founder-photo-container">
            <Image
              src={founderImg.url}
              alt={founderImg.alt || 'Jainit Finaviya — Founder'}
              fill
              sizes="(max-width: 768px) 240px, 260px"
              className="founder-photo-img"
            />
            <div className="founder-photo-gradient" />
            <div className="founder-photo-overlay-info">
              <span className="founder-photo-name">Jainit Finaviya</span>
              <span className="founder-photo-tag">{h('Founder · Zunoon Club','સ્થાપક · ઝુનૂન ક્લબ','संस्थापक · ज़ुनून क्लब')}</span>
            </div>
          </div>
        </div>
        <div className="founder-story">
          <p className="founder-lead-text">{t('Jainit Finaviya began the Zunoon journey in 2006 with a vision of a community where people can grow across different areas of life. His outlook brings health, relationships, knowledge, creativity, contribution and happiness into the same conversation.','વર્ષ 2006થી ઝુનૂનની યાત્રા શરૂ કરનાર જૈનિત ફિનાવિયાનો વિચાર એવી કમ્યુનિટી બનાવવાનો છે જ્યાં લોકો જીવનના વિવિધ ક્ષેત્રોમાં વિકસી શકે. તેમની દૃષ્ટિમાં હેલ્થ, સંબંધો, જ્ઞાન, સર્જનાત્મકતા, સમાજ સેવા અને ખુશીનો સમાવેશ થાય છે.','2006 में ज़ुनून की यात्रा शुरू करने वाले जैनित फिनाविया की दृष्टि ऐसा समुदाय बनाने की है जहाँ लोग जीवन के विभिन्न क्षेत्रों में विकसित हों. इसमें सेहत, रिश्ते, ज्ञान, रचनात्मकता, समाज सेवा और खुशी शामिल हैं.')}</p>
          <blockquote>
            <span className="eyebrow">{h('FOUNDER’S MESSAGE','સ્થાપકનો સંદેશ','संस्थापक का संदेश')}</span>
            <p>{t('“I believe true success in life cannot be measured only by money or professional achievement. A healthy body, peaceful mind, strong relationships, continuous learning and beautiful experiences are important parts of success too. Zunoon is my effort to bring all of these together in one community.”','“મારું માનવું છે કે જીવનની સાચી સફળતા માત્ર પૈસા કે Professional Achievementથી માપી શકાતી નથી. એક Healthy Body, Peaceful Mind, Strong Relationships, Continuous Learning અને Beautiful Experiences પણ જીવનની સફળતાના મહત્વપૂર્ણ ભાગ છે. Zunoon એ આ તમામ બાબતોને એક Communityમાં જોડવાનો મારો પ્રયાસ છે.”','“मेरा मानना है कि जीवन की सच्ची सफलता केवल पैसे या पेशेवर उपलब्धियों से नहीं मापी जा सकती. स्वस्थ शरीर, शांत मन, मजबूत रिश्ते, निरंतर सीखना और सुंदर अनुभव भी सफलता के महत्वपूर्ण हिस्से हैं. ज़ुनून इन सबको एक समुदाय में जोड़ने का मेरा प्रयास है.”')}</p>
            <cite>— Jainit Finaviya</cite>
          </blockquote>
          <p className="founder-note">{t('Connect, learn, grow and celebrate life together.','ચાલો, સાથે જોડાઈએ, સાથે શીખીએ, સાથે વિકાસ કરીએ અને જીવનની દરેક પળને ઉજવીએ.','आइए साथ जुड़ें, सीखें, बढ़ें और जीवन के हर पल का जश्न मनाएँ.')}</p>
          <div className="founder-meta-row">
            <div className="founder-year">
              <span className="founder-year-num">2006</span>
              <span className="founder-year-label">{h('Year the journey began','યાત્રા શરૂ થયાનું વર્ષ','यात्रा की शुरुआत का वर्ष')}</span>
            </div>
            <div className="founder-badge-motto">
              <span>{h('One Community · Infinite Experiences','એક કમ્યુનિટી · અનંત અનુભવો','एक समुदाय · अनगिनत अनुभव')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials({lang}:{lang:Lang}){
  const {h}=copy(lang);
  const [reviews, setReviews] = useState<MemberReview[]>(defaultMemberReviews);

  useEffect(() => {
    let active = true;
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (active && data?.testimonials && data.testimonials.length > 0) {
          setReviews(data.testimonials);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <section className="testimonials-section wrap section" id="testimonials">
      <div className="section-top">
        <div>
          <span className="eyebrow">MEMBER EXPERIENCES</span>
          <h2>{h('Don’t just hear about it. ','વાતોથી આગળ વધીને, ','सिर्फ बातों में नहीं. ')}<em>{h('Experience Zunoon.','અનુભવ કરો ઝુનૂન.','अनुभव करें ज़ुनून.')}</em></h2>
        </div>
      </div>
      <div className="testimonials-grid">
        {reviews.map((item)=>(
          <article key={item.id} className="testimonial-card">
            <div className="card-top">
              <span className="testimonial-cat">{item.category}</span>
              <Quote size={20} className="quote-icon"/>
            </div>
            <blockquote>“{item.quote.replace(/^[“"]|[”"]$/g, '')}”</blockquote>
            <div className="testimonial-footer">
              <strong className="testimonial-author-name">{item.author}</strong>
              {item.role && <span className="testimonial-author-role">{item.role}</span>}
              {!item.role && item.title && <span className="testimonial-author-role">{item.title}</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Journey({lang}:{lang:Lang}){
  const {t,h,w}=copy(lang);
  return (
    <section className="journey-section wrap section" id="how-it-works">
      <div className="section-top">
        <div>
          <span className="eyebrow">HOW ZUNOON WORKS</span>
          <h2>{h('Your next chapter, ','તમારી નવી શરૂઆત, ','आपकी नई शुरुआत, ')}<em>{h('one step at a time.','એક એક પગલે.','एक-एक कदम से.')}</em></h2>
        </div>
      </div>
      <ol className="journey-grid">
        {journey.map((s,i)=>(
          <li key={s.title[0]}>
            <span className="journey-number">0{i+1}<ArrowUpRight size={22}/></span>
            <h3>{lang==='mix'?s.title[0]:w(s.title)}</h3>
            <p>{w(s.body)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Questions({lang,feeLabel}:{lang:Lang;feeLabel:string}){
  const {h,w}=copy(lang);
  return (
    <section className="wrap section faq" id="faq">
      <div>
        <span className="eyebrow">GOOD TO KNOW</span>
        <h2>{h('A few questions, ','થોડા પ્રશ્નો, ','कुछ सवाल, ')}<em>{h('before you join.','જોડાતા પહેલાં.','जुड़ने से पहले.')}</em></h2>
        <a className="text-link faq-contact" href="https://wa.me/919712112110" target="_blank" rel="noopener noreferrer">
          {h('Ask us on WhatsApp','WhatsApp પર પૂછો','WhatsApp पर पूछें')}<ArrowUpRight size={18}/>
        </a>
      </div>
      <div>
        {faqs.map((f,i)=>(
          <details key={f.q[0]}>
            <summary>
              <span className="faq-question"><small>{String(i+1).padStart(2,'0')}</small>{w(f.q)}</span>
              <Plus size={18}/>
            </summary>
            <p>{w(f.a).replace("₹2,100",feeLabel)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
