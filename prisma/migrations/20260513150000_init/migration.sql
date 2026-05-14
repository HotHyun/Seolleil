CREATE TYPE "SkillLevel" AS ENUM ('first_time', 'beginner', 'intermediate', 'advanced');
CREATE TYPE "RideType" AS ENUM ('ski', 'snowboard');
CREATE TYPE "TransportType" AS ENUM ('car', 'shuttle', 'bus');
CREATE TYPE "TripDuration" AS ENUM ('same_day', 'overnight');
CREATE TYPE "TripStatus" AS ENUM ('planning', 'ready', 'completed', 'archived', 'deleted');
CREATE TYPE "TaskCategory" AS ENUM (
  'lift_ticket',
  'equipment_rental',
  'clothing_rental',
  'transport',
  'lodging',
  'operation_status',
  'gear',
  'safety',
  'custom'
);
CREATE TYPE "TripTaskStatus" AS ENUM (
  'not_needed',
  'needs_check',
  'planned',
  'reserved',
  'paid',
  'prepared'
);

CREATE TABLE "Trip" (
  "id" TEXT NOT NULL,
  "editTokenHash" TEXT NOT NULL,
  "shareTokenHash" TEXT NOT NULL,
  "resortId" TEXT NOT NULL,
  "resortNameSnapshot" TEXT NOT NULL,
  "selectedRecommendation" JSONB,
  "season" TEXT NOT NULL,
  "visitDate" TIMESTAMP(3) NOT NULL,
  "departureLocation" TEXT NOT NULL,
  "peopleCount" INTEGER NOT NULL,
  "skillLevel" "SkillLevel" NOT NULL,
  "rideType" "RideType" NOT NULL,
  "transportType" "TransportType" NOT NULL,
  "tripDuration" "TripDuration" NOT NULL,
  "ownsEquipment" BOOLEAN NOT NULL,
  "ownsClothing" BOOLEAN NOT NULL,
  "needRental" BOOLEAN NOT NULL,
  "needClothing" BOOLEAN NOT NULL,
  "budgetMin" INTEGER,
  "budgetMax" INTEGER,
  "lodgingCostInput" INTEGER,
  "liftTicketTimeSlot" TEXT NOT NULL,
  "selectedRentalShopId" TEXT,
  "selectedRentalOptionId" TEXT,
  "status" "TripStatus" NOT NULL DEFAULT 'planning',
  "archivedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TripTask" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "category" "TaskCategory" NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT true,
  "title" TEXT NOT NULL,
  "status" "TripTaskStatus" NOT NULL DEFAULT 'needs_check',
  "externalUrl" TEXT,
  "dueDate" TIMESTAMP(3),
  "memo" TEXT,
  "sortOrder" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TripTask_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnalyticsEvent" (
  "id" TEXT NOT NULL,
  "tripId" TEXT,
  "eventName" TEXT NOT NULL,
  "properties" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Trip_editTokenHash_key" ON "Trip"("editTokenHash");
CREATE UNIQUE INDEX "Trip_shareTokenHash_key" ON "Trip"("shareTokenHash");
CREATE INDEX "Trip_resortId_idx" ON "Trip"("resortId");
CREATE INDEX "Trip_visitDate_idx" ON "Trip"("visitDate");
CREATE INDEX "TripTask_tripId_category_sortOrder_idx" ON "TripTask"("tripId", "category", "sortOrder");
CREATE INDEX "AnalyticsEvent_eventName_createdAt_idx" ON "AnalyticsEvent"("eventName", "createdAt");
CREATE INDEX "AnalyticsEvent_tripId_idx" ON "AnalyticsEvent"("tripId");

ALTER TABLE "TripTask" ADD CONSTRAINT "TripTask_tripId_fkey"
  FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_tripId_fkey"
  FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
