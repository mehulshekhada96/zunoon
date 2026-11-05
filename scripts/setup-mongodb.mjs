import {MongoClient} from 'mongodb';
if(!process.env.MONGODB_URI)throw new Error('Set MONGODB_URI first');
const client=new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});
try{await client.connect();const db=client.db(process.env.MONGODB_DB||'zunoon_club');await Promise.all([
 db.collection('media_assets').createIndex({id:1},{unique:true}),db.collection('media_assets').createIndex({publicId:1},{unique:true}),
 db.collection('media_assignments').createIndex({slot:1},{unique:true}),db.collection('admin_sessions').createIndex({tokenHash:1},{unique:true}),
 db.collection('admin_sessions').createIndex({expiresAt:1},{expireAfterSeconds:0}),db.collection('login_attempts').createIndex({key:1},{unique:true}),
 db.collection('login_attempts').createIndex({expiresAt:1},{expireAfterSeconds:0})
]);console.log('MongoDB indexes ready');}finally{await client.close()}
