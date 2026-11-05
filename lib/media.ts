export const valueSlots = ['connect','experience','learn','grow','contribute','celebrate'] as const;
export const mediaSections = ['values','gallery','general'] as const;
export type MediaSection = typeof mediaSections[number];
export type MediaAsset = {id:string;section:string;title:string;alt:string;url:string;publicId:string;bytes:number;createdAt:string};
export type PublicMedia = {values:Record<string,{url:string;alt:string}>;gallery:MediaAsset[]};
export const emptyMedia:PublicMedia={values:{},gallery:[]};
export function isAssignmentSlot(value:unknown):value is string {return typeof value==='string'&&(valueSlots.some(s=>value===`values.${s}`)||/^gallery\.[a-f0-9-]{36}$/.test(value));}
export function isImageBytes(bytes:Uint8Array){
 return (bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)||
 (bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47)||
 (String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP');
}
