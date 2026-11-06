import {recordFor,reconcile,publicRecord,paymentError} from '@/lib/server/payments';
import {validSignature} from '@/lib/server/payment-rules';
import {sameOrigin} from '@/lib/server/request-origin';
import {HttpError} from '@/lib/server/media';
export async function POST(request:Request){try{if(!sameOrigin(request))throw new HttpError(403,'Invalid origin.');const b=await request.json(),r=await recordFor(b.reference);if(b.razorpay_order_id!==r.orderId||!/^pay_[a-zA-Z0-9]+$/.test(b.razorpay_payment_id||'')||!validSignature(`${r.orderId}|${b.razorpay_payment_id}`,b.razorpay_signature,process.env.RAZORPAY_KEY_SECRET||''))throw new HttpError(400,'Payment verification failed. Please check payment status.');return Response.json(publicRecord(await reconcile(r)),{headers:{'Cache-Control':'no-store'}})}catch(e){return paymentError(e)}}
