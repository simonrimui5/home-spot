"use client";

import Image from "next/image";
import { BadgeCheck, Heart, MapPin, Scale } from "lucide-react";
import type { Listing } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  listing: Listing;
  favorite: boolean;
  comparing: boolean;
  feed?: boolean;
  onOpen: () => void;
  onFavorite: () => void;
  onCompare: () => void;
}

export function PropertyCard({ listing, favorite, comparing, feed, onOpen, onFavorite, onCompare }: PropertyCardProps) {
  const { property, unit } = listing;
  const available = unit.availability === "available";
  return (
    <article className={cn("group overflow-hidden rounded-[1.6rem] border border-[#dde8e4] bg-white shadow-[0_12px_40px_-28px_rgba(18,59,56,0.5)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-26px_rgba(18,59,56,0.55)]", feed && "mx-auto max-w-xl")}>
      <div className={cn("relative overflow-hidden", feed ? "aspect-[4/3]" : "aspect-[5/3]")} onClick={onOpen} role="button" tabIndex={0}>
        <Image src={property.image} alt={property.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold shadow-sm", available ? "bg-[#def7eb] text-[#087052]" : "bg-[#fff3d6] text-[#936315]")}>{available ? "Available" : "Confirming availability"}</span>
          <button onClick={(event) => { event.stopPropagation(); onFavorite(); }} aria-label={favorite ? "Remove from favorites" : "Save home"} className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#173f3b] shadow-md transition hover:scale-105">
            <Heart className={cn("h-5 w-5", favorite && "fill-[#df704b] text-[#df704b]")} />
          </button>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-[#123b38]/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">Unit {unit.number}</div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <button onClick={onOpen} className="text-left text-lg font-bold tracking-[-0.02em] text-[#173f3b] hover:text-[#0f766e]">{property.name}</button>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-[#667b76]"><MapPin className="h-4 w-4 text-[#0f766e]" />{property.neighborhood}, {property.town}</div>
          </div>
          {unit.verification.length >= 3 && <BadgeCheck className="h-6 w-6 shrink-0 text-[#0f766e]" aria-label="Verified listing" />}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div><span className="text-xl font-extrabold tracking-[-0.03em] text-[#173f3b]">KSh {unit.rent.toLocaleString()}</span><span className="text-xs text-[#71817d]"> / month</span></div>
          <span className="rounded-full bg-[#f1f5f3] px-3 py-1.5 text-xs font-bold text-[#47635d]">{unit.type}</span>
        </div>
        <div className="mt-4 flex gap-2 overflow-hidden">
          {property.propertyAmenities.slice(0, 3).map((amenity) => <span key={amenity} className="whitespace-nowrap rounded-full border border-[#dfe9e5] px-2.5 py-1 text-[11px] font-semibold text-[#58716b]">{amenity}</span>)}
        </div>
        <button onClick={onCompare} className={cn("mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition", comparing ? "border-[#0f766e] bg-[#e8f3ef] text-[#0f766e]" : "border-[#dbe7e3] text-[#58716b] hover:bg-[#f5f8f7]")}><Scale className="h-4 w-4" />{comparing ? "Added to compare" : "Add to compare"}</button>
      </div>
    </article>
  );
}
