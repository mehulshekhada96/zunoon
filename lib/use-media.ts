'use client';
import {useEffect,useState} from 'react';
import {emptyMedia,PublicMedia} from './media';

export function useMedia(){
  const [media,setMedia]=useState<PublicMedia>(emptyMedia);
  useEffect(()=>{
    let active=true;
    fetch('/api/media/',{cache:'no-store'})
      .then(r=>r.ok?r.json() as Promise<PublicMedia>:null)
      .then(data=>{
        if(active&&data&&data.values&&Array.isArray(data.gallery)){
          setMedia(prev => ({
            values: {...prev.values, ...(data.values || {})},
            why: {...prev.why, ...(data.why || {})},
            clubs: {...prev.clubs, ...(data.clubs || {})},
            community: {...prev.community, ...(data.community || {})},
            founder: data.founder || prev.founder,
            gallerySections: data.gallerySections || prev.gallerySections,
            gallery: data.gallery
          }));
        }
      })
      .catch(()=>{});
    return()=>{active=false};
  },[]);
  return media;
}
