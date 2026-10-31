import {Lang,Words,text} from '@/lib/content';
import {benefits,values,valuesDetail,journey,faqs,questionsWhy,testimonials,whoCanJoin} from '@/lib/details';
import {Heart,Handshake,Trophy,TrendingUp,Palette,Sparkles,BookOpen,Users,Plus,ArrowUpRight,Quote,Compass} from 'lucide-react';

const benefitIcons=[Heart,Users,Trophy,TrendingUp,BookOpen,Palette,Handshake,Sparkles];
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
  const {t,h,w}=copy(lang);
  return (
    <section className="purpose wrap" id="purpose">
      <div className="purpose-grid">
        <article>
          <span className="eyebrow">OUR VISION</span>
          <h3>{h('A fuller life, for everyone.','સૌ માટે સમૃદ્ધ જીવન.','सबके लिए समृद्ध जीवन.')}</h3>
          <p>{t('A community where everyone finds opportunities to live, connect, learn, grow and celebrate. Success includes health, happiness and strong relationships, alongside professional achievement.','દરેક વ્યક્તિને જોડાવા, શીખવા, આગળ વધવા અને જીવનને સુંદર રીતે અનુભવવાની તકો મળે. સફળતામાં કરિયર સાથે સ્વાસ્થ્ય, ખુશી અને મજબૂત સંબંધો પણ એટલાં જ મહત્વના છે.','ऐसा समुदाय जहाँ सभी को जुड़ने, सीखने, बढ़ने और जीवन का आनंद लेने के अवसर मिलें. सफलता में करियर के साथ सेहत, खुशी और मजबूत रिश्ते भी ज़रूरी हैं.')}</p>
        </article>
        <article>
          <span className="eyebrow">OUR MISSION</span>
          <h3>{h('Make room for what matters.','મહત્વની બાબતોને સમય આપો.','ज़रूरी बातों को समय दें.')}</h3>
          <p>{t('Bring health, social contribution, sports, hobbies, personal growth and celebration together through shared activities, workshops and experiences.','હેલ્થ, સમાજ સેવા, સ્પોર્ટ્સ, શોખ, વ્યક્તિગત વિકાસ અને ઉજવણીને એક્ટિવિટીઝ, વર્કશોપ અને અનુભવો દ્વારા એક પ્લેટફોર્મ પર જોડવા.','सेहत, समाज सेवा, खेल, शौक, व्यक्तिगत विकास और उत्सव को गतिविधियों, वर्कशॉप और अनुभवों से एक मंच पर जोड़ना.')}</p>
        </article>
        <article className="values-card">
          <span className="eyebrow">OUR VALUES</span>
          <h3>{h('Six guiding principles.','છ મુખ્ય મૂલ્યો.','छह मुख्य मूल्य.')}</h3>
          <div className="values-points-grid">
            {values.map((v, i) => (
              <div key={v[0]} className="value-point">
                <span className="value-point-num">0{i + 1}</span>
                <span className="value-point-name">{lang === 'mix' ? v[0] : w(v)}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="life-model">
        <strong>{h('Five life zones. One shared celebration.','પાંચ લાઇફ ઝોન. સાથે મળીને ઉજવણી.','पाँच लाइफ ज़ोन. साथ मिलकर उत्सव.')}</strong>
        <p>{t('Health, Social, Sports, Hobby and Growth form five life zones. Celebration is the sixth activity club—and the shared joy that connects them all.','હેલ્થ, સોશિયલ, સ્પોર્ટ્સ, હોબી અને ગ્રોથ—પાંચ લાઇફ ઝોન છે. સેલિબ્રેશન છઠ્ઠો એક્ટિવિટી ક્લબ છે અને આ તમામને ખુશી અને યાદો દ્વારા જોડે છે.','हेल्थ, सोशल, स्पोर्ट्स, हॉबी और ग्रोथ—पाँच लाइफ ज़ोन हैं. सेलिब्रेशन छठा गतिविधि क्लब है, जो सबको खुशी और यादों से जोड़ता है.')}</p>
      </div>
    </section>
  );
}

export function Benefits({lang}:{lang:Lang}){
  const {t,h,w}=copy(lang);
  return (
    <section className="benefits-section" id="why-join">
      <div className="wrap section">
        <div className="section-top">
          <div>
            <span className="eyebrow">WHY ZUNOON</span>
            <h2>{h('For every side','તમારા જીવનના','आपके जीवन के')}<br/><em>{h('of your life.','દરેક પાસા માટે.','हर पहलू के लिए.')}</em></h2>
          </div>
          <p>{t('Busy days can leave little room for health, friends and the things you love. Zunoon brings people and opportunities together, so you can make time for more.','કામ અને જવાબદારીઓમાં હેલ્થ, મિત્રો અને શોખ પાછળ રહી જાય છે? ઝુનૂન તમને લોકો અને તકો સાથે જોડે છે, જેથી જીવનના દરેક પાસાને સમય આપી શકો.','काम और ज़िम्मेदारियों में सेहत, दोस्त और शौक पीछे रह जाते हैं? ज़ुनून लोगों और अवसरों से जोड़ता है, ताकि जीवन के हर पहलू को समय दे सकें.')}</p>
        </div>
        <div className="why-questions">
          <span className="eyebrow questions-eyebrow">{h('DOES THIS SOUND FAMILIAR?','શું તમારી સાથે પણ આવું થાય છે?','क्या आपके साथ भी ऐसा होता है?')}</span>
          <div className="questions-grid">
            {questionsWhy.map((item,idx)=>(
              <div key={idx} className="question-card">
                <span className="question-idx">0{idx+1} · {lang==='mix'?item.area[0]:w(item.area)}</span>
                <p>{w(item.q)}</p>
              </div>
            ))}
          </div>
          <div className="solution-banner">
            <strong>{h('THE ZUNOON SOLUTION','ઝુનૂન સમાધાન','ज़ुनून समाधान')}</strong>
            <p>{t('Instead of searching for these in different scattered places, Zunoon brings health, fitness, connections, hobbies, growth and celebration together on a single structured community platform. One Community. Multiple Interests. Endless Experiences.','જીવનના આ તમામ પાસાઓને અલગ-અલગ જગ્યાએ શોધવાને બદલે, Zunoon તમને એક જ Community Platform પર જોડાવાની તક આપે છે. One Community. Multiple Interests. Endless Experiences.','जीवन के इन सभी पहलुओं को अलग-अलग तलाशने के बजाय, ज़ुनून आपको एक ही समुदाय में जोड़ने का अवसर देता है. एक समुदाय. अनेक रुचियाँ. अनगिनत अनुभव.')}</p>
          </div>
        </div>
        <div className="benefit-grid">
          {benefits.map((b,i)=>{
            const Icon=benefitIcons[i];
            return (
              <article key={b.title[0]}>
                <Icon size={25} strokeWidth={1.4}/>
                <h3>{lang==='mix'?b.title[0]:w(b.title)}</h3>
                <p>{w(b.body)}</p>
              </article>
            );
          })}
        </div>
        <p className="benefits-note">{t('Membership opens participation opportunities across the clubs. Activity schedules, eligibility and any additional charges are shared separately.','મેમ્બરશિપ વિવિધ ક્લબમાં ભાગ લેવાની તકો આપે છે. એક્ટિવિટીનો સમય, પાત્રતા અને વધારાના ચાર્જ અલગથી જણાવાય છે.','सदस्यता क्लब की गतिविधियों में भाग लेने के अवसर देती है. समय, पात्रता और अतिरिक्त शुल्क अलग से बताए जाते हैं.')}</p>
      </div>
    </section>
  );
}

export function WhoCanJoinSection({lang}:{lang:Lang}){
  const {t,h,w}=copy(lang);
  return (
    <section className="wrap section who-section" id="community">
      <div className="section-top">
        <div>
          <span className="eyebrow">ZUNOON IS FOR EVERYONE</span>
          <h2>{h('There is a place','અહીં સૌના માટે','यहाँ सबके लिए')}<br/><em>{h('for you here.','એક જગ્યા છે.','एक जगह है.')}</em></h2>
        </div>
        <p>{t('Zunoon is not limited to any single profession, business or age group. If you wish to connect, learn and enjoy new life experiences, you belong here.','ઝુનૂન કોઈ એક ઉંમર, વ્યવસાય કે ક્ષેત્ર પૂરતું સીમિત નથી. જીવનમાં કંઈક નવું શીખવાની, માણવાની અને આગળ વધવાની ઇચ્છા ધરાવતા દરેક માટે આ કમ્યુનિટી છે.','ज़ुनून किसी खास उम्र या पेशे तक सीमित नहीं है. नया सीखने, आनंद लेने और जीवन को गहराई से जीने की चाहत रखने वाले सभी का यहाँ स्वागत है.')}</p>
      </div>
      <div className="who-grid">
        {whoCanJoin.map((item,idx)=>(
          <div key={idx} className="who-card">
            <span className="who-num">0{idx+1}</span>
            <h3>{lang==='mix'?item.role[0]:w(item.role)}</h3>
            <p>{w(item.description)}</p>
          </div>
        ))}
      </div>
      <div className="who-banner">
        <p><strong>{h('Because life has no single definition.','જીવનની કોઈ એક વ્યાખ્યા નથી.','जीवन की कोई एक परिभाषा नहीं होती.')}</strong> {t('Everyone has the right to learn, enjoy, discover their passions and move forward in life.','દરેક વ્યક્તિને જીવનમાં કંઈક નવું શીખવાનો, માણવાનો અને પોતાની પસંદગીથી આગળ વધવાનો અધિકાર છે.','हर किसी को सीखने, आनंद लेने और जीवन के हर पहलू में आगे बढ़ने का अधिकार है.')}</p>
      </div>
    </section>
  );
}

export function Founder({lang}:{lang:Lang}){
  const {t,h}=copy(lang);
  return (
    <section className="founder-section wrap section" id="founder">
      <div className="founder-profile">
        <div>
          <span className="eyebrow">{h('THE VISION BEHIND ZUNOON','ઝુનૂન પાછળનો વિચાર','ज़ुनून के पीछे की सोच')}</span>
          <h2>Jainit Finaviya</h2>
          <p className="founder-role">{h('Founder · Zunoon Club','સ્થાપક · ઝુનૂન ક્લબ','संस्थापक · ज़ुनून क्लब')}</p>
        </div>
        <div className="founder-year">
          <span className="founder-year-num">2006</span>
          <span className="founder-year-label">{h('Year the journey began','યાત્રા શરૂ થયાનું વર્ષ','यात्रा की शुरुआत का वर्ष')}</span>
        </div>
        <div className="founder-badge-motto">
          <span>{h('One Community · Infinite Experiences','એક કમ્યુનિટી · અનંત અનુભવો','एक समुदाय · अनगिनत अनुभव')}</span>
        </div>
      </div>
      <div className="founder-story">
        <span className="eyebrow">{h('MEET OUR FOUNDER','અમારા સ્થાપક','हमारे संस्थापक')}</span>
        <h3>{h('Growth beyond achievement.','સફળતાથી આગળનો વિકાસ.','उपलब्धियों से आगे का विकास.')}</h3>
        <p>{t('Jainit Finaviya began the Zunoon journey in 2006 with a vision of a community where people can grow across different areas of life. His outlook brings health, relationships, knowledge, creativity, contribution and happiness into the same conversation.','વર્ષ 2006થી ઝુનૂનની યાત્રા શરૂ કરનાર જૈનિત ફિનાવિયાનો વિચાર એવી કમ્યુનિટી બનાવવાનો છે જ્યાં લોકો જીવનના વિવિધ ક્ષેત્રોમાં વિકસી શકે. તેમની દૃષ્ટિમાં હેલ્થ, સંબંધો, જ્ઞાન, સર્જનાત્મકતા, સમાજ સેવા અને ખુશીનો સમાવેશ થાય છે.','2006 में ज़ुनून की यात्रा शुरू करने वाले जैनित फिनाविया की दृष्टि ऐसा समुदाय बनाने की है जहाँ लोग जीवन के विभिन्न क्षेत्रों में विकसित हों. इसमें सेहत, रिश्ते, ज्ञान, रचनात्मकता, समाज सेवा और खुशी शामिल हैं.')}</p>
        <blockquote>
          <span className="eyebrow">{h('FOUNDER’S MESSAGE','સ્થાપકનો સંદેશ','संस्थापक का संदेश')}</span>
          <p>{t('“I believe true success in life cannot be measured only by money or professional achievement. A healthy body, peaceful mind, strong relationships, continuous learning and beautiful experiences are important parts of success too. Zunoon is my effort to bring all of these together in one community.”','“મારું માનવું છે કે જીવનની સાચી સફળતા માત્ર પૈસા કે Professional Achievementથી માપી શકાતી નથી. એક Healthy Body, Peaceful Mind, Strong Relationships, Continuous Learning અને Beautiful Experiences પણ જીવનની સફળતાના મહત્વપૂર્ણ ભાગ છે. Zunoon એ આ તમામ બાબતોને એક Communityમાં જોડવાનો મારો પ્રયાસ છે.”','“मेरा मानना है कि जीवन की सच्ची सफलता केवल पैसे या पेशेवर उपलब्धियों से नहीं मापी जा सकती. स्वस्थ शरीर, शांत मन, मजबूत रिश्ते, निरंतर सीखना और सुंदर अनुभव भी सफलता के महत्वपूर्ण हिस्से हैं. ज़ुनून इन सबको एक समुदाय में जोड़ने का मेरा प्रयास है.”')}</p>
          <cite>— Jainit Finaviya</cite>
        </blockquote>
        <p className="founder-note">{t('Connect, learn, grow and celebrate life together.','ચાલો, સાથે જોડાઈએ, સાથે શીખીએ, સાથે વિકાસ કરીએ અને જીવનની દરેક પળને ઉજવીએ.','आइए साथ जुड़ें, सीखें, बढ़ें और जीवन के हर पल का जश्न मनाएँ.')}</p>
      </div>
    </section>
  );
}

export function Testimonials({lang}:{lang:Lang}){
  const {t,h,w}=copy(lang);
  return (
    <section className="testimonials-section wrap section" id="testimonials">
      <div className="section-top">
        <div>
          <span className="eyebrow">04 / MEMBER EXPERIENCES</span>
          <h2>{h('Don’t just hear about it.','વાતોથી આગળ વધીને,','सिर्फ बातों में नहीं.')}<br/><em>{h('Experience Zunoon.','અનુભવ કરો ઝુનૂન.','अनुभव करें ज़ुनून.')}</em></h2>
        </div>
        <p>{t('Reflections from community members across health, sports, growth, hobbies and celebrations.','હેલ્થ, ગ્રોથ, સ્પોર્ટ્સ, હોબી અને સેલિબ્રેશન સાથે જોડાયેલા સભ્યોના વાસ્તવિક અનુભવો.','स्वास्थ्य, विकास, खेल, शौक और उत्सव से जुड़े सदस्यों के अनुभव.')}</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((item,idx)=>(
          <article key={idx} className="testimonial-card">
            <div className="card-top">
              <span className="testimonial-cat">{lang==='mix'?item.category[0]:w(item.category)}</span>
              <Quote size={20} className="quote-icon"/>
            </div>
            <blockquote>{w(item.quote)}</blockquote>
            <div className="testimonial-footer">
              <strong>{lang==='mix'?item.title[0]:w(item.title)}</strong>
              <span>{item.author}</span>
            </div>
          </article>
        ))}
      </div>
      <p className="testimonials-note">{t('* Experiences shared from members participating across Zunoon clubs. Member reviews and photos updated periodically with consent.','* ઝુનૂન ક્લબના વિવિધ પાસાઓ વિશે સભ્યોના અનુભવોની ઝલક. વાસ્તવિક મેમ્બર સમીક્ષા અને વિગતો સમયાંતરે અપડેટ કરવામાં આવે છે.','* विभिन्न क्लब गतिविधियों से जुड़े सदस्यों के वास्तविक अनुभवों का संकलन.')}</p>
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
          <h2>{h('Your next chapter,','તમારી નવી શરૂઆત,','आपकी नई शुरुआत,')}<br/><em>{h('one step at a time.','એક એક પગલે.','एक-एक कदम से.')}</em></h2>
        </div>
        <p>{t('Become an active part of a community built around shared interests.','સમાન રુચિઓ ધરાવતી કમ્યુનિટીનો સક્રિય ભાગ બનો.','साझा रुचियों वाले समुदाय का सक्रिय हिस्सा बनें.')}</p>
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

export function Questions({lang}:{lang:Lang}){
  const {h,w}=copy(lang);
  return (
    <section className="wrap section faq" id="faq">
      <div>
        <span className="eyebrow">GOOD TO KNOW</span>
        <h2>{h('A few questions,','થોડા પ્રશ્નો,','कुछ सवाल,')}<br/><em>{h('before you join.','જોડાતા પહેલાં.','जुड़ने से पहले.')}</em></h2>
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
            <p>{w(f.a)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
