import type { Listing, Mover } from "@/types/marketplace";

// Development-only presentation data. Production services must replace this module with database results.
export const demoListings: Listing[] = [
  {
    property: {
      id: "property-green-valley",
      name: "Green Valley Apartments",
      neighborhood: "Kahawa Sukari",
      town: "Ruiru",
      county: "Kiambu",
      image: "/assets/homespot-hero.png",
      description: "A calm, well-managed apartment community with generous natural light and reliable everyday amenities.",
      propertyAmenities: ["Parking", "CCTV", "Borehole", "24/7 security"],
      approximatePosition: { x: 56, y: 35 },
    },
    unit: {
      id: "unit-gv-b01",
      propertyId: "property-green-valley",
      number: "B01",
      type: "1 Bedroom",
      bedrooms: 1,
      bathrooms: 1,
      rent: 14000,
      deposit: 14000,
      serviceCharge: 1000,
      sizeSqFt: 520,
      availability: "available",
      confirmedLabel: "Confirmed today",
      unitAmenities: ["Balcony", "Built-in wardrobes", "Internet ready"],
      verification: ["property", "location", "rent", "availability"],
    },
  },
  {
    property: {
      id: "property-jacaranda",
      name: "Jacaranda Court",
      neighborhood: "Kilimani",
      town: "Nairobi",
      county: "Nairobi",
      image: "/assets/kenyan-neighborhood.png",
      description: "A private urban court close to daily essentials, designed for easy city living.",
      propertyAmenities: ["Lift", "Backup generator", "Gym", "Security"],
      approximatePosition: { x: 38, y: 57 },
    },
    unit: {
      id: "unit-jc-402",
      propertyId: "property-jacaranda",
      number: "402",
      type: "2 Bedroom",
      bedrooms: 2,
      bathrooms: 2,
      rent: 48000,
      deposit: 48000,
      serviceCharge: 3500,
      sizeSqFt: 910,
      availability: "available",
      confirmedLabel: "Confirmed yesterday",
      unitAmenities: ["Ensuite", "Balcony", "Fitted kitchen"],
      verification: ["property", "location", "rent"],
    },
  },
  {
    property: {
      id: "property-sunrise",
      name: "Sunrise Studios",
      neighborhood: "Roysambu",
      town: "Nairobi",
      county: "Nairobi",
      image: "/assets/homespot-hero.png",
      description: "Bright compact homes with dependable transport access and a friendly resident community.",
      propertyAmenities: ["CCTV", "Borehole", "Caretaker"],
      approximatePosition: { x: 70, y: 64 },
    },
    unit: {
      id: "unit-ss-a12",
      propertyId: "property-sunrise",
      number: "A12",
      type: "Bedsitter",
      bedrooms: 0,
      bathrooms: 1,
      rent: 9000,
      deposit: 9000,
      serviceCharge: 0,
      sizeSqFt: 280,
      availability: "confirmation_due",
      confirmedLabel: "Confirmation due",
      unitAmenities: ["Internet ready", "Tiled floors"],
      verification: ["property", "location"],
    },
  },
];

export const popularLocations = ["Ruiru", "Kilimani", "Kasarani", "Rongai", "Syokimau", "Westlands"];

export const demoMovers: Mover[] = [
  { id: "mover-1", name: "Songa Movers", rating: 4.9, vehicle: "3-ton closed truck", serviceAreas: ["Nairobi", "Kiambu"], estimate: "KSh 6,500–12,000", verified: true },
  { id: "mover-2", name: "Twende Move Co.", rating: 4.7, vehicle: "Pickup & 5-ton truck", serviceAreas: ["Nairobi", "Kajiado", "Machakos"], estimate: "KSh 5,000–15,000", verified: true },
];
