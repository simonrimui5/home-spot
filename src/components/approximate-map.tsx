"use client";

import { Crosshair, MapPin } from "lucide-react";
import type { Listing } from "@/types/marketplace";

export function ApproximateMap({ listings, onSelect }: { listings: Listing[]; onSelect: (listing: Listing) => void }) {
  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-[1.75rem] border border-[#dce7e3] bg-[#edf2ec]" style={{ backgroundImage: "url('/assets/map-pattern.png')", backgroundSize: "cover" }}>
      <div className="absolute inset-0 bg-[#eaf1ed]/55" />
      <div className="absolute left-4 top-4 z-10 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="text-sm font-bold text-[#173f3b]">Approximate neighborhoods</div>
        <div className="mt-0.5 text-xs text-[#6d7f7b]">Exact addresses stay private</div>
      </div>
      <button className="absolute bottom-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white text-[#0f766e] shadow-lg" aria-label="Use current location"><Crosshair className="h-5 w-5" /></button>
      {listings.map((listing) => (
        <button key={listing.unit.id} onClick={() => onSelect(listing)} className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f766e] px-3 py-2 text-xs font-extrabold text-white shadow-[0_8px_24px_rgba(15,118,110,0.35)] ring-4 ring-white/75 transition hover:scale-105" style={{ left: `${listing.property.approximatePosition.x}%`, top: `${listing.property.approximatePosition.y}%` }}>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{Math.round(listing.unit.rent / 1000)}k</span>
        </button>
      ))}
    </div>
  );
}
