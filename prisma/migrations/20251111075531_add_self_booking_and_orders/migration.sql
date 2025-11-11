-- Add new columns to attractionsg_events for self-booking controls
ALTER TABLE "attractionsg_events"
ADD COLUMN IF NOT EXISTS "isSelfBookable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT,
ADD COLUMN IF NOT EXISTS "checkoutNotes" TEXT;

-- Create bookings table if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'attractionsg_bookings'
  ) THEN
    CREATE TABLE "attractionsg_bookings" (
      "id" TEXT NOT NULL,
      "eventId" TEXT NOT NULL,
      "eventTitle" TEXT NOT NULL,
      "eventSlug" TEXT,
      "quantity" INTEGER NOT NULL DEFAULT 1,
      "amount" DOUBLE PRECISION NOT NULL,
      "currency" TEXT NOT NULL DEFAULT 'SGD',
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "stripeSessionId" TEXT NOT NULL,
      "stripePaymentIntentId" TEXT,
      "customerEmail" TEXT,
      "customerName" TEXT,
      "customerPhone" TEXT,
      "optionCode" TEXT,
      "optionName" TEXT,
      "metadata" JSONB,
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "attractionsg_bookings_pkey" PRIMARY KEY ("id")
    );
  END IF;
END
$$;

-- Ensure indexes exist
CREATE UNIQUE INDEX IF NOT EXISTS "attractionsg_bookings_stripeSessionId_key"
  ON "attractionsg_bookings"("stripeSessionId");

CREATE INDEX IF NOT EXISTS "attractionsg_bookings_eventId_idx"
  ON "attractionsg_bookings"("eventId");

CREATE INDEX IF NOT EXISTS "attractionsg_bookings_status_idx"
  ON "attractionsg_bookings"("status");

-- Add foreign key constraint if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'attractionsg_bookings_eventId_fkey'
  ) THEN
    ALTER TABLE "attractionsg_bookings"
    ADD CONSTRAINT "attractionsg_bookings_eventId_fkey"
    FOREIGN KEY ("eventId") REFERENCES "attractionsg_events"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;
/*
  Warnings:

  - The `status` column on the `attractionsg_bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "attractionsg_bookings" DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "attractionsg_bookings_status_idx" ON "attractionsg_bookings"("status");
