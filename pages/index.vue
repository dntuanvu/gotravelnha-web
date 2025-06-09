<template>
  <section class="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
    <div class="text-center">
      <!-- Logo -->
      <img src="https://storage.googleapis.com/travella_assets_images/logo.png" alt="Travella" class="mx-auto w-52 sm:w-72 mb-4" />

      <!-- Tagline -->
      <p class="text-lg text-gray-600 mb-6">
        Book your perfect trip with the best travel platforms — all in one place.
      </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!--<SmartAffiliateLink platform="trip" label="Book on Trip.com" />
      <SmartAffiliateLink platform="klook" label="Explore with Klook" />
      <SmartAffiliateLink platform="booking" label="Find Hotels on Booking.com" />-->

      <AffiliateCard
        link="/trip"
        img="https://storage.googleapis.com/travella_assets_images/trip-logo.png"
        desc="Great travel deals, flights, hotels."
      />
      <AffiliateCard
        link="/klook"
        img="https://storage.googleapis.com/travella_assets_images/klook-logo.png"
        desc="Tours, activities & experiences worldwide."
      />
      <AffiliateCard
        link="/agoda"
        img="https://storage.googleapis.com/travella_assets_images/agoda-logo.png"
        desc="Affordable hotels and vacation rentals."
        comingSoon
      />
      <AffiliateCard
        link="/bookingcom"
        img="https://storage.googleapis.com/travella_assets_images/booking-logo.png"
        desc="Hotel and accommodation booking."
        comingSoon
      />
    </div>
  </section>
</template>

<script setup>
import AffiliateCard from '~/components/AffiliateCard.vue'
import SmartAffiliateLink from '~/components/SmartAffiliateLink.vue'
</script>

<style scoped>
section {
  text-align: center;
}
</style>