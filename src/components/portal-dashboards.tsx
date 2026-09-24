"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BarChart3, Building2, CalendarClock, CheckCircle2, ChevronRight, CircleDollarSign, Clock3, Home, MoreHorizontal, ShieldCheck, Truck, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { demoListings } from "@/lib/demo-data";
import { supabase } from "@/integrations/supabase/client";

const Metric = ({ label, value, icon: Icon, tone = "teal" }: { label: string; value: string; icon: typeof Home; tone?: "teal" | "sand" }) => (
  <div className="rounded-[1.4rem] border border-[#dfe8e5] bg-white p-5">
    <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone === "teal" ? "bg-[#e5f2ee] text-[#0f766e]" : "bg-[#faeddf] text-[#b56642]"}`}><Icon className="h-5 w-5" /></div>
    <div className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[#173f3b]">{value}</div><div className="mt-1 text-sm text-[#71817d]">{label}</div>
  </div>
);

export function ProviderDashboard() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  return (
    <section>
      <div className="rounded-[1.8rem] bg-[#123b38] px-6 py-8 text-white sm:px-8">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8fd1c3]">Provider workspace</span>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-[-0.04em]">Good morning, Wanjiku</h1><p className="mt-2 text-sm text-[#cfe3dd]">Your homes are getting attention. Two units need availability checks.</p></div><Button onClick={() => router.push("/properties/new")} className="rounded-xl bg-[#e18356] font-bold hover:bg-[#ca7048]">+ Add property</Button></div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="Active properties" value="3" icon={Building2} /><Metric label="Available units" value="7" icon={Home} /><Metric label="Viewing requests" value="12" icon={CalendarClock} tone="sand" /><Metric label="Views this month" value="1.8k" icon={BarChart3} /></div>
      <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-[#dfe8e5] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5ece9] p-5"><div><h2 className="font-bold text-[#173f3b]">Unit availability</h2><p className="text-xs text-[#71817d]">Update each home independently</p></div><Button variant="ghost" className="text-[#0f766e]">View all</Button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-[#f7f9f7] text-xs uppercase tracking-wide text-[#71817d]"><tr><th className="p-4">Unit</th><th className="p-4">Type</th><th className="p-4">Rent</th><th className="p-4">Status</th><th className="p-4">Last confirmed</th><th className="p-4" /></tr></thead><tbody>
          {demoListings.map(({ property, unit }) => {
            const status = statuses[unit.id] || unit.availability;
            return <tr key={unit.id} className="border-t border-[#edf1ef]"><td className="p-4 font-bold text-[#173f3b]">{unit.number}<span className="block text-xs font-normal text-[#71817d]">{property.name}</span></td><td className="p-4">{unit.type}</td><td className="p-4">KSh {unit.rent.toLocaleString()}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status === "available" ? "bg-[#def7eb] text-[#087052]" : "bg-[#fff3d6] text-[#936315]"}`}>{status === "available" ? "Available" : "Check needed"}</span></td><td className="p-4 text-[#61736f]">{unit.confirmedLabel}</td><td className="p-4"><button onClick={() => { setStatuses((current) => ({ ...current, [unit.id]: "available" })); toast.success(`${unit.number} marked available`); }} className="rounded-lg border border-[#d7e3df] px-3 py-2 text-xs font-bold text-[#0f766e]">Confirm now</button></td></tr>;
          })}
        </tbody></table></div>
      </div>
    </section>
  );
}

export function MoversDashboard() {
  const [movers, setMovers] = useState<any[]>([]);
  const [loadingMovers, setLoadingMovers] = useState(true);

  useEffect(() => {
    const loadMovers = async () => {
      const { data, error } = await supabase
        .from("movers")
        .select(
          "user_id, business_name, bio, verification_status, verified_at, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading movers:", error);
        toast.error("Could not load movers");
      } else {
        setMovers(data ?? []);
      }

      setLoadingMovers(false);
    };

    loadMovers();
  }, []);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">
    Move with confidence
  </span>

  <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#173f3b]">
    From this home to the next.
  </h1>

  <p className="mt-2 max-w-xl text-sm leading-6 text-[#687b76]">
    Tell verified movers what you need once, then compare clear quotes
    in one place.
  </p>
</div>

<Button
  type="button"
  onClick={() => toast("Mover onboarding is coming next.")}
  variant="outline"
  className="h-11 rounded-xl border-[#cbdcd7] bg-white font-bold text-[#173f3b]"
>
  <Truck className="mr-2 h-4 w-4 text-[#0f766e]" />
  Join as a mover
