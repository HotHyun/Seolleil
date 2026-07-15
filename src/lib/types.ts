export type OperationStatus =
  | "operating"
  | "season_pending"
  | "temporarily_closed"
  | "closed"
  | "unknown";

export type SkillLevel = "first_time" | "beginner" | "intermediate" | "advanced";
export type RideType = "ski" | "snowboard";
export type TransportType = "car" | "shuttle" | "bus";
export type TripDuration = "same_day" | "overnight";
export type Priority =
  | "close"
  | "cheap"
  | "beginner"
  | "night"
  | "transport"
  | "facilities"
  | "scale"
  | "rental";

export type PriceConfidence =
  | "confirmed"
  | "estimated"
  | "phone_confirmed"
  | "unavailable";

export type PriceSourceType =
  | "official_site"
  | "official_booking"
  | "naver_booking"
  | "smartstore"
  | "travel_agency"
  | "phone";

export type SkiResort = {
  id: string;
  name: string;
  region: string;
  address: string;
  officialUrl: string;
  slopeStatusUrl: string;
  liftTicketUrl: string;
  rentalUrl?: string;
  shuttleUrl?: string;
  lodgingUrl?: string;
  mapLinks: {
    naver?: string;
    kakao?: string;
  };
  bookingLinks: BookingLink[];
  nightSkiAvailable: boolean;
  beginnerScore: number;
  familyScore: number;
  accessScore: number;
  priceLevel: number;
  resortScaleScore: number;
  transportScore: number;
  rentalConvenienceScore: number;
  tags: string[];
  operationStatus: OperationStatus;
  lastCheckedAt: string;
};

export type BookingLink = {
  id: string;
  resortId: string;
  type:
    | "official"
    | "official_booking"
    | "naver_booking"
    | "travel_agency"
    | "package";
  label: string;
  url: string;
  memo?: string;
  lastCheckedAt: string;
};

export type RentalShop = {
  id: string;
  resortId: string;
  name: string;
  url?: string;
  mapLinks?: {
    naver?: string;
    kakao?: string;
  };
  equipmentRentalAvailable: boolean;
  clothingRentalAvailable: boolean;
  pickupAvailable?: boolean;
  deliveryAvailable?: boolean;
  liftTicketSalesAvailable?: boolean;
  address?: string;
  phone?: string;
  dataStatus?: "verified_25_26" | "listed_25_26" | "historical_needs_recheck";
  serviceNote?: string;
  distanceMinutes?: number;
  recommendationTags?: string[];
  sourceUrl?: string;
  lastCheckedAt: string;
};

export type DayType = "weekday" | "friday" | "weekend" | "holiday" | "peak" | "all";
export type TimeSlot = "2h" | "3h" | "4h" | "5h" | "6h" | "7h" | "night" | "full_day" | "all";

export type PriceRule = {
  id: string;
  resortId: string;
  season: string;
  itemType: "lift_ticket" | "shuttle_bus";
  label: string;
  validFrom: string;
  validTo: string;
  dayType: DayType;
  timeSlot?: TimeSlot;
  adultPrice?: number;
  childPrice?: number;
  priceMin?: number;
  priceMax?: number;
  sourceType: PriceSourceType;
  sourceName?: string;
  sourceUrl?: string;
  bookingUrl?: string;
  confidence: PriceConfidence;
  lastCheckedAt: string;
  verifiedByHuman: boolean;
  verificationNote?: string;
  memo?: string;
};

export type RentalPriceRule = {
  id: string;
  rentalShopId?: string;
  resortId: string;
  providerType: "resort_official" | "external_shop";
  season: string;
  itemType:
    | "equipment"
    | "clothing"
    | "equipment_clothing_package"
    | "helmet"
    | "goggles"
    | "protective_gear"
    | "lift_ticket";
  timeSlot?: TimeSlot;
  rideType?: RideType | "all";
  ageGroup?: "adult" | "child" | "all";
  label: string;
  validFrom: string;
  validTo: string;
  dayType: DayType;
  representativePrice?: number;
  priceMin?: number;
  priceMax?: number;
  sourceType: PriceSourceType;
  sourceName?: string;
  sourceUrl?: string;
  bookingUrl?: string;
  confidence: PriceConfidence;
  lastCheckedAt: string;
  verifiedByHuman: boolean;
  verificationNote?: string;
  memo?: string;
};

export type DepartureLocation = {
  id: string;
  label: string;
  region: string;
  distances: Record<string, { minutes: number; km: number }>;
};

export type TripInput = {
  visitDate: string;
  departureLocation: string;
  peopleCount: number;
  tripDuration: TripDuration;
  skillLevel: SkillLevel;
  rideType: RideType;
  ownsEquipment: boolean;
  ownsClothing: boolean;
  transportType: TransportType;
  budgetMin?: number;
  budgetMax?: number;
  priorities: Priority[];
  liftTicketTimeSlot: TimeSlot;
  lodgingCostInput?: number;
};

export type CostEstimate = {
  min: number;
  max: number;
  representative: number;
  confidence: PriceConfidence;
  items: CostItem[];
};

export type CostItem = {
  key: string;
  label: string;
  min?: number;
  max?: number;
  representative?: number;
  confidence: PriceConfidence;
  sourceType?: PriceSourceType;
  sourceName?: string;
  sourceUrl?: string;
  bookingUrl?: string;
  lastCheckedAt?: string;
  verifiedByHuman?: boolean;
  note?: string;
};

export type Recommendation = {
  resort: SkiResort;
  score: number;
  reasons: string[];
  travelMinutes?: number;
  travelKm?: number;
  cost: CostEstimate;
  requiredTasks: string[];
  rentalShops: RentalShop[];
};

export type RecommendationCategory = {
  id: "close" | "cheap" | "beginner" | "rental" | "scale" | "night" | "transport";
  label: string;
  description: string;
  recommendations: Recommendation[];
};
