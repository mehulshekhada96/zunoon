export const valueSlots = ['connect','experience','learn','grow','contribute','celebrate'] as const;
export const whySlots = ['health','social','sports','hobby','growth','celebration'] as const;
export const clubSlots = ['health','sports','social','growth','hobby','celebration'] as const;
export const communitySlots = ['students','business','entrepreneurs','professionals','homemakers','parents','youth','retired'] as const;
export const mediaSections = ['values','why','founder','clubs','community','gallery','general'] as const;
export type MediaSection = typeof mediaSections[number];
export type ValueSlot = typeof valueSlots[number];
export type WhySlot = typeof whySlots[number];
export type ClubSlot = typeof clubSlots[number];
export type CommunitySlot = typeof communitySlots[number];
export type MediaAsset = {id:string;section:string;category?:string;title:string;alt:string;url:string;publicId:string;bytes:number;createdAt:string};
export type PublicMedia = {
  values: Record<string,{url:string;alt:string}>;
  why: Record<string,{url:string;alt:string}>;
  clubs: Record<string,{url:string;alt:string}>;
  community: Record<string,{url:string;alt:string}>;
  founder?: {url:string;alt:string};
  gallerySections?: string[];
  gallery: MediaAsset[];
};

export const defaultValuesMedia: Record<string, {url: string; alt: string}> = {
  connect: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793875203/zunoon/values/4f76405e-2acc-4edf-b085-7509e2de2af7.webp',
    alt: 'Image representing connect'
  },
  experience: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793871723/zunoon/values/5e1c2b4c-8e54-470f-ade4-f1cf59e2fd58.webp',
    alt: 'AI-generated scene representing experience'
  },
  learn: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793871726/zunoon/values/9dc94a98-5012-4f4b-a790-f1319eed0404.webp',
    alt: 'AI-generated scene representing learn'
  },
  grow: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793871729/zunoon/values/fbe62b41-a57f-44aa-9156-e925f2a79dae.webp',
    alt: 'AI-generated scene representing grow'
  },
  contribute: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793871731/zunoon/values/3a15dd5d-02ef-4433-9af1-d1a9570a42ac.webp',
    alt: 'AI-generated scene representing contribute'
  },
  celebrate: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793871733/zunoon/values/9ad58df7-cf34-4dce-afea-081d284937de.webp',
    alt: 'AI-generated scene representing celebrate'
  }
};

export const defaultWhyMedia: Record<string, {url: string; alt: string}> = {
  health: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793880187/zunoon/why/77b9f539-5246-4734-b9af-a1cdd90556a6.jpg',
    alt: 'Health & Fitness'
  },
  social: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793880188/zunoon/why/be28a756-c194-41c3-aef3-f070b7ea05d5.jpg',
    alt: 'Social Connection'
  },
  sports: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793880189/zunoon/why/a699b95e-5c97-477f-b045-24b786cc322f.jpg',
    alt: 'Sports & Fun'
  },
  hobby: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793880191/zunoon/why/2dd8c405-1ab8-49f1-b0be-fd613c001817.jpg',
    alt: 'Hobbies & Passion'
  },
  growth: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793880191/zunoon/why/d20a578b-49e3-431b-b031-fbc2d17889e7.jpg',
    alt: 'Personal & Professional Growth'
  },
  celebration: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793880192/zunoon/why/639d1b65-d905-48a8-8341-3913660bb729.jpg',
    alt: 'Celebration & Happiness'
  }
};

