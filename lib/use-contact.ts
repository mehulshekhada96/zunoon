'use client';
import {useEffect, useState} from 'react';
import {defaultContactSettings, type ContactSettings} from './contact';

export function useContact() {
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);

  useEffect(() => {
    let active = true;
    fetch('/api/contact/')
      .then(res => res.json())
      .then(data => {
        if (active && data && data.whatsappNumber) {
          setContact(data);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return contact;
}