</Button>

        <Truck className="h-14 w-14 text-[#e18356]" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Moving request prepared", {
              description: "Your moving request will be used to receive quotes.",
            });
          }}
          className="rounded-[1.6rem] bg-[#123b38] p-5 text-white sm:p-6"
        >
          <h2 className="text-xl font-bold">Plan your move</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Current neighborhood"
              className="h-12 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/20 placeholder:text-[#bad1cb]"
            />

            <input
              required
              placeholder="New neighborhood"
              className="h-12 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/20 placeholder:text-[#bad1cb]"
            />

            <input
              required
              type="date"
              className="h-12 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/20"
            />

            <select
              className="h-12 rounded-xl bg-[#234d49] px-4 text-sm outline-none ring-1 ring-white/20"
            >
              <option>Bedsitter</option>
              <option>1 Bedroom</option>
              <option>2 Bedroom</option>
              <option>3+ Bedroom</option>
            </select>

            <input
              placeholder="Floor & lift details"
              className="h-12 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/20 placeholder:text-[#bad1cb] sm:col-span-2"
            />

            <textarea
              placeholder="Large items or packing needs"
              className="min-h-24 rounded-xl bg-white/10 p-4 text-sm outline-none ring-1 ring-white/20 placeholder:text-[#bad1cb] sm:col-span-2"
            />
          </div>

          <Button className="mt-4 h-12 w-full rounded-xl bg-[#e18356] font-bold hover:bg-[#ca7048]">
            Request quotes
          </Button>
        </form>

        <div className="space-y-3">
          {loadingMovers ? (
            <div className="rounded-[1.4rem] border border-[#dfe8e5] bg-white p-5 text-sm text-[#71817d]">
              Loading movers...
            </div>
          ) : movers.length === 0 ? (
            <div className="rounded-[1.4rem] border border-[#dfe8e5] bg-white p-5">
              <h3 className="font-bold text-[#173f3b]">
                No movers available yet
              </h3>

              <p className="mt-1 text-sm text-[#71817d]">
                Movers will appear here once they join HomeSpot.
              </p>
            </div>
          ) : (
            movers.map((mover) => (
              <article
                key={mover.user_id}
                className="rounded-[1.4rem] border border-[#dfe8e5] bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e7f3ef] text-[#0f766e]">
                      <Truck className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#173f3b]">
                        {mover.business_name || "HomeSpot Mover"}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 text-xs text-[#667b76]">
                        {mover.verification_status === "verified" ? (
                          <>
                            <BadgeCheck className="h-4 w-4 text-[#0f766e]" />
                            Verified mover
                          </>
                        ) : (
                          <>
                            <BadgeCheck className="h-4 w-4 text-[#71817d]" />
                            Verification pending
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <MoreHorizontal className="text-[#71817d]" />
                </div>

                <p className="mt-4 text-sm leading-6 text-[#667b76]">
                  {mover.bio || "Professional moving services through HomeSpot."}
                </p>

                <div className="mt-4 rounded-xl bg-[#f4f7f5] p-3 text-xs">
                  <span className="text-[#71817d]">Moving price</span>

                  <b className="mt-1 block text-[#173f3b]">
                    Request a quote
                  </b>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export function AdminDashboard() {
  const queue = [{ label: "Property verification", count: 18, icon: ShieldCheck }, { label: "Listing reports", count: 7, icon: Clock3 }, { label: "Mover applications", count: 5, icon: Truck }];
  return (
    <section>
      <div className="flex items-center justify-between"><div><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">Platform operations</span><h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#173f3b]">Admin overview</h1></div><div className="flex items-center gap-2 rounded-full bg-[#e7f3ef] px-3 py-2 text-xs font-bold text-[#0f766e]"><CheckCircle2 className="h-4 w-4" />All systems healthy</div></div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="Total users" value="24.8k" icon={Users} /><Metric label="Active listings" value="3,482" icon={Building2} /><Metric label="Available units" value="1,906" icon={Home} /><Metric label="Revenue this month" value="KSh 2.4m" icon={CircleDollarSign} tone="sand" /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[1.6rem] border border-[#dfe8e5] bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-bold text-[#173f3b]">Demand by location</h2><span className="text-xs text-[#71817d]">Last 30 days</span></div><div className="mt-6 space-y-5">{[["Kilimani", 88], ["Ruiru", 76], ["Kasarani", 61], ["Rongai", 48]].map(([name, width]) => <div key={name as string}><div className="flex justify-between text-xs"><b className="text-[#47635d]">{name}</b><span className="text-[#71817d]">{width}%</span></div><div className="mt-2 h-2 rounded-full bg-[#edf2ef]"><div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${width}%` }} /></div></div>)}</div></div>
        <div className="space-y-3">{queue.map(({ label, count, icon: Icon }) => <button key={label} className="flex w-full items-center gap-3 rounded-[1.2rem] border border-[#dfe8e5] bg-white p-4 text-left transition hover:bg-[#f6f9f7]"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#faeddf] text-[#b56642]"><Icon className="h-5 w-5" /></div><div className="flex-1"><b className="text-sm text-[#173f3b]">{label}</b><span className="block text-xs text-[#71817d]">{count} waiting</span></div><ChevronRight className="h-5 w-5 text-[#82918d]" /></button>)}</div>
      </div>
    </section>
  );
}
