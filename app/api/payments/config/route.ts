import {membership,ready,mode,paymentError} from '@/lib/server/payments';
export const dynamic='force-dynamic';
export async function GET(){try{const c=await membership();return Response.json({feePaise:c.feePaise,enabled:c.enabled,configured:ready(),mode:mode()},{headers:{'Cache-Control':'no-store'}})}catch(e){return paymentError(e)}}
