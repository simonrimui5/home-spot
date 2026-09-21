"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Bell, Building2, Check, ChevronRight, Heart, List, Map, MessageCircle, Search, SlidersHorizontal, Sparkles, Trash2, UserRound } from "lucide-react";
import { Toaster, toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { SearchHero } from "@/components/search-hero";
import { PropertyCard } from "@/components/property-card";
import { PropertyDetail } from "@/components/property-detail";
import { ApproximateMap } from "@/components/approximate-map";
import { AdminDashboard, MoversDashboard, ProviderDashboard } from "@/components/portal-dashboards";
import { AuthPanel } from "@/components/auth-panel";
import { demoListings, popularLocations } from "@/lib/demo-data";
import type { AppSection, Listing, ResultMode } from "@/types/marketplace";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  return <div className="mb-4 flex items-end justify-between gap-4"> <div>{eyebrow && <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">{eyebrow}</div>}<h2 className="text-2xl font-bold tracking-[-0.035em] text-[#173f3b]">{title}</h2></div>{action && <button className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#0f766e]">{action}<ChevronRight className="h-4 w-4" /></button>}</div>;
}

function EmptyState({ type, onAction }: { type: "favorites" | "messages"; onAction: () => void }) {
  const favorites = type === "favorites";
  return <div className="mx-auto max-w-xl py-12 text-center"><div className="relative mx-auto aspect-square w-52 overflow-hidden rounded-[2rem] bg-[#edf5f1]"><Image src="/assets/empty-homes.png" alt="" fill className="object-cover" /></div><h1 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-[#173f3b]">{favorites ? "You haven’t saved any homes yet." : "No conversations yet."}</h1><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#687b76]">{favorites ? "Tap the heart on a home you like and it’ll wait for you here." : "Open a listing and contact its verified provider to start a secure conversation."}</p><Button onClick={onAction} className="mt-5 rounded-xl bg-[#0f766e] font-bold hover:bg-[#0b645e]">{favorites ? "Explore homes" : "Find a home"}</Button></div>;
}

export default function HomeSpotApp() {
  const [section, setSection] = useState<AppSection>("home");
  const [mode, setMode] = useState<ResultMode>("list");
  const [location, setLocation] = useState("");
  const [homeType, setHomeType] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);

  const results = useMemo(() => demoListings.filter(({ property, unit }) => {
    const place = `${property.neighborhood} ${property.town} ${property.county}`.toLowerCase();
    return (!location || place.includes(location.toLowerCase())) && (!homeType || unit.type === homeType) && (!maxBudget || unit.rent <= Number(maxBudget));
  }), [location, homeType, maxBudget]);

  const toggleFavorite = (unitId: string) => setFavorites((current) => current.includes(unitId) ? current.filter((id) => id !== unitId) : [...current, unitId]);
  const toggleCompare = (unitId: string) => setCompare((current) => current.includes(unitId) ? current.filter((id) => id !== unitId) : current.length < 3 ? [...current, unitId] : (toast.error("Compare up to 3 homes at a time"), current));
  const runSearch = () => { setSection("search"); setMode("list"); };
  const openFromMap = (listing: Listing) => setSelected(listing);

  const cards = (items: Listing[], feed = false) => <div className={cn(feed ? "space-y-5" : "grid gap-5 sm:grid-cols-2 xl:grid-cols-3")}>{items.map((listing) => <PropertyCard key={listing.unit.id} listing={listing} feed={feed} favorite={favorites.includes(listing.unit.id)} comparing={compare.includes(listing.unit.id)} onOpen={() => setSelected(listing)} onFavorite={() => toggleFavorite(listing.unit.id)} onCompare={() => toggleCompare(listing.unit.id)} />)}</div>;

  const resultsView = () => <>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-[0.15em] text-[#0f766e]">Homes that fit</div><h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-[#173f3b]">{location ? `Homes near ${location}` : "Explore available homes"}</h1><p className="mt-1 text-sm text-[#71817d]">{results.length} matching units · approximate locations</p></div><div className="flex items-center gap-2"><button onClick={() => toast("Filters include price, rooms, amenities, verification, and distance.")} className="flex h-11 items-center gap-2 rounded-xl border border-[#d6e2de] bg-white px-4 text-xs font-bold"><SlidersHorizontal className="h-4 w-4" />Filters</button><div className="flex rounded-xl border border-[#d6e2de] bg-white p-1">{([{ id: "list", icon: List }, { id: "map", icon: Map }, { id: "feed", icon: Sparkles }] as const).map(({ id, icon: Icon }) => <button key={id} onClick={() => setMode(id)} aria-label={id} className={cn("grid h-9 w-9 place-items-center rounded-lg", mode === id ? "bg-[#0f766e] text-white" : "text-[#6b7e79]")}><Icon className="h-4 w-4" /></button>)}</div></div></div>
    {results.length === 0 ? <div className="rounded-[1.7rem] border border-[#dde7e3] bg-white p-8 text-center"><Search className="mx-auto h-10 w-10 text-[#0f766e]" /><h2 className="mt-4 text-xl font-bold text-[#173f3b]">Couldn’t find homes matching your filters.</h2><p className="mt-2 text-sm text-[#71817d]">Try expanding your budget, changing the area, or removing a filter.</p><Button onClick={() => { setLocation(""); setHomeType(""); setMaxBudget(""); }} variant="outline" className="mt-5 rounded-xl">Clear filters</Button></div> : mode === "map" ? <ApproximateMap listings={results} onSelect={openFromMap} /> : cards(results, mode === "feed")}
  </>;

  const homeView = () => <>
    <SearchHero location={location} homeType={homeType} maxBudget={maxBudget} onLocationChange={setLocation} onTypeChange={setHomeType} onBudgetChange={setMaxBudget} onSearch={runSearch} />
    <div className="mt-9"><SectionTitle eyebrow="Explore by area" title="Popular locations" action="See all" /><div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">{popularLocations.map((name, index) => <button key={name} onClick={() => { setLocation(name); setSection("search"); }} className="group relative aspect-[4/3] min-w-40 overflow-hidden rounded-[1.35rem] text-left sm:min-w-0"><Image src="/assets/kenyan-neighborhood.png" alt={`${name} neighborhood`} fill className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-[#123b38]/35" /><div className="absolute inset-x-0 bottom-0 p-3"><span className="text-sm font-bold text-white">{name}</span><span className="ml-2 text-[10px] text-white/75">{12 + index * 7} homes</span></div></button>)}</div></div>
    <div className="mt-10"><SectionTitle eyebrow="Fresh opportunities" title="Recently added" action="View all" />{cards(demoListings)}</div>
    <section className="mt-10 grid overflow-hidden rounded-[1.8rem] bg-[#e5f1ed] lg:grid-cols-[1fr_0.85fr]"><div className="p-6 sm:p-9"><div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#0f766e]"><BadgeCheck className="h-4 w-4" />Built for trust</div><h2 className="mt-5 max-w-xl text-3xl font-bold tracking-[-0.04em] text-[#173f3b]">Know what’s real before you make the trip.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#58716b]">HomeSpot shows exactly what has been checked—property, neighborhood, rent, and availability—without overstating verification.</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{["Granular verification", "Recent availability checks", "Approximate public locations", "Secure in-app contact"].map((item) => <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#345d56]"><Check className="h-4 w-4 text-[#0f766e]" />{item}</div>)}</div></div><div className="relative min-h-64"><Image src="/assets/map-pattern.png" alt="Abstract neighborhood map" fill className="object-cover" /></div></section>
  </>;

  const favoritesView = () => { const items = demoListings.filter(({ unit }) => favorites.includes(unit.id)); return items.length ? <><SectionTitle eyebrow="Your shortlist" title="Saved homes" /><p className="mb-5 text-sm text-[#71817d]">Compare the homes that feel right, then arrange a viewing.</p>{cards(items)}</> : <EmptyState type="favorites" onAction={() => setSection("home")} />; };
  const compareView = () => { const items = demoListings.filter(({ unit }) => compare.includes(unit.id)); if (!items.length) return null; return <div className="fixed inset-x-3 bottom-20 z-30 mx-auto max-w-3xl rounded-[1.4rem] border border-[#cfe0da] bg-white p-3 shadow-2xl lg:bottom-5"><div className="flex items-center gap-3"><div className="hidden rounded-xl bg-[#e8f3ef] p-3 text-xs font-bold text-[#0f766e] sm:block">Compare</div><div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">{items.map(({ property, unit }) => <div key={unit.id} className="flex min-w-36 items-center justify-between rounded-xl bg-[#f3f6f4] p-2 text-xs"><span className="truncate font-bold">{property.name}</span><button onClick={() => toggleCompare(unit.id)}><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div><button onClick={() => toast("Comparison keeps unit-level rent, fees, rooms, and amenities distinct.")} className="shrink-0 rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-bold text-white">Compare {items.length}</button></div></div>; };

  return <AppShell active={section} onNavigate={(next) => { setSection(next); if (next === "map") setMode("map"); }}>
    <div className="mb-4 flex items-center justify-between rounded-xl bg-[#fff8e8] px-3 py-2 text-[11px] font-semibold text-[#7a6240]"><span>Preview workspace · sample data is clearly separated from production services</span><button onClick={() => toast("Production data connects through the typed marketplace repository after schema approval.")} className="font-bold underline">Architecture note</button></div>
    {section === "home" && homeView()}
    {(section === "search" || section === "map") && resultsView()}
    {section === "favorites" && favoritesView()}
    {section === "messages" && <EmptyState type="messages" onAction={() => setSection("search")} />}
    {section === "movers" && <MoversDashboard />}
    {section === "provider" && <ProviderDashboard />}
    {section === "admin" && <AdminDashboard />}
    {section === "profile" && <div className="grid gap-6 lg:grid-cols-[1fr_340px]"><AuthPanel /><aside className="rounded-[1.7rem] border border-[#dce7e3] bg-white p-5"><h2 className="font-bold text-[#173f3b]">Choose your workspace</h2><p className="mt-1 text-xs leading-5 text-[#71817d]">One person can hold multiple approved roles.</p><div className="mt-4 space-y-2">{[{ id: "provider", label: "Property provider", icon: Building2 }, { id: "movers", label: "Mover portal", icon: MessageCircle }, { id: "admin", label: "Admin preview", icon: UserRound }].map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setSection(id as AppSection)} className="flex w-full items-center gap-3 rounded-xl border border-[#e0e9e5] p-3 text-left text-sm font-bold text-[#47635d] hover:bg-[#f5f8f7]"><Icon className="h-5 w-5 text-[#0f766e]" />{label}<ArrowRight className="ml-auto h-4 w-4" /></button>)}</div><div className="mt-5 flex items-start gap-2 rounded-xl bg-[#f8f4e9] p-3 text-xs leading-5 text-[#725f45]"><Bell className="mt-0.5 h-4 w-4 shrink-0" />Role access will be enforced by database-backed authorization, not by this selector.</div></aside></div>}
    {selected && <PropertyDetail listing={selected} favorite={favorites.includes(selected.unit.id)} onFavorite={() => toggleFavorite(selected.unit.id)} onClose={() => setSelected(null)} />}
    {compareView()}<Toaster position="top-center" richColors />
  </AppShell>;
}
