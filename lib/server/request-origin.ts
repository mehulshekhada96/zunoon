// Next.js may expose an internal hostname in request.url behind a proxy.
// Compare the browser origin against the HTTP Host used for this request.
export function sameOrigin(request:Request){
 const origin=request.headers.get('origin');if(!origin)return false;
 try{const url=new URL(origin);return ['http:','https:'].includes(url.protocol)&&url.host===(request.headers.get('host')||new URL(request.url).host)}catch{return false}
}
