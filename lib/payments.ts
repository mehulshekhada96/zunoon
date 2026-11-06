export type PaymentStatus='PENDING'|'SUCCESS'|'FAILED';
export type MembershipSettings={feePaise:number;enabled:boolean;updatedAt?:string};
export type PaymentRecord={_id:string;name:string;phone:string;email?:string;amount:number;currency:'INR';status:PaymentStatus;mode:'test'|'live';orderId?:string;paymentId?:string;method?:string;failureReason?:string;createdAt:string;updatedAt:string;paidAt?:string;checkoutClosedAt?:string;refundAmount?:number};
export const defaultMembership:MembershipSettings={feePaise:210000,enabled:true};
export const inr=(paise:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(paise/100);
