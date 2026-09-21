import type { Listing } from "@/types/marketplace";

export interface SearchFilters {
  location?: string;
  maxRent?: number;
  unitType?: string;
  availableNow?: boolean;
  verifiedOnly?: boolean;
  radiusKm?: number;
  page: number;
  pageSize: number;
}

export interface MarketplaceRepository {
  searchListings(filters: SearchFilters): Promise<{ items: Listing[]; total: number }>;
  setFavorite(unitId: string, saved: boolean): Promise<void>;
  requestViewing(input: { unitId: string; preferredAt: string; message?: string }): Promise<void>;
}

// The concrete Supabase repository will be added against the separately approved
// production schema. Keeping this contract stable prevents UI code from depending
// on table shape, PostGIS implementation details, or a particular map provider.
export type MarketplaceService = MarketplaceRepository;
