# 기획 단계 데이터 모델

구현 과정에서 필드명은 바뀔 수 있다. 이 문서는 제품 기획 기준의 데이터 구조를 정리한다.

## 데이터 저장 경계

### Static 코드 데이터

- 스키장 기본 정보.
- 시즌별 가격 규칙.
- 셔틀/버스 가격.
- 성수기 기간.
- 공휴일/특수일 규칙.

### PostgreSQL 저장 데이터

- 사용자 계정.
- 사용자가 생성한 트립.
- 트립 체크리스트.
- editToken/shareToken 해시.
- 사용자가 선택한 추천 결과 스냅샷.
- 외부 링크 클릭 등 제품 핵심 이벤트.

## 추천 결과 저장 정책

- 추천 후보 전체를 저장하지 않는다.
- 사용자가 선택한 추천 결과의 스냅샷만 트립에 저장한다.
- 가격/스키장 static 데이터가 나중에 바뀌더라도 사용자가 선택한 당시의 핵심 맥락을 보존한다.

## 트립 생성 전 임시 저장 정책

- MVP에서는 트립 생성 전 임시 입력값을 서버에 저장하지 않는다.
- 사용자가 스키장을 선택하고 트립을 생성하는 시점부터 DB에 저장한다.

## User

```ts
type User = {
  id: string;
  email?: string;
  name?: string;
  emailVerified?: string;
  image?: string;
};
```

인증 관련 `Account`, `Session`, `VerificationToken`, `Authenticator` 모델은 Auth.js Prisma Adapter 표준 모델을 사용한다.

## Account Link Policy

- 트립은 `userId` 없이 생성될 수 있다.
- 로그인 사용자가 트립을 생성하면 `userId`를 저장한다.
- 비로그인 트립은 edit link로 접근한 뒤 로그인하면 계정에 연결할 수 있다.
- 하나의 트립은 한 명의 소유 사용자에게 연결한다.
- 공유 링크 접근자는 트립 소유자가 아니며 읽기 권한만 가진다.

## Ski Resort

```ts
type SkiResort = {
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
  tags: string[];
  operationStatus:
    | "operating"
    | "season_pending"
    | "temporarily_closed"
    | "closed"
    | "unknown";
};
```

## Booking Link

```ts
type BookingLink = {
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
```

## Rental Shop

```ts
type RentalShop = {
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
  recommendationTags?: string[];
  sourceUrl?: string;
  lastCheckedAt: string;
};
```

## Rental Price Rule

```ts
type RentalPriceRule = {
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
    | "protective_gear";
  rideType?: "ski" | "snowboard" | "all";
  ageGroup?: "adult" | "child" | "all";
  label: string;
  validFrom: string;
  validTo: string;
  dayType:
    | "weekday"
    | "friday"
    | "weekend"
    | "holiday"
    | "peak"
    | "all";
  representativePrice?: number;
  priceMin?: number;
  priceMax?: number;
  sourceType:
    | "official_site"
    | "official_booking"
    | "naver_booking"
    | "smartstore"
    | "travel_agency"
    | "phone";
  sourceUrl?: string;
  confidence:
    | "confirmed"
    | "estimated"
    | "phone_confirmed"
    | "unavailable";
  lastCheckedAt: string;
  memo?: string;
};
```

## Trip

```ts
type Trip = {
  id: string;
  userId?: string;
  editToken: string;
  shareToken: string;
  resortId: string;
  season: string;
  date: string;
  departureLocation: string;
  peopleCount: number;
  skillLevel: "first_time" | "beginner" | "intermediate" | "advanced";
  rideType: "ski" | "snowboard";
  transportType: "car" | "shuttle" | "bus";
  needRental: boolean;
  needClothing: boolean;
  lodgingCostInput?: number;
  budgetMin?: number;
  budgetMax?: number;
  liftTicketTimeSlot: string;
  status: "planning" | "ready" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
};
```

## Trip Task

```ts
type TripTask = {
  id: string;
  tripId: string;
  category:
    | "lift_ticket"
    | "equipment_rental"
    | "clothing_rental"
    | "transport"
    | "lodging"
    | "operation_status"
    | "gear"
    | "safety"
    | "custom";
  isDefault: boolean;
  title: string;
  status:
    | "not_needed"
    | "needs_check"
    | "planned"
    | "reserved"
    | "paid"
    | "prepared";
  externalUrl?: string;
  dueDate?: string;
  memo?: string;
  sortOrder: number;
};
```

## Price Rule

```ts
type PriceRule = {
  resortId: string;
  season: string;
  itemType:
    | "lift_ticket"
    | "equipment_rental"
    | "clothing_rental"
    | "equipment_clothing_package"
    | "shuttle_bus";
  label: string;
  validFrom: string;
  validTo: string;
  dayType:
    | "weekday"
    | "friday"
    | "weekend"
    | "holiday"
    | "peak"
    | "all";
  timeSlot?: "2h" | "3h" | "4h" | "6h" | "night" | "full_day" | "all";
  adultPrice?: number;
  childPrice?: number;
  priceMin?: number;
  priceMax?: number;
  sourceType:
    | "official_site"
    | "official_booking"
    | "naver_booking"
    | "smartstore"
    | "travel_agency"
    | "phone";
  sourceUrl?: string;
  confidence:
    | "confirmed"
    | "estimated"
    | "phone_confirmed"
    | "unavailable";
  lastCheckedAt: string;
  verifiedByHuman: boolean;
  memo?: string;
};
```

## Transport Estimate

```ts
type TransportEstimate = {
  tripId: string;
  transportType: "car" | "shuttle" | "bus";
  origin: string;
  destinationResortId: string;
  distanceKm?: number;
  fuelEfficiencyKmPerL?: number;
  fuelPricePerL?: number;
  tollEstimate?: number;
  parkingFee?: number;
  shuttlePrice?: number;
  busPrice?: number;
  totalEstimate: number;
};
```

## Analytics Event

```ts
type AnalyticsEvent = {
  id: string;
  tripId?: string;
  eventName:
    | "trip_created"
    | "resort_selected"
    | "task_status_changed"
    | "trip_deleted"
    | "external_link_clicked"
    | "share_page_viewed";
  properties?: Record<string, unknown>;
  createdAt: string;
};
```
