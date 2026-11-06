import {membership,ready,mode,limit,paymentDb,razorpay,validId,paymentError} from '@/lib/server/payments';
import {HttpError} from '@/lib/server/media';
export async function POST(request:Request){try{
 await limit(request);if(!ready())throw new HttpError(503,'Online payments are not configured yet.');
 const b=await request.json();const name=typeof b.name==='string'?b.name.trim():'';const phone=typeof b.phone==='string'?b.phone.replace(/\D/g,''):'';const email=typeof b.email==='string'?b.email.trim().toLowerCase():'';
 if(!validId(b.requestId)||name.length<2||name.length>100||!/^[6-9]\d{9}$/.test(phone))throw new HttpError(400,'Enter your full name and valid 10-digit Indian mobile number.');
 if(email&&(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254))throw new HttpError(400,'Enter a valid email address.');
 const db=await paymentDb(),config=await membership();if(!config.enabled)throw new HttpError(409,'Online membership registration is currently paused.');
 let record=await db.records.findOne({_id:b.requestId});
 if(record&&(record.name!==name||record.phone!==phone))throw new HttpError(409,'Start a new registration for changed details.');
 if(!record){const now=new Date().toISOString();record={_id:b.requestId,name,phone,amount:config.feePaise,currency:'INR',status:'PENDING',mode:mode(),createdAt:now,updatedAt:now,...(email?{email}:{})};try{await db.records.insertOne({...record})}catch{throw new HttpError(409,'Registration already started. Please check its status.');}
 try{const order=await razorpay<{id:string;amount:number;currency:string}>('orders',{amount:record.amount,currency:'INR',receipt:b.requestId,notes:{app:'zunoon-club',registrationId:b.requestId,membership:'annual'}});if(!/^order_/.test(order.id)||order.amount!==record.amount||order.currency!=='INR')throw Error('Invalid gateway order');record.orderId=order.id;await db.records.updateOne({_id:b.requestId},{$set:{orderId:order.id,updatedAt:new Date().toISOString()}})}catch(e){await db.records.updateOne({_id:b.requestId},{$set:{failureReason:'Order creation could not be confirmed. Contact support before retrying.',updatedAt:new Date().toISOString()}});throw e}}
 if(!record.orderId)throw new HttpError(409,'Your registration needs support confirmation before a new payment.');
 return Response.json({reference:record._id,orderId:record.orderId,amount:record.amount,currency:'INR',keyId:process.env.RAZORPAY_KEY_ID,mode:record.mode,status:record.status},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return paymentError(e)}}
