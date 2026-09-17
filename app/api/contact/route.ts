import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const schema=z.object({name:z.string().trim().min(2).max(100),phone:z.string().trim().min(6).max(30),email:z.email().max(200),message:z.string().trim().max(3000).default(""),property:z.string().trim().max(200),company:z.string().max(0).optional()});
export async function POST(request:Request){
  try{const body=schema.safeParse(await request.json());if(!body.success)return NextResponse.json({error:"Invalid form"},{status:400});
    const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASSWORD,SMTP_FROM,CONTACT_TO_EMAIL}=process.env;if(!SMTP_HOST||!SMTP_PORT||!SMTP_USER||!SMTP_PASSWORD||!SMTP_FROM||!CONTACT_TO_EMAIL)return NextResponse.json({error:"Mail is not configured"},{status:503});
    const {name,phone,email,message,property}=body.data;const transport=nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT),secure:Number(SMTP_PORT)===465,auth:{user:SMTP_USER,pass:SMTP_PASSWORD}});
    await transport.sendMail({from:SMTP_FROM,to:CONTACT_TO_EMAIL,replyTo:email,subject:`Solicitare proprietate — ${property}`,text:`Proprietate: ${property}\nNume: ${name}\nTelefon: ${phone}\nEmail: ${email}\n\nMesaj:\n${message}`});return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:"Unable to send"},{status:500})}
}
