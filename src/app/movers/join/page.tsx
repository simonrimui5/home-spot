"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const VEHICLE_TYPES = [
  "Pickup",
  "Small Van",
  "Medium Truck",
  "Large Truck",
  "Lorry",
  "Other",
];

const COUNTIES = [
  "Nairobi",
  "Kiambu",
  "Murang'a",
  "Kajiado",
  "Machakos",
  "Other",
];

export default function MoverJoinPage() {
  const router = useRouter();

  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [vehicleType, setVehicleType] = useState("Medium Truck");
  const [vehicleDescription, setVehicleDescription] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [county, setCounty] = useState("Kiambu");
  const [town, setTown] = useState("");
  const [estate, setEstate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contactName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!businessName.trim()) {
      toast.error("Please enter your business name.");
      return;
    }

    if (!town.trim()) {
      toast.error("Please enter your main service town.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Auth error:", userError);
        throw userError;
      }

      if (!user) {
        toast.error("Please sign in before joining as a mover.");
        router.push("/");
        return;
      }

      console.log("Mover onboarding: authenticated user found.");

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            display_name: contactName.trim(),
            phone: phone.trim(),
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error("Profile upsert error:", profileError);
        throw profileError;
      }

      console.log("Mover onboarding: profile saved.");

      const { error: moverError } = await supabase.from("movers").upsert(
        {
          user_id: user.id,
          business_name: businessName.trim(),
          bio: bio.trim() || null,
          verification_status: "pending",
        },
        {
          onConflict: "user_id",
        }
      );

      if (moverError) {
        console.error("Mover profile upsert error:", moverError);
        throw moverError;
      }

      console.log("Mover onboarding: mover profile saved.");

      const { error: vehicleError } = await supabase
        .from("mover_vehicles")
        .insert({
          mover_id: user.id,
          vehicle_type: vehicleType,
          description: vehicleDescription.trim() || null,
          capacity_kg: capacityKg ? Number(capacityKg) : null,
        });

      if (vehicleError) {
        console.error("Vehicle insert error:", vehicleError);
        throw vehicleError;
      }

      console.log("Mover onboarding: vehicle saved.");

      const { error: serviceAreaError } = await supabase
        .from("mover_service_areas")
        .insert({
          mover_id: user.id,
          county,
          town: town.trim(),
          estate: estate.trim() || null,
        });

      if (serviceAreaError) {
        console.error("Service area insert error:", serviceAreaError);
        throw serviceAreaError;
      }

      console.log("Mover onboarding: service area saved.");

      toast.success("Mover application submitted!", {
        description:
          "Your profile is pending verification. You can add more details later.",
      });

      router.push("/?section=movers");
    } catch (error) {
      console.error("Mover onboarding error:", error);

      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      console.error(
        "Error details:",
        JSON.stringify(error, null, 2)
      );

      toast.error("Could not submit your mover application.", {
        description:
          error instanceof Error
            ? error.message
            : "Please check the browser console for details.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#58706a]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="overflow-hidden rounded-[1.8rem] border border-[#dce7e3] bg-white">
          <div className="bg-[#123b38] px-6 py-8 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e18356]">
                <Truck className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b9d8d1]">
                  HomeSpot Movers
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em]">
                  Join as a mover
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#d5e5e1]">
              Tell us about your moving business, vehicle, and service area.
              Customers will request quotes based on their individual moves.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
            <section>
              <h2 className="text-lg font-bold text-[#173f3b]">
                Contact & business details
              </h2>

              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#385650]">
                      Contact person
                    </label>

                    <input
                      required
                      value={contactName}
                      onChange={(event) => setContactName(event.target.value)}
                      placeholder="Your full name"
                      className="h-12 w-full rounded-xl border border-[#d5e2de] px-4 text-sm outline-none focus:border-[#0f766e]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#385650]">
                      Phone number
                    </label>

                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="e.g. 0712 345 678"
                      className="h-12 w-full rounded-xl border border-[#d5e2de] px-4 text-sm outline-none focus:border-[#0f766e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#385650]">
                    Business name
                  </label>

                  <input
                    required
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="e.g. Songa Movers"
                    className="h-12 w-full rounded-xl border border-[#d5e2de] px-4 text-sm outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#385650]">
                    About your business
                  </label>

                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Tell customers about your moving services"
                    className="min-h-28 w-full rounded-xl border border-[#d5e2de] p-4 text-sm outline-none focus:border-[#0f766e]"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#173f3b]">
                Vehicle
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#385650]">
                    Vehicle type
                  </label>

                  <select
                    value={vehicleType}
                    onChange={(event) => setVehicleType(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#d5e2de] bg-white px-4 text-sm outline-none focus:border-[#0f766e]"
                  >
                    {VEHICLE_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#385650]">
                    Capacity (kg)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={capacityKg}
                    onChange={(event) => setCapacityKg(event.target.value)}
                    placeholder="Optional"
                    className="h-12 w-full rounded-xl border border-[#d5e2de] px-4 text-sm outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#385650]">
                    Vehicle description
                  </label>

                  <input
                    value={vehicleDescription}
                    onChange={(event) =>
                      setVehicleDescription(event.target.value)
                    }
                    placeholder="e.g. Enclosed truck suitable for household moves"
                    className="h-12 w-full rounded-xl border border-[#d5e2de] px-4 text-sm outline-none focus:border-[#0f766e]"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#173f3b]">
                Service area
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#385650]">
                    County
                  </label>

                  <select
                    value={county}
                    onChange={(event) => setCounty(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#d5e2de] bg-white px-4 text-sm outline-none focus:border-[#0f766e]"
                  >
                    {COUNTIES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#385650]">
                    Town
                  </label>

                  <input
                    required
                    value={town}
                    onChange={(event) => setTown(event.target.value)}
                    placeholder="e.g. Ruiru"
                    className="h-12 w-full rounded-xl border border-[#d5e2de] px-4 text-sm outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#385650]">
                    Estate or area
                  </label>

                  <input
                    value={estate}
                    onChange={(event) => setEstate(event.target.value)}
                    placeholder="e.g. Kamakis"
                    className="h-12 w-full rounded-xl border border-[#d5e2de] px-4 text-sm outline-none focus:border-[#0f766e]"
                  />
                </div>
              </div>
            </section>

            <div className="rounded-xl bg-[#f0faf6] p-4 text-sm leading-6 text-[#35665d]">
              Your application will be marked{" "}
              <strong>pending verification</strong>. HomeSpot can verify your
              business before customers rely on your profile.
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-[#0f766e] font-bold hover:bg-[#0b645e]"
            >
              {submitting
                ? "Submitting application..."
                : "Submit mover application"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}