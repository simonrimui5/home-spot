"use client";

import Image from "next/image";
import { Banknote, Home, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchHeroProps {
  location: string;
  homeType: string;
  maxBudget: string;
  onLocationChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onSearch: () => void;
}

const fieldClass = "h-14 w-full appearance-none bg-transparent pl-10 pr-3 text-sm font-semibold text-[#173f3b] outline-none";

export function SearchHero(props: SearchHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[#123b38] text-white shadow-[0_24px_80px_-28px_rgba(18,59,56,0.6)]">
      <div className="absolute inset-0 md:left-[48%]">
        <Image src="/assets/homespot-hero.png" alt="A bright modern rental apartment in Nairobi" fill priority className="object-cover opacity-55 md:opacity-85" sizes="(max-width: 768px) 100vw, 52vw" />
        <div className="absolute inset-0 bg-[#123b38]/55 md:bg-[#123b38]/20" />
      </div>
      <div className="relative px-5 py-9 sm:px-8 sm:py-12 md:max-w-[58%] md:px-12 md:py-16">
        <span className="inline-flex rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">Kenya&apos;s simpler way to rent</span>
        <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Your next home is a spot away.</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-[#d9ebe6] sm:text-base">Real homes, clearer availability, and trusted people—all in one calm place.</p>

        <div className="mt-7 grid overflow-hidden rounded-[1.35rem] bg-white text-[#173f3b] shadow-xl sm:grid-cols-3">
          <label className="relative border-b border-[#e5ece9] sm:border-b-0 sm:border-r">
            <MapPin className="absolute left-3.5 top-[18px] h-5 w-5 text-[#0f766e]" />
            <span className="sr-only">Where do you want to live?</span>
            <input value={props.location} onChange={(event) => props.onLocationChange(event.target.value)} placeholder="Where do you want to live?" className={fieldClass} />
          </label>
          <label className="relative border-b border-[#e5ece9] sm:border-b-0 sm:border-r">
            <Banknote className="absolute left-3.5 top-[18px] h-5 w-5 text-[#0f766e]" />
            <span className="sr-only">Maximum monthly rent</span>
            <select value={props.maxBudget} onChange={(event) => props.onBudgetChange(event.target.value)} className={fieldClass}>
              <option value="">Any budget</option><option value="15000">Up to KSh 15k</option><option value="30000">Up to KSh 30k</option><option value="50000">Up to KSh 50k</option>
            </select>
          </label>
          <label className="relative">
            <Home className="absolute left-3.5 top-[18px] h-5 w-5 text-[#0f766e]" />
            <span className="sr-only">Home type</span>
            <select value={props.homeType} onChange={(event) => props.onTypeChange(event.target.value)} className={fieldClass}>
              <option value="">Any home type</option><option>Bedsitter</option><option>1 Bedroom</option><option>2 Bedroom</option><option>3 Bedroom</option>
            </select>
          </label>
        </div>
        <Button onClick={props.onSearch} className="mt-4 h-14 w-full rounded-2xl bg-[#e18356] text-base font-bold text-white shadow-lg hover:bg-[#ca7048] sm:w-auto sm:px-8">
          <Search className="mr-2 h-5 w-5" /> Find a Home
        </Button>
      </div>
    </section>
  );
}
