export interface MemberReview {
  id: string;
  author: string;
  role?: string;
  category: string;
  title?: string;
  quote: string;
  rating?: number;
  avatarUrl?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export const defaultMemberReviews: MemberReview[] = [
  {
    id: 'rev-1',
    author: 'Kavita Patel',
    role: 'Homemaker & Volunteer',
    category: 'Human Connection',
    title: 'A Community Beyond Routine',
    quote: 'Zunoon gave me a space where I could connect with positive, inspiring people across different walks of life. It genuinely feels like a second family.',
    rating: 5,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rev-2',
    author: 'Dhaval Shah',
    role: 'Fitness Enthusiast & CA',
    category: 'Health & Fitness',
    title: 'Active Routine & Motivation',
    quote: 'Through Health Club activities, I found regular motivation for physical fitness, morning routines and a healthier lifestyle.',
    rating: 5,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rev-3',
    author: 'Pooja Vora',
    role: 'Software Engineer',
    category: 'Personal Growth',
    title: 'Learning & Seminars',
    quote: 'The learning sessions and seminars in Growth Club helped me develop useful new skills, confidence and fresh perspectives.',
    rating: 5,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rev-4',
    author: 'Nirav Desai',
    role: 'Business Owner',
    category: 'Sports & Fun',
    title: 'Teamwork & Entertainment',
    quote: 'Playing sports and outdoor games with enthusiastic members brought back the joy of teamwork, fitness and fun.',
    rating: 5,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rev-5',
    author: 'Meera Trivedi',
    role: 'Graphic Designer',
    category: 'Hobbies & Creativity',
    title: 'Platform for Passion',
    quote: 'Hobby Club gave me a welcoming, creative space to express my passions and explore talents I had put on pause.',
    rating: 5,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