export const defaultClubsMedia: Record<string, {url: string; alt: string}> = {
  health: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793886113/zunoon/clubs/96ef4338-f665-4960-a009-0ed6aa14695b.jpg',
    alt: 'Zunoon Health Club — Morning Walking, Yoga & Fitness'
  },
  sports: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793886114/zunoon/clubs/fc2a3056-e929-42a8-976b-2b49bfff75d6.jpg',
    alt: 'Zunoon Sports Club — Cricket, Indoor & Outdoor Games'
  },
  social: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793886115/zunoon/clubs/a5d634ec-6385-4b11-8e4f-88d58dff6a99.jpg',
    alt: 'Zunoon Social Club — Donation, Care & Helping'
  },
  growth: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793886116/zunoon/clubs/3df65236-0aae-4775-9b63-ef273d70bba5.jpg',
    alt: 'Zunoon Growth Club — Seminars, Mentoring & Personal Growth'
  },
  hobby: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793886117/zunoon/clubs/cff30e20-0a79-4262-b110-14480996cb37.jpg',
    alt: 'Zunoon Hobby Club — Art, Music, Cooking & Crafting'
  },
  celebration: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793886119/zunoon/clubs/76dbed78-9704-4406-b870-8bc0148c9694.jpg',
    alt: 'Zunoon Celebration Club — Life & Festival Celebrations'
  }
};

export const defaultCommunityMedia: Record<string, {url: string; alt: string}> = {
  students: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793893467/zunoon/community/19db56dd-6f36-44ec-8d10-a54627adc470.jpg',
    alt: 'Indian university students studying and discussing together on campus lawns'
  },
  business: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793893468/zunoon/community/96b05f9d-91c8-4ed0-ac10-67b482b0a39d.jpg',
    alt: 'Approachable Indian merchant and business owner in contemporary showroom'
  },
  entrepreneurs: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793893469/zunoon/community/c2bf65ee-7049-4f93-a013-96498451c1c8.jpg',
    alt: 'Young Indian startup founders and entrepreneurs collaborating in modern workspace'
  },
  professionals: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793893470/zunoon/community/f48d2bdd-6cfc-4bad-bc82-0f94416d7a4e.jpg',
    alt: 'Indian working professional enjoying a relaxed coffee break and networking outdoors'
  },
  homemakers: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793893471/zunoon/community/d5a5f0d6-2c38-4824-a684-c2e32f45d119.jpg',
    alt: 'Empowered Indian homemaker smiling with pride in a warm, artisanal kitchen'
  },
  parents: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793893472/zunoon/community/1dbf2c2a-f735-48e3-8384-3e4e39545446.jpg',
    alt: 'Joyful Indian parents and children laughing and playing board games together in a park'
  },
  youth: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793893473/zunoon/community/e6e9d7e8-fdfb-4ed6-8822-b3df57c45290.jpg',
    alt: 'Energetic group of young Indian friends celebrating together on a scenic mountain hike'
  },
  retired: {
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793893474/zunoon/community/80476a55-4ad9-4d94-8496-c419038cd7e4.jpg',
    alt: 'Active Indian seniors and retired individuals enjoying morning walk and yoga in lush park'
  }
};

export const defaultFounderMedia: {url: string; alt: string} = {
  url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1793883354/zunoon/founder/e38338ed-4655-44aa-84ee-79c07e3fd1dc.jpg',
  alt: 'Jainit Finaviya — Founder, Zunoon Club'
};

export const defaultGallerySections = ['Donation', 'Volunteering', 'Music', 'Outdoors', 'Celebration', 'Community'];

export const emptyMedia: PublicMedia = {
  values: defaultValuesMedia,
  why: defaultWhyMedia,
  clubs: defaultClubsMedia,
  community: defaultCommunityMedia,
  founder: defaultFounderMedia,
  gallerySections: defaultGallerySections,
  gallery: []
};

export function isAssignmentSlot(value:unknown):value is string {
  return typeof value==='string' && (
    valueSlots.some(s=>value===`values.${s}`) ||
    whySlots.some(s=>value===`why.${s}`) ||
    clubSlots.some(s=>value===`clubs.${s}`) ||
    communitySlots.some(s=>value===`community.${s}`) ||
    value === 'founder.profile' ||
    value === 'founder' ||
    /^gallery\.[a-f0-9-]{36}$/.test(value)
  );
}

export function isImageBytes(bytes:Uint8Array){
 return (bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)||
 (bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47)||
 (String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP');
}
