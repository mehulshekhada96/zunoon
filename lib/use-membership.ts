'use client';
import {useEffect,useState} from 'react';import {defaultMembership} from './payments';
export function useMembershipFee(){const [fee,setFee]=useState(defaultMembership.feePaise);useEffect(()=>{fetch('/api/payments/config/',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{if(d&&Number.isSafeInteger(d.feePaise))setFee(d.feePaise)}).catch(()=>{})},[]);return fee;}
