-- AlterTable
ALTER TABLE "attractionsg_events"
ADD COLUMN     "isSelfBookable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "checkoutNotes" TEXT;

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "attractionsg_bookings_stripeSessionId_key" ON "attractionsg_bookings"("stripeSessionId");

-- CreateIndex
CREATE INDEX "attractionsg_bookings_eventId_idx" ON "attractionsg_bookings"("eventId");

-- CreateIndex
CREATE INDEX "attractionsg_bookings_status_idx" ON "attractionsg_bookings"("status");

-- AddForeignKey
ALTER TABLE "attractionsg_bookings" ADD CONSTRAINT "attractionsg_bookings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "attractionsg_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

