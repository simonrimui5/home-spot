"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Unit = {
unitNumber: string;
unitType: string;
bedrooms: number;
bathrooms: number;
floor: string;
sizeSqm: string;
rent: string;
deposit: string;
serviceCharge: string;
status: "available" | "occupied" | "reserved" | "maintenance";
};

type PropertyForm = {
name: string;
propertyType: string;
description: string;

county: string;
town: string;
estate: string;
street: string;
address: string;
latitude: string;
longitude: string;

units: Unit[];

amenities: string[];

contactName: string;
contactPhone: string;
contactRole: string;
preferredContact: string;
};

const PROPERTY_TYPES = [
"Apartment",
"Apartment Block",
"Gated Estate",
"Townhouse",
"Villa",
"House",
"Studio Complex",
"Other",
];

const UNIT_TYPES = [
"Bedsitter",
"Studio",
"1 Bedroom",
"2 Bedroom",
"3 Bedroom",
"4 Bedroom",
"5+ Bedroom",
"Other",
];

const AMENITIES = [
"Parking",
"CCTV",
"Security",
"Borehole",
"Backup Generator",
"Lift",
"Swimming Pool",
"Gym",
"Playground",
"Internet",
"Water Tank",
"Balcony",
"Ensuite",
"Built-in Wardrobes",
"Furnished",
];

const initialUnit: Unit = {
unitNumber: "",
unitType: "1 Bedroom",
bedrooms: 1,
bathrooms: 1,
floor: "",
sizeSqm: "",
rent: "",
deposit: "",
serviceCharge: "",
status: "available",
};

const initialForm: PropertyForm = {
name: "",
propertyType: "Apartment",
description: "",

county: "",
town: "",
estate: "",
street: "",
address: "",
latitude: "",
longitude: "",

units: [{ ...initialUnit }],

amenities: [],

contactName: "",
contactPhone: "",
contactRole: "Landlord",
preferredContact: "Phone",
};

