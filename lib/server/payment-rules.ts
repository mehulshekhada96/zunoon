import {createHmac,timingSafeEqual} from 'node:crypto';
export function validSignature(message:string,signature:unknown,secret:string){if(!secret||typeof signature!=='string'||! /^[a-f0-9]{64}$/i.test(signature))return false;return timingSafeEqual(Buffer.from(createHmac('sha256',secret).update(message).digest('hex'),'hex'),Buffer.from(signature,'hex'));}
export type GatewayPayment={id:string;order_id:string;amount:number;currency:string;status:string;method?:string;error_description?:string;created_at?:number;amount_refunded?:number};
export function paymentOutcome(orderId:string,amount:number,payments:GatewayPayment[]){
 const matching=payments.filter(p=>p.order_id===orderId&&p.amount===amount&&p.currency==='INR');
 const captured=matching.find(p=>p.status==='captured');if(captured)return {status:'SUCCESS' as const,payment:captured};
 if(matching.some(p=>['authorized','created'].includes(p.status)))return {status:'PENDING' as const};
 const failed=matching.filter(p=>p.status==='failed').sort((a,b)=>(b.created_at||0)-(a.created_at||0))[0];
 return failed?{status:'FAILED' as const,payment:failed}:{status:'PENDING' as const};
}
export function dateRange(from:string|null,to:string|null){
 const parse=(v:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||new Date(v+'T00:00:00Z').toISOString().slice(0,10)!==v)throw Error('Invalid date');return new Date(v+'T00:00:00+05:30')};
 const start=from?parse(from):null,end=to?new Date(parse(to).getTime()+86400000):null;
 if(start&&end&&start>=end)throw Error('Start date must not be after end date');
 return {...(start?{$gte:start.toISOString()}:{}),...(end?{$lt:end.toISOString()}:{})};
}
