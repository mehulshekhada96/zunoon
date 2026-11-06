export type ContactSettings = {
  whatsappNumber: string;
  displayPhone: string;
  telNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  addressEn: string;
  addressGu: string;
  addressHi: string;
  updatedAt?: string;
};

export const defaultContactSettings: ContactSettings = {
  whatsappNumber: '919712112110',
  displayPhone: '97 121 121 10',
  telNumber: '+919712112110',
  instagramHandle: '@zunoon_club',
  instagramUrl: 'https://www.instagram.com/zunoon_club/',
  addressEn: 'Surat, Gujarat, India',
  addressGu: 'સુરત, ગુજરાત, ભારત',
  addressHi: 'सूरत, गुजरात, भारत'
};