export default function NewPropertyPage() {
const router = useRouter();

const [step, setStep] = useState(1);
const [form, setForm] = useState<PropertyForm>(initialForm);
const [photos, setPhotos] = useState<File[]>([]);
const [video, setVideo] = useState<File | null>(null);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

const progress = useMemo(() => {
return Math.round((step / 8) * 100);
}, [step]);

function updateForm<K extends keyof PropertyForm>(
field: K,
value: PropertyForm[K]
) {
setForm((current) => ({
...current,
[field]: value,
}));
}

function updateUnit(
index: number,
field: keyof Unit,
value: string | number
) {
setForm((current) => {
const units = [...current.units];

  units[index] = {
    ...units[index],
    [field]: value,
  };

  return {
    ...current,
    units,
  };
});

}

function addUnit() {
setForm((current) => ({
...current,
units: [...current.units, { ...initialUnit }],
}));
}

function removeUnit(index: number) {
if (form.units.length === 1) return;

setForm((current) => ({
  ...current,
  units: current.units.filter((_, i) => i !== index),
}));

}

function toggleAmenity(amenity: string) {
setForm((current) => {
const exists = current.amenities.includes(amenity);

  return {
    ...current,
    amenities: exists
      ? current.amenities.filter((item) => item !== amenity)
      : [...current.amenities, amenity],
  };
});

}

function validateStep(currentStep: number) {
setError("");

if (currentStep === 1) {
  if (!form.name.trim()) {
    setError("Please enter the property name.");
    return false;
  }

  if (!form.propertyType) {
    setError("Please select a property type.");
    return false;
  }
}

if (currentStep === 2) {
  if (!form.county.trim() || !form.town.trim()) {
    setError("Please enter the county and town.");
    return false;
  }
}

if (currentStep === 3) {
  if (form.units.length === 0) {
    setError("Please add at least one unit.");
    return false;
  }

  for (const unit of form.units) {
    if (!unit.unitType || !unit.rent) {
      setError("Please provide the unit type and monthly rent for every unit.");
      return false;
    }
  }
}

if (currentStep === 6) {
  if (!form.contactName.trim() || !form.contactPhone.trim()) {
    setError("Please provide a contact name and phone number.");
    return false;
  }
}

return true;

}

function nextStep() {
if (!validateStep(step)) return;

setStep((current) => Math.min(current + 1, 8));

}

function previousStep() {
setError("");
setStep((current) => Math.max(current - 1, 1));
}

function handlePhotoChange(
event: React.ChangeEvent<HTMLInputElement>
) {
if (!event.target.files) return;

setPhotos(Array.from(event.target.files));

}

function handleVideoChange(
event: React.ChangeEvent<HTMLInputElement>
) {
const file = event.target.files?.[0] ?? null;
setVideo(file);
}

async function saveDraft() {
setSaving(true);
setError("");

try {
  /*
   * IMPORTANT:
   * Replace this section with your existing Supabase
   * draft-saving function once we confirm your actual
   * database schema.
   *
   * Do not create a second properties table.
   */

  localStorage.setItem(
    "homespot-property-draft",
    JSON.stringify(form)
  );

  alert("Your listing has been saved as a draft.");
} catch (err) {
  console.error(err);
  setError("We could not save your draft. Please try again.");
} finally {
  setSaving(false);
}

}

async function publishListing() {
if (!validateStep(1)) {
setStep(1);
return;
}

if (!validateStep(2)) {
  setStep(2);
  return;
}

if (!validateStep(3)) {
  setStep(3);
  return;
}

if (!validateStep(6)) {
  setStep(6);
  return;
}

setSaving(true);
setError("");

try {
  /*
   * DATABASE CONNECTION GOES HERE.
   *
   * We will connect:
   *
   * authenticated user
   *       ↓
   * property
   *       ↓
   * location
   *       ↓
   * units
   *       ↓
   * amenities
   *       ↓
   * media
   *       ↓
   * published listing
   *
   * Do NOT create a fake success message.
   */

  console.log("HomeSpot listing ready to publish:", {
    form,
    photos,
    video,
  });

  alert(
    "The listing form is ready. Connect this function to your existing Supabase schema before publishing."
  );
} catch (err) {
  console.error(err);
  setError(
    "Something went wrong while publishing your property. Please try again."
  );
} finally {
  setSaving(false);
}

}

return (
<main className="min-h-screen bg-gray-50">
<div className="mx-auto max-w-3xl px-4 py-8">

    {/* Header */}
    <div className="mb-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-[#123b38]">
        List your property
      </h1>

      <p className="mt-2 text-gray-600">
        Add your property once and reach people looking for a home.
      </p>
    </div>

    {/* Progress */}
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">
          Step {step} of 8
        </span>

        <span className="text-gray-500">
          {progress}% complete
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#123b38] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    )}

    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold">Tell us about the property</h2>

          <p className="mt-1 text-sm text-gray-500">
            Start with the basics.
          </p>

          <div className="mt-6 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Property name
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  updateForm("name", e.target.value)
                }
                placeholder="e.g. Green Valley Apartments"
                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#123b38]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Property type
              </label>

              <select
                value={form.propertyType}
                onChange={(e) =>
                  updateForm("propertyType", e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateForm("description", e.target.value)
                }
                rows={5}
                placeholder="Tell tenants what makes this property special..."
                className="w-full rounded-lg border p-3"
              />
            </div>

          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold">Where is it?</h2>

          <p className="mt-1 text-sm text-gray-500">
            Help tenants find the property easily.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <input
              placeholder="County"
              value={form.county}
              onChange={(e) =>
                updateForm("county", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <input
              placeholder="Town"
              value={form.town}
              onChange={(e) =>
                updateForm("town", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <input
              placeholder="Estate / neighbourhood"
              value={form.estate}
              onChange={(e) =>
                updateForm("estate", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <input
              placeholder="Street"
              value={form.street}
              onChange={(e) =>
                updateForm("street", e.target.value)
              }
              className="rounded-lg border p-3"
            />

            <input
              placeholder="Address / building description"
              value={form.address}
              onChange={(e) =>
                updateForm("address", e.target.value)
              }
              className="rounded-lg border p-3 md:col-span-2"
            />

          </div>

          <div className="mt-6 rounded-xl bg-gray-100 p-5">
            <p className="font-medium">Map location</p>

            <p className="mt-1 text-sm text-gray-500">
              Connect this section to your existing map provider so the
              landlord can place the property pin.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Add your units</h2>

              <p className="mt-1 text-sm text-gray-500">
                Add every unit you want to advertise.
              </p>
            </div>

            <button
              type="button"
              onClick={addUnit}
              className="rounded-lg bg-[#123b38] px-4 py-2 text-sm font-medium text-white"
            >
              + Add unit
            </button>
          </div>

          <div className="mt-6 space-y-6">

            {form.units.map((unit, index) => (
              <div
                key={index}
                className="rounded-xl border p-5"
              >
                <div className="mb-4 flex justify-between">
                  <h3 className="font-semibold">
                    Unit {index + 1}
                  </h3>

                  {form.units.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    placeholder="Unit number e.g. A01"
                    value={unit.unitNumber}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "unitNumber",
                        e.target.value
                      )
                    }
                    className="rounded-lg border p-3"
                  />

                  <select
                    value={unit.unitType}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "unitType",
                        e.target.value
                      )
                    }
                    className="rounded-lg border p-3"
                  >
                    {UNIT_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    placeholder="Bedrooms"
                    value={unit.bedrooms}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "bedrooms",
                        Number(e.target.value)
                      )
                    }
                    className="rounded-lg border p-3"
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Bathrooms"
                    value={unit.bathrooms}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "bathrooms",
                        Number(e.target.value)
                      )
                    }
                    className="rounded-lg border p-3"
                  />

                  <input
                    placeholder="Floor"
                    value={unit.floor}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "floor",
                        e.target.value
                      )
                    }
                    className="rounded-lg border p-3"
                  />

                  <input
                    type="number"
                    placeholder="Size in m²"
                    value={unit.sizeSqm}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "sizeSqm",
                        e.target.value
                      )
                    }
                    className="rounded-lg border p-3"
                  />

                  <input
                    type="number"
                    placeholder="Monthly rent (KES)"
                    value={unit.rent}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "rent",
                        e.target.value
                      )
                    }
                    className="rounded-lg border p-3"
                  />

                  <input
                    type="number"
                    placeholder="Deposit (KES)"
                    value={unit.deposit}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "deposit",
                        e.target.value
                      )
                    }
                    className="rounded-lg border p-3"
                  />

                  <input
                    type="number"
                    placeholder="Service charge (KES)"
                    value={unit.serviceCharge}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "serviceCharge",
                        e.target.value
                      )
                    }
                    className="rounded-lg border p-3"
                  />

                  <select
                    value={unit.status}
                    onChange={(e) =>
                      updateUnit(
                        index,
                        "status",
                        e.target.value
                      )
                    }
                    className="rounded-lg border p-3"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>

                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold">
            What does the property offer?
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select everything tenants can enjoy.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">

            {AMENITIES.map((amenity) => {
              const selected =
                form.amenities.includes(amenity);

              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`rounded-xl border p-4 text-left text-sm transition ${
                    selected
                      ? "border-[#123b38] bg-[#123b38] text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {selected ? "✓ " : ""}
                  {amenity}
                </button>
              );
            })}

          </div>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold">
            Add photos and video
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Good photos help tenants understand the property before
            visiting.
          </p>

          <div className="mt-6 space-y-6">

            <div>
              <label className="mb-2 block font-medium">
                Property photos
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="w-full rounded-lg border p-3"
              />

              {photos.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {photos.length} photo(s) selected
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Property video
              </label>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full rounded-lg border p-3"
              />

              {video && (
                <p className="mt-2 text-sm text-gray-500">
                  {video.name}
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* STEP 6 */}
      {step === 6 && (
        <div>
          <h2 className="text-xl font-bold">
            How can tenants contact you?
          </h2>

          <div className="mt-6 space-y-5">

            <input
              placeholder="Contact name"
              value={form.contactName}
              onChange={(e) =>
                updateForm(
                  "contactName",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
            />

            <input
              placeholder="Phone number"
              value={form.contactPhone}
              onChange={(e) =>
                updateForm(
                  "contactPhone",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
            />

            <select
              value={form.contactRole}
              onChange={(e) =>
                updateForm(
                  "contactRole",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
            >
              <option>Landlord</option>
              <option>Caretaker</option>
              <option>Agent</option>
              <option>Property Manager</option>
            </select>

            <select
              value={form.preferredContact}
              onChange={(e) =>
                updateForm(
                  "preferredContact",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
            >
              <option>Phone</option>
              <option>WhatsApp</option>
              <option>Both</option>
            </select>

          </div>
        </div>
      )}

      {/* STEP 7 */}
      {step === 7 && (
        <div>
          <h2 className="text-xl font-bold">
            Review your listing
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Make sure everything looks correct before publishing.
          </p>

          <div className="mt-6 space-y-5">

            <ReviewSection
              title="Property"
              items={[
                ["Name", form.name],
                ["Type", form.propertyType],
                ["Description", form.description || "Not provided"],
              ]}
            />

            <ReviewSection
              title="Location"
              items={[
                ["County", form.county],
                ["Town", form.town],
                ["Estate", form.estate || "Not provided"],
                ["Street", form.street || "Not provided"],
              ]}
            />

            <div className="rounded-xl border p-4">
              <h3 className="font-semibold">Units</h3>

              <div className="mt-3 space-y-3">
                {form.units.map((unit, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-gray-50 p-3 text-sm"
                  >
                    <strong>{unit.unitType}</strong>
                    {" — "}
                    KSh {unit.rent || "0"}
                    {" — "}
                    {unit.status}
                  </div>
                ))}
              </div>
            </div>

            <ReviewSection
              title="Amenities"
              items={[
                [
                  "Selected",
                  form.amenities.length
                    ? form.amenities.join(", ")
                    : "None selected",
                ],
              ]}
            />

            <ReviewSection
              title="Contact"
              items={[
                ["Name", form.contactName],
                ["Phone", form.contactPhone],
                ["Role", form.contactRole],
                ["Preferred contact", form.preferredContact],
              ]}
            />

          </div>
        </div>
      )}

      {/* STEP 8 */}
      {step === 8 && (
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            Your listing is ready
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-gray-600">
            Review complete. When you publish, HomeSpot will create
            the property, units, location, amenities and media records.
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 p-5 text-left">
            <p className="font-semibold">{form.name}</p>
            <p className="mt-1 text-sm text-gray-500">
              {form.town}
              {form.estate ? `, ${form.estate}` : ""}
            </p>

            <p className="mt-3 text-sm">
              {form.units.length} unit(s)
            </p>

            <p className="mt-1 text-sm">
              {photos.length} photo(s)
              {video ? " + video" : ""}
            </p>
          </div>

        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">

        <button
          type="button"
          onClick={previousStep}
          disabled={step === 1 || saving}
          className="rounded-lg border px-5 py-3 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className="rounded-lg border px-5 py-3"
          >
            Save draft
          </button>

          {step < 8 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={saving}
              className="rounded-lg bg-[#123b38] px-6 py-3 font-medium text-white"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={publishListing}
              disabled={saving}
              className="rounded-lg bg-[#e18356] px-6 py-3 font-medium text-white"
            >
              {saving ? "Publishing..." : "Publish listing"}
            </button>
          )}

        </div>

      </div>

    </section>
  </div>
</main>

);
}

function ReviewSection({
title,
items,
}: {
title: string;
items: [string, string][];
}) {
return (
<div className="rounded-xl border p-4">
<h3 className="font-semibold">{title}</h3>

  <div className="mt-3 space-y-2">
    {items.map(([label, value]) => (
      <div
        key={label}
        className="flex flex-col gap-1 text-sm sm:flex-row"
      >
        <span className="font-medium sm:w-40">
          {label}
        </span>

        <span className="text-gray-600">
          {value}
        </span>
      </div>
    ))}
  </div>
</div>

);
}