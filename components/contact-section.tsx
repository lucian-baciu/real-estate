"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import type { Site } from "@/lib/properties";

export function ContactSection({site,property}:{site:Site;property?:string}){
  const [state,setState]=useState<"idle"|"sending"|"sent"|"error">("idle");
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setState("sending");const form=new FormData(event.currentTarget);const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(form))});if(response.ok){setState("sent");event.currentTarget.reset()}else setState("error")}
  const phoneHref=`tel:${site.seller.phone.replace(/[^+\d]/g,"")}`;
  const initials=site.seller.name.split(" ").map(part=>part[0]).join("").slice(0,2);
  return <section className="contact-section" id="contact">
    <div className="seller-panel">
      <p className="kicker">Contact direct</p>
      <div className="seller-portrait">{site.seller.image?<Image src={site.seller.image} alt={site.seller.name} fill sizes="(max-width: 760px) 100vw, 42vw"/>:<span>{initials}</span>}</div>
      <div className="seller-details"><div><h2>{site.seller.name}</h2><p>{site.seller.role}</p></div><a href={phoneHref}>{site.seller.phone}</a></div>
    </div>
    <div className="form-panel"><p className="kicker">{property?"Vizionare privată":"Spune-ne ce cauți"}</p><h2>{property?<>Poate fi locul<br/><em>potrivit.</em></>:<>Începem cu o<br/><em>conversație.</em></>}</h2><p>{site.contactNote}</p>
      {state==="sent"?<div className="form-success" role="status"><strong>Mulțumim.</strong><span>Mesajul a fost trimis. Revenim cât mai curând.</span></div>:<form onSubmit={submit}>
        <input type="hidden" name="property" value={property??"Întrebare generală"}/><input className="form-trap" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
        <label><span>Nume</span><input name="name" required autoComplete="name"/></label><label><span>Telefon</span><input name="phone" required autoComplete="tel" inputMode="tel"/></label><label><span>Email</span><input name="email" required type="email" autoComplete="email"/></label><label className="message-field"><span>Mesaj</span><textarea name="message" rows={3} defaultValue={property?`Bună, aș dori mai multe detalii despre ${property}.`:""}/></label>
        <button disabled={state==="sending"} type="submit">{state==="sending"?"Se trimite…":"Trimite mesajul"}</button>{state==="error"&&<p className="form-error" role="alert">Mesajul nu a putut fi trimis. Te rugăm să încerci din nou sau să ne suni.</p>}
      </form>}
    </div>
  </section>
}
