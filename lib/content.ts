export type Lang = 'mix'|'en'|'gu'|'hi';
export type Words = [string,string,string];
export const text = (words:Words,lang:Lang) => words[lang==='en'?0:lang==='hi'?2:1];

export interface ClubItem {
  name: string;
  emoji: string;
  local: Words;
  tag: Words;
  description: Words;
  activitiesHeading: string;
  motto: string;
  callToAction: string;
  categories: Words[];
  examples: Words[];
  color: string;
  icon: string;
}

export const clubs: ClubItem[] = [
  {
    name: 'Health',
    emoji: '🌿',
    local: ['Health Club','હેલ્થ ક્લબ','हेल्थ क्लब'],
    tag: [
      'Healthy Body • Healthy Mind • Healthy Lifestyle',
      'Healthy Body • Healthy Mind • Healthy Lifestyle',
      'Healthy Body • Healthy Mind • Healthy Lifestyle'
    ],
    description: [
      'Your greatest wealth is your Health. Zunoon Health Club strives to create a Healthy Lifestyle by connecting Health, Fitness, Nutrition and Mindfulness in daily life. 💪🧘‍♂️',
      'તમારી સૌથી મોટી સંપત્તિ તમારી Health છે.\nZunoon Health Club દ્વારા રોજિંદા જીવનમાં Health, Fitness, Nutrition અને Mindfulnessને જોડીને એક Healthy Lifestyle બનાવવાનો પ્રયાસ કરવામાં આવે છે. 💪🧘‍♂️',
      'आपकी सबसे बड़ी संपत्ति आपकी Health है. Zunoon Health Club द्वारा रोज़मर्रा की ज़िंदगी में Health, Fitness, Nutrition और Mindfulness को जोड़कर एक Healthy Lifestyle बनाने का प्रयास किया जाता है. 💪🧘‍♂️'
    ],
    activitiesHeading: '🏃‍♂️ અમારી 5 Main Activities:',
    motto: '✨ Zunoon Health Club – Move More. Live Better. Stay Healthy.',
    callToAction: '👉 Join • Participate • Improve Your Lifestyle',
    categories: [
      ['⏰ MORNING CLUB','⏰ MORNING CLUB','⏰ MORNING CLUB'],
      ['🏋️ FITNESS CLUB','🏋️ FITNESS CLUB','🏋️ FITNESS CLUB'],
      ['🥗 NUTRITION CLUB','🥗 NUTRITION CLUB','🥗 NUTRITION CLUB'],
      ['🌱 WELLNESS CLUB','🌱 WELLNESS CLUB','🌱 WELLNESS CLUB'],
      ['🧘 MINDFULNESS CLUB','🧘 MINDFULNESS CLUB','🧘 MINDFULNESS CLUB']
    ],
    examples: [
      ['Morning Walking, Fast Walking, Warm-up & Body Movement, Stretching & Yoga, Pranayam & Meditation','Morning Walking, Fast Walking, Warm-up & Body Movement, Stretching & Yoga, Pranayam & Meditation','Morning Walking, Fast Walking, Warm-up & Body Movement, Stretching & Yoga, Pranayam & Meditation'],
      ['Group Workout, Aerobics, Functional Exercise, Fitness Challenges, Outdoor Workout','Group Workout, Aerobics, Functional Exercise, Fitness Challenges, Outdoor Workout','Group Workout, Aerobics, Functional Exercise, Fitness Challenges, Outdoor Workout'],
      ['Healthy Diet Awareness, Nutrition Sessions, Healthy Food Activities, Diet Planning, Healthy Cooking Activities','Healthy Diet Awareness, Nutrition Sessions, Healthy Food Activities, Diet Planning, Healthy Cooking Activities','Healthy Diet Awareness, Nutrition Sessions, Healthy Food Activities, Diet Planning, Healthy Cooking Activities'],
      ['Healthy Lifestyle, Sleep Awareness, Health Check-up Activities, Stress Management, Wellness Workshops','Healthy Lifestyle, Sleep Awareness, Health Check-up Activities, Stress Management, Wellness Workshops','Healthy Lifestyle, Sleep Awareness, Health Check-up Activities, Stress Management, Wellness Workshops'],
      ['Meditation, Breathing Exercises, Gratitude Practice, Visualization, Mind Relaxation','Meditation, Breathing Exercises, Gratitude Practice, Visualization, Mind Relaxation','Meditation, Breathing Exercises, Gratitude Practice, Visualization, Mind Relaxation']
    ],
    color: '#e7eddf',
    icon: 'health'
  },
  {
    name: 'Sports',
    emoji: '🏆',
    local: ['Sports Club','સ્પોર્ટ્સ ક્લબ','स्पोर्ट्स क्लब'],
    tag: [
      'Play Together • Compete Together • Grow Together',
      'Play Together • Compete Together • Grow Together',
      'Play Together • Compete Together • Grow Together'
    ],
    description: [
      'Sports is not just a game… it is an experience of Fitness, Teamwork, Discipline and Energy. ⚡',
      'Sports માત્ર રમત નથી… તે Fitness, Teamwork, Discipline અને Energyનો અનુભવ છે. ⚡',
      'Sports सिर्फ़ खेल नहीं है… यह Fitness, Teamwork, Discipline और Energy का अनुभव है. ⚡'
    ],
    activitiesHeading: '🎯 અમારી 5 Main Activities:',
    motto: '🔥 Zunoon Sports Club – Play. Challenge. Enjoy.',
    callToAction: '👉 Get Ready to Play & Participate',
    categories: [
      ['🏏 CRICKET','🏏 CRICKET','🏏 CRICKET'],
      ['♟️ INDOOR GAMES','♟️ INDOOR GAMES','♟️ INDOOR GAMES'],
      ['⚽ OUTDOOR GAMES','⚽ OUTDOOR GAMES','⚽ OUTDOOR GAMES'],
      ['🥇 SPORTS DAY','🥇 SPORTS DAY','🥇 SPORTS DAY'],
      ['⛰️ ADVENTURE','⛰️ ADVENTURE','⛰️ ADVENTURE']
    ],
    examples: [
      ['Friendly Cricket Matches, Box Cricket, Cricket Tournaments, Team Challenges, Cricket Events','Friendly Cricket Matches, Box Cricket, Cricket Tournaments, Team Challenges, Cricket Events','Friendly Cricket Matches, Box Cricket, Cricket Tournaments, Team Challenges, Cricket Events'],
      ['Chess, Carrom, Table Tennis, Foosball, Board Games','Chess, Carrom, Table Tennis, Foosball, Board Games','Chess, Carrom, Table Tennis, Foosball, Board Games'],
      ['Football, Volleyball, Badminton, Kabaddi, Tug of War','Football, Volleyball, Badminton, Kabaddi, Tug of War','Football, Volleyball, Badminton, Kabaddi, Tug of War'],
      ['Team Competitions, Individual Games, Family Sports, Fun Sports, Awards & Recognition','Team Competitions, Individual Games, Family Sports, Fun Sports, Awards & Recognition','Team Competitions, Individual Games, Family Sports, Fun Sports, Awards & Recognition'],
      ['Trekking, Cycling, Hiking, Camping, Adventure Challenges','Trekking, Cycling, Hiking, Camping, Adventure Challenges','Trekking, Cycling, Hiking, Camping, Adventure Challenges']
    ],
    color: '#f2e6d6',
    icon: 'sports'
  },
  {
    name: 'Social',
    emoji: '🤝',
    local: ['Social Club','સોશિયલ ક્લબ','सोशल क्लब'],
    tag: [
      'Help • Serve • Support • Care',
      'Help • Serve • Support • Care',
      'Help • Serve • Support • Care'
    ],
    description: [
      'If you want to do something for society, you don’t need a big reason… only the spirit to help is needed. ❤️',
      'સમાજ માટે કંઈક કરવું હોય તો મોટું કારણ જરૂરી નથી… માત્ર મદદ કરવાની ભાવના જરૂરી છે. ❤️',
      'समाज के लिए कुछ करना हो तो बड़ा कारण ज़रूरी नहीं… सिर्फ़ मदद करने की भावना ज़रूरी है. ❤️'
    ],
    activitiesHeading: '🌍 અમારી 5 Main Activities:',
    motto: '✨ Zunoon Social Club – Be The Reason Someone Smiles.',
    callToAction: '👉 Join the Community. Create an Impact.',
    categories: [
      ['🎁 DONATION','🎁 DONATION','🎁 DONATION'],
      ['🙋 VOLUNTEERS','🙋 VOLUNTEERS','🙋 VOLUNTEERS'],
      ['🌳 NATURE CARE','🌳 NATURE CARE','🌳 NATURE CARE'],
      ['❤️ HELPING','❤️ HELPING','❤️ HELPING'],
      ['🫶 SUPPORT','🫶 SUPPORT','🫶 SUPPORT']
    ],
    examples: [
      ['Food Donation, Clothes Donation, Educational Material, Blood Donation Camps, Emergency Support','Food Donation, Clothes Donation, Educational Material, Blood Donation Camps, Emergency Support','Food Donation, Clothes Donation, Educational Material, Blood Donation Camps, Emergency Support'],
      ['Volunteer Drives, Community Service, Social Awareness Campaigns, Community Projects, Volunteer Activities','Volunteer Drives, Community Service, Social Awareness Campaigns, Community Projects, Volunteer Activities','Volunteer Drives, Community Service, Social Awareness Campaigns, Community Projects, Volunteer Activities'],
      ['Tree Plantation, Cleanliness Drives, Water Conservation, Plastic-Free Activities, Nature Awareness','Tree Plantation, Cleanliness Drives, Water Conservation, Plastic-Free Activities, Nature Awareness','Tree Plantation, Cleanliness Drives, Water Conservation, Plastic-Free Activities, Nature Awareness'],
      ['Needy Family Support, Student Support, Senior Citizen Support, Emergency Assistance, Community Help','Needy Family Support, Student Support, Senior Citizen Support, Emergency Assistance, Community Help','Needy Family Support, Student Support, Senior Citizen Support, Emergency Assistance, Community Help'],
      ['Social Support Network, Education Support, Medical Support Initiatives, Women & Child Support, Member-to-Member Support','Social Support Network, Education Support, Medical Support Initiatives, Women & Child Support, Member-to-Member Support','Social Support Network, Education Support, Medical Support Initiatives, Women & Child Support, Member-to-Member Support']
    ],
    color: '#e5ece7',
    icon: 'social'
  },
  {
    name: 'Growth',
    emoji: '🚀',
    local: ['Growth Club','ગ્રોથ ક્લબ','ग्रोथ क्लब'],
    tag: [
      'Learn • Develop • Mentor • Grow',
      'Learn • Develop • Mentor • Grow',
      'Learn • Develop • Mentor • Grow'
    ],
    description: [
      'Growth is not a one-day process… it is a journey of Learning, Skills, Guidance and Consistent Development. 📚',
      'Growth કોઈ એક દિવસની process નથી… તે Learning, Skills, Guidance અને Consistent Developmentની journey છે. 📚',
      'Growth किसी एक दिन की process नहीं है… यह Learning, Skills, Guidance और Consistent Development की journey है. 📚'
    ],
    activitiesHeading: '🎯 અમારી 5 Main Activities:',
    motto: '🔥 Zunoon Growth Club – Learn Today. Grow Every Day.',
    callToAction: '👉 Invest in Yourself. Build Your Future.',
    categories: [
      ['💼 BUSINESS SEMINARS','💼 BUSINESS SEMINARS','💼 BUSINESS SEMINARS'],
      ['👨‍👩‍👧 CHILD DEVELOPMENT','👨‍👩‍👧 CHILD DEVELOPMENT','👨‍👩‍👧 CHILD DEVELOPMENT'],
      ['🧑‍🏫 MENTORING','🧑‍🏫 MENTORING','🧑‍🏫 MENTORING'],
      ['🎓 SKILL SEMINARS','🎓 SKILL SEMINARS','🎓 SKILL SEMINARS'],
      ['🌱 PERSONAL GROWTH','🌱 PERSONAL GROWTH','🌱 PERSONAL GROWTH']
    ],
    examples: [
      ['Business Strategy, Marketing, Sales, Finance, Leadership, Entrepreneurship','Business Strategy, Marketing, Sales, Finance, Leadership, Entrepreneurship','Business Strategy, Marketing, Sales, Finance, Leadership, Entrepreneurship'],
      ['Parenting Sessions, Child Communication, Education Awareness, Career Guidance, Personality Development','Parenting Sessions, Child Communication, Education Awareness, Career Guidance, Personality Development','Parenting Sessions, Child Communication, Education Awareness, Career Guidance, Personality Development'],
      ['Business Mentoring, Career Mentoring, Leadership Mentoring, One-to-One Guidance, Expert Mentorship','Business Mentoring, Career Mentoring, Leadership Mentoring, One-to-One Guidance, Expert Mentorship','Business Mentoring, Career Mentoring, Leadership Mentoring, One-to-One Guidance, Expert Mentorship'],
      ['Communication Skills, Public Speaking, Digital Skills, Leadership Skills, Financial Literacy, Technology & AI Skills','Communication Skills, Public Speaking, Digital Skills, Leadership Skills, Financial Literacy, Technology & AI Skills','Communication Skills, Public Speaking, Digital Skills, Leadership Skills, Financial Literacy, Technology & AI Skills'],
      ['Goal Setting, Time Management, Confidence Building, Emotional Intelligence, Habit Building, Leadership Development','Goal Setting, Time Management, Confidence Building, Emotional Intelligence, Habit Building, Leadership Development','Goal Setting, Time Management, Confidence Building, Emotional Intelligence, Habit Building, Leadership Development']
    ],
    color: '#e7e5ef',
    icon: 'growth'
  },
  {
    name: 'Hobby',
    emoji: '🎨',
    local: ['Hobby Club','હોબી ક્લબ','हॉबी क्लब'],
    tag: [
      'Discover Your Passion • Express Yourself • Have Fun',
      'Discover Your Passion • Express Yourself • Have Fun',
      'Discover Your Passion • Express Yourself • Have Fun'
    ],
    description: [
      'Everyone has some hidden Talent, Passion or Hobby inside them.\nZunoon Hobby Club is the space to Discover, Develop and Enjoy it. ✨',
      'દરેક વ્યક્તિમાં કોઈને કોઈ Talent, Passion અથવા Hobby છુપાયેલી હોય છે.\nZunoon Hobby Club તેને Discover, Develop અને Enjoy કરવાની જગ્યા છે. ✨',
      'हर व्यक्ति में कोई न कोई Talent, Passion या Hobby छिपी होती है.\nZunoon Hobby Club उसे Discover, Develop और Enjoy करने की जगह है. ✨'
    ],
    activitiesHeading: '🎯 અમારી 5 Main Activities:',
    motto: '🌟 Zunoon Hobby Club – Your Time. Your Passion. Your Creativity.',
    callToAction: '👉 Discover • Create • Enjoy',
    categories: [
      ['🎉 FUN ACTIVITIES','🎉 FUN ACTIVITIES','🎉 FUN ACTIVITIES'],
      ['🧠 SKILL ACTIVITIES','🧠 SKILL ACTIVITIES','🧠 SKILL ACTIVITIES'],
      ['❤️ PASSION ACTIVITIES','❤️ PASSION ACTIVITIES','❤️ PASSION ACTIVITIES'],
      ['🎬 ENTERTAINMENT','🎬 ENTERTAINMENT','🎬 ENTERTAINMENT'],
      ['✂️ CRAFTING','✂️ CRAFTING','✂️ CRAFTING']
    ],
    examples: [
      ['Team Games, Funny Challenges, Movie Day, Fun Competitions, Ice-Breaker Activities','Team Games, Funny Challenges, Movie Day, Fun Competitions, Ice-Breaker Activities','Team Games, Funny Challenges, Movie Day, Fun Competitions, Ice-Breaker Activities'],
      ['Photography, Cooking, Public Speaking, Art Skills, Music Skills, Digital Skills','Photography, Cooking, Public Speaking, Art Skills, Music Skills, Digital Skills','Photography, Cooking, Public Speaking, Art Skills, Music Skills, Digital Skills'],
      ['Singing, Dancing, Writing, Reading, Acting, Gardening','Singing, Dancing, Writing, Reading, Acting, Gardening','Singing, Dancing, Writing, Reading, Acting, Gardening'],
      ['Music Sessions, Karaoke, Game Nights, Talent Shows, Fun Sessions','Music Sessions, Karaoke, Game Nights, Talent Shows, Fun Sessions','Music Sessions, Karaoke, Game Nights, Talent Shows, Fun Sessions'],
      ['Painting, Drawing, DIY Activities, Handmade Products, Creative Workshops','Painting, Drawing, DIY Activities, Handmade Products, Creative Workshops','Painting, Drawing, DIY Activities, Handmade Products, Creative Workshops']
    ],
    color: '#f4e3dc',
    icon: 'hobby'
  },
  {
    name: 'Celebration',
    emoji: '🎊',
    local: ['Celebration Club','સેલિબ્રેશન ક્લબ','सेलिब्रेशन क्लब'],
    tag: [
      'Celebrate Life • Celebrate People • Celebrate Moments',
      'Celebrate Life • Celebrate People • Celebrate Moments',
      'Celebrate Life • Celebrate People • Celebrate Moments'
    ],
    description: [
      'Every day in life is special… and some moments deserve to be celebrated together. ❤️✨',
      'જીવનમાં દરેક દિવસ ખાસ છે… અને કેટલીક ક્ષણો એવી હોય છે જેને સાથે મળીને Celebrate કરવી જોઈએ. ❤️✨',
      'जिंदगी में हर दिन खास है… और कुछ पल ऐसे होते हैं जिन्हें साथ मिलकर Celebrate करना चाहिए. ❤️✨'
    ],
    activitiesHeading: '🎯 અમારી 5 Main Activities:',
    motto: '✨ Zunoon Celebration Club – Create Memories. Share Happiness. Celebrate Together.',
    callToAction: '👉 Because Every Moment Deserves to be Celebrated',
    categories: [
      ['🎉 FESTIVAL CELEBRATION','🎉 FESTIVAL CELEBRATION','🎉 FESTIVAL CELEBRATION'],
      ['🏆 ACHIEVEMENT CELEBRATION','🏆 ACHIEVEMENT CELEBRATION','🏆 ACHIEVEMENT CELEBRATION'],
      ['🌟 LIFE CELEBRATION','🌟 LIFE CELEBRATION','🌟 LIFE CELEBRATION'],
      ['🎂 BIRTHDAY CELEBRATION','🎂 BIRTHDAY CELEBRATION','🎂 BIRTHDAY CELEBRATION'],
      ['🥳 PERSONAL CELEBRATION','🥳 PERSONAL CELEBRATION','🥳 PERSONAL CELEBRATION']
    ],
    examples: [
      ['Diwali, Navratri, Holi, Uttarayan, Janmashtami, Cultural Festivals','Diwali, Navratri, Holi, Uttarayan, Janmashtami, Cultural Festivals','Diwali, Navratri, Holi, Uttarayan, Janmashtami, Cultural Festivals'],
      ['Business Achievement, Professional Achievement, Personal Achievement, Awards & Recognition, Member Success Stories','Business Achievement, Professional Achievement, Personal Achievement, Awards & Recognition, Member Success Stories','Business Achievement, Professional Achievement, Personal Achievement, Awards & Recognition, Member Success Stories'],
      ['New Beginning, New Business, New Home, Marriage, Family Milestones, Special Life Moments','New Beginning, New Business, New Home, Marriage, Family Milestones, Special Life Moments','New Beginning, New Business, New Home, Marriage, Family Milestones, Special Life Moments'],
      ['Member Birthday, Family Birthday, Birthday Surprise, Group Birthday Celebration, Birthday Recognition','Member Birthday, Family Birthday, Birthday Surprise, Group Birthday Celebration, Birthday Recognition','Member Birthday, Family Birthday, Birthday Surprise, Group Birthday Celebration, Birthday Recognition'],
      ['Personal Milestones, Anniversary, Success Celebration, Special Memories, Member Appreciation','Personal Milestones, Anniversary, Success Celebration, Special Memories, Member Appreciation','Personal Milestones, Anniversary, Success Celebration, Special Memories, Member Appreciation']
    ],
    color: '#f2e4df',
    icon: 'celebration'
  }
];
export const photos=[
 {src:'celebration-bhajan',category:'Celebration',label:['Live Bhajan, tabla & musical celebration','ભજન, સંગીત અને ઉત્સવની ઉજવણી','भजन, संगीत और उत्सव का आनंद'] as Words},
 {src:'clothes-collection',category:'Donation',label:['Community clothes donation collection','વસ્ત્ર દાન સંગ્રહ અને સેવા','वस्त्र दान संग्रह और सेवा'] as Words},
 {src:'volunteering',category:'Volunteering',label:['Preparing clothes for distribution','વિતરણ માટે કપડાંની તૈયારી','वितरण के लिए कपड़ों की तैयारी'] as Words},
 {src:'community-night',category:'Donation',label:['Night community distribution drive','રાત્રિ વિતરણ અને સેવા અભિયાન','रात्रि वितरण और सेवा अभियान'] as Words},
 {src:'donation',category:'Donation',label:['Sharing clothes, sharing care','કપડાં સાથે લાગણીનું દાન','कपड़ों के साथ अपनापन बाँटना'] as Words},
 {src:'community-support',category:'Donation',label:['Small acts of care, shared together','સાથે મળીને સેવાના નાના પ્રયાસો','मिलकर सेवा के छोटे प्रयास'] as Words},
 {src:'music',category:'Music',label:['A shared love for music','સંગીત સાથેની યાદગાર પળો','संगीत के साथ यादगार पल'] as Words},
 {src:'outdoors',category:'Outdoors',label:['Good company. Open skies.','મિત્રો સાથે પ્રકૃતિની નજીક','दोस्तों के साथ प्रकृति के करीब'] as Words},
 {src:'celebration-clear',category:'Celebration',label:['Together is a celebration','સાથે મળીને ઉજવણી','साथ मिलकर उत्सव'] as Words},
 {src:'singing',category:'Music',label:['A voice. A passion. A community.','ટેલેન્ટને મળે એક મંચ','हुनर को मिले एक मंच'] as Words},
 {src:'group-joy',category:'Community',label:['The joy of making music together','સાથે સંગીત માણવાનો આનંદ','साथ संगीत का आनंद'] as Words},
 {src:'tabla',category:'Music',label:['Rhythm, passion and participation','તાલ, શોખ અને ભાગીદારી','ताल, शौक और भागीदारी'] as Words},
];
