export type Availability = "available" | "confirmation_due" | "occupied";
export type VerificationKey = "property" | "location" | "rent" | "availability";

export interface Property {
  id: string;
  name: string;
  neighborhood: string;
  town: string;
  county: string;
  image: string;
  description: string;
  propertyAmenities: string[];
  approximatePosition: { x: number; y: number };
}

export interface Unit {
  id: string;
  propertyId: string;
  number: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  deposit: number;
  serviceCharge: number;
  sizeSqFt: number;
  availability: Availability;
  confirmedLabel: string;
  unitAmenities: string[];
  verification: VerificationKey[];
}

export interface Listing {
  property: Property;
  unit: Unit;
}

export interface Mover {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  serviceAreas: string[];
  estimate: string;
  verified: boolean;
}

export type AppSection = "home" | "search" | "map" | "favorites" | "messages" | "rentals" | "movers" | "provider" | "admin" | "profile";
export type ResultMode = "list" | "map" | "feed";
