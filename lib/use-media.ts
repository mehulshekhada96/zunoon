'use client';
import {useEffect,useState} from 'react';
import {emptyMedia,PublicMedia} from './media';
export function useMedia(){const [media,setMedia]=useState<PublicMedia>(emptyMedia);useEffect(()=>{let active=true;fetch('/api/media',{cache:'no-store'}).then(r=>r.ok?r.json() as Promise<PublicMedia>:null).then(data=>{if(active&&data&&data.values&&Array.isArray(data.gallery))setMedia(data)}).catch(()=>{});return()=>{active=false}},[]);return media;}
