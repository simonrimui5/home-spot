"use client";

import Image from "next/image";
import { useState } from "react";
import { BadgeCheck, Building2, CalendarDays, Check, Heart, MapPin, MessageCircle, Phone, Send, Share2, X } from "lucide-react";
import { toast } from "sonner";
import type { Listing } from "@/types/marketplace";
import { Button } from "@/components/ui/button";

export function PropertyDetail({ listing, favorite, onFavorite, onClose }: { listing: Listing; favorite: boolean; onFavorite: () => void; onClose: () => void }) {
  const [viewingOpen, setViewingOpen] = useState(false);
  const { property, unit } = listing;
  const submitViewing = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setViewingOpen(false);
    toast.success("Viewing request prepared", { description: "Sign in to send it securely to the listing contact." });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f7f7f2]">
      <div className="mx-auto min-h-screen max-w-6xl bg-white pb-28 md:my-6 md:min-h-0 md:overflow-hidden md:rounded-[2rem] md:shadow-2xl">
        <div className="relative aspect-[4/3] max-h-[520px] w-full overflow-hidden md:aspect-[16/7]">
          <Image src={property.image} alt={property.name} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-x-0 top-0 flex justify-between p-4 sm:p-6">
            <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/95 text-[#173f3b] shadow-lg" aria-label="Close property"><X className="h-5 w-5" /></button>
            <div className="flex gap-2">
              <button onClick={() => toast.success("Share link copied")} className="grid h-11 w-11 place-items-center rounded-full bg-white/95 text-[#173f3b] shadow-lg"><Share2 className="h-5 w-5" /></button>
              <button onClick={onFavorite} className="grid h-11 w-11 place-items-center rounded-full bg-white/95 text-[#173f3b] shadow-lg"><Heart className={favorite ? "h-5 w-5 fill-[#df704b] text-[#df704b]" : "h-5 w-5"} /></button>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#173f3b] shadow">1 of 8 photos</div>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[1fr_320px] md:p-10">
          <main>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">{unit.type} · Unit {unit.number}</div><h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#173f3b] sm:text-4xl">{property.name}</h1><p className="mt-2 flex items-center gap-1.5 text-sm text-[#637a74]"><MapPin className="h-4 w-4" />{property.neighborhood}, {property.town} · Approximate area</p></div>
              <div><div className="text-2xl font-extrabold text-[#173f3b]">KSh {unit.rent.toLocaleString()}</div><div className="text-right text-xs text-[#71817d]">per month</div></div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-[#f2f6f4] p-3 text-center"><div><b>{unit.bedrooms || "Studio"}</b><span className="block text-xs text-[#6b7e79]">Bedrooms</span></div><div className="border-x"><b>{unit.bathrooms}</b><span className="block text-xs text-[#6b7e79]">Bathrooms</span></div><div><b>{unit.sizeSqFt}</b><span className="block text-xs text-[#6b7e79]">Sq ft</span></div></div>
            <section className="mt-8"><h2 className="text-xl font-bold text-[#173f3b]">Verified details</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{["Property exists", "Neighborhood confirmed", "Rent confirmed", "Availability checked"].map((label, index) => <div key={label} className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold ${index < unit.verification.length ? "border-[#cfe7df] bg-[#f1faf7] text-[#126353]" : "border-[#ece7dc] bg-[#faf8f2] text-[#846f52]"}`}>{index < unit.verification.length ? <BadgeCheck className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}{label}</div>)}</div></section>
            <section className="mt-8"><h2 className="text-xl font-bold text-[#173f3b]">About this home</h2><p className="mt-3 leading-7 text-[#526b65]">{property.description}</p></section>
            <div className="mt-8 grid gap-6 sm:grid-cols-2"><section><h2 className="font-bold text-[#173f3b]">Building amenities</h2><div className="mt-3 space-y-2">{property.propertyAmenities.map((item) => <p key={item} className="flex items-center gap-2 text-sm text-[#526b65]"><Check className="h-4 w-4 text-[#0f766e]" />{item}</p>)}</div></section><section><h2 className="font-bold text-[#173f3b]">Unit amenities</h2><div className="mt-3 space-y-2">{unit.unitAmenities.map((item) => <p key={item} className="flex items-center gap-2 text-sm text-[#526b65]"><Check className="h-4 w-4 text-[#0f766e]" />{item}</p>)}</div></section></div>
          </main>
          <aside className="h-fit rounded-[1.5rem] border border-[#dce8e4] p-5 md:sticky md:top-6">
            <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full bg-[#e8f3ef] text-[#0f766e]"><Building2 className="h-6 w-6" /></div><div><div className="font-bold text-[#173f3b]">Managed by Wanjiku</div><div className="text-xs text-[#6a7d78]">Verified caretaker</div></div></div>
            <div className="mt-5 grid gap-2"><Button onClick={() => setViewingOpen(true)} className="h-12 rounded-xl bg-[#0f766e] font-bold hover:bg-[#0b645e]"><CalendarDays className="mr-2 h-4 w-4" />Request viewing</Button><Button variant="outline" onClick={() => toast("Sign in to start a secure conversation")} className="h-12 rounded-xl border-[#cfded9] font-bold text-[#173f3b]"><MessageCircle className="mr-2 h-4 w-4" />Contact</Button><div className="grid grid-cols-2 gap-2"><Button variant="outline" className="rounded-xl border-[#cfded9]"><Phone className="mr-2 h-4 w-4" />Call</Button><Button variant="outline" className="rounded-xl border-[#cfded9]"><Send className="mr-2 h-4 w-4" />WhatsApp</Button></div></div>
            <div className="mt-5 rounded-xl bg-[#faf6eb] p-3 text-xs leading-5 text-[#725f45]">For your safety, never send a deposit before viewing and confirming the home.</div>
          </aside>
        </div>
      </div>
      {viewingOpen && <div className="fixed inset-0 z-[60] grid place-items-end bg-[#0e302d]/50 p-0 sm:place-items-center sm:p-5"><form onSubmit={submitViewing} className="w-full rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-[2rem]"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-[#173f3b]">Request a viewing</h2><button type="button" onClick={() => setViewingOpen(false)}><X /></button></div><p className="mt-2 text-sm text-[#6b7e79]">Choose a comfortable time to visit Unit {unit.number}.</p><label className="mt-5 block text-xs font-bold text-[#47635d]">Preferred date<input required type="date" className="mt-2 h-12 w-full rounded-xl border border-[#cfddd8] px-3" /></label><label className="mt-4 block text-xs font-bold text-[#47635d]">Preferred time<select className="mt-2 h-12 w-full rounded-xl border border-[#cfddd8] px-3"><option>Morning · 9am–12pm</option><option>Afternoon · 12pm–4pm</option><option>Evening · 4pm–6pm</option></select></label><label className="mt-4 block text-xs font-bold text-[#47635d]">Message (optional)<textarea className="mt-2 min-h-24 w-full rounded-xl border border-[#cfddd8] p-3" placeholder="Any questions for the caretaker?" /></label><Button className="mt-5 h-12 w-full rounded-xl bg-[#0f766e] font-bold hover:bg-[#0b645e]">Submit request</Button></form></div>}
    </div>
  );
}
