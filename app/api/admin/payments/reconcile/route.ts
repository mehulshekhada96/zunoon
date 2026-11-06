import {protect} from '@/lib/server/media';import {recordFor,reconcile,paymentError} from '@/lib/server/payments';
export async function POST(request:Request){try{await protect(request);const b=await request.json();return Response.json(await reconcile(await recordFor(b.reference)))}catch(e){return paymentError(e)}}
