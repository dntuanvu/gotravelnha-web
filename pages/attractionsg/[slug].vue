<template>
  <div class="relative min-h-screen bg-white">
    <div class="relative mx-auto max-w-6xl px-0 sm:px-4 lg:px-8 pt-0 sm:pt-4 pb-8 sm:pb-12 space-y-0 sm:space-y-6">
      <!-- Loading State -->
      <template v-if="loading">
        <div class="rounded-none sm:rounded-3xl border-0 sm:border border-white/80 bg-white sm:bg-white/70 p-12 shadow-none sm:shadow-2xl backdrop-blur-md">
          <div class="animate-pulse space-y-6">
            <div class="h-64 rounded-none sm:rounded-2xl bg-slate-200/80"></div>
            <div class="h-4 w-3/4 rounded bg-slate-200/80"></div>
            <div class="h-4 w-2/4 rounded bg-slate-200/70"></div>
            <div class="h-24 rounded-none sm:rounded-2xl bg-slate-200/60"></div>
          </div>
        </div>
      </template>

      <!-- Event Detail -->
      <template v-else-if="event">
        <!-- Hero Image (Mobile - Full Width) -->
        <div class="sm:hidden relative h-[280px] overflow-hidden w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] mb-0">
          <button
            v-if="activeImage"
            type="button"
            @click="openLightbox(activeImageIndex)"
            class="absolute inset-0 h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/60 touch-manipulation"
          >
            <img
              :src="activeImage"
              :alt="event.title"
              class="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105 active:scale-100"
            />
          </button>
          <div
            v-else
            class="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-sky-100"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent"></div>
            <div class="relative rounded-full bg-emerald-400 px-8 py-4 text-white shadow-2xl ring-4 ring-white/30">
              <div class="flex items-center justify-center gap-1">
                <span class="text-[#166534] font-black text-2xl tracking-tight">SG</span>
                <span class="text-[#1e3a8a] font-black text-2xl tracking-tight">ATTRACTIONS</span>
              </div>
            </div>
          </div>
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/5 to-transparent"></div>
          <div class="absolute top-3 left-3">
            <NuxtLink
              :to="backUrl"
              class="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg shadow-emerald-500/10 backdrop-blur transition hover:bg-white active:bg-white/90 touch-manipulation"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span class="hidden sm:inline">{{ backLabel }}</span>
              <span class="sm:hidden">Back</span>
            </NuxtLink>
          </div>
        </div>

        <div
          class="relative overflow-hidden rounded-none sm:rounded-[32px] border-0 sm:border border-slate-200 bg-white shadow-none sm:shadow-[0_35px_120px_-35px_rgba(15,23,42,0.35)]"
        >
        <!-- Hero Image (Desktop Only) -->
        <div class="hidden sm:block relative h-[360px] md:h-[420px] overflow-hidden">
          <button
            v-if="activeImage"
            type="button"
            @click="openLightbox(activeImageIndex)"
            class="absolute inset-0 h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/60 touch-manipulation"
          >
            <img
              :src="activeImage"
              :alt="event.title"
              class="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105 active:scale-100"
            />
          </button>
          <div
            v-else
            class="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-sky-100"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent"></div>
            <div class="relative rounded-full bg-emerald-400 px-12 sm:px-12 sm:py-6 text-white shadow-2xl ring-8 ring-white/30">
              <div class="flex items-center justify-center gap-1">
                <span class="text-[#166534] font-black text-4xl tracking-tight">SG</span>
                <span class="text-[#1e3a8a] font-black text-4xl tracking-tight">ATTRACTIONS</span>
              </div>
            </div>
          </div>

          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/5 to-transparent"></div>
          <div class="absolute top-6 left-6">
            <NuxtLink
              :to="backUrl"
              class="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-lg shadow-emerald-500/10 backdrop-blur transition hover:bg-white active:bg-white/90 touch-manipulation"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>{{ backLabel }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Gallery Thumbnails -->
        <div v-if="galleryImages.length > 1" class="px-4 sm:px-6 md:px-10 pt-4 sm:pt-6">
          <div class="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide touch-manipulation">
            <button
              v-for="(image, index) in galleryImages"
              :key="image"
              @click="openLightbox(index)"
              class="relative h-16 w-20 sm:h-20 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-2xl border border-transparent transition shadow-sm sm:shadow-sm active:scale-95 hover:-translate-y-1 hover:border-emerald-400/70 hover:shadow-lg touch-manipulation"
              :class="index === activeImageIndex ? 'border-emerald-500 shadow-lg' : ''"
            >
              <img
                :src="image"
                :alt="`${event.title} photo ${index + 1}`"
                class="h-full w-full object-cover"
              />
              <span
                v-if="index === activeImageIndex"
                class="absolute inset-x-0 bottom-0 z-10 bg-emerald-600/80 py-0.5 sm:py-1 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-white"
              >
                Active
              </span>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4 sm:p-6 md:p-10 lg:p-12">
          <div class="flex flex-col items-start gap-6 sm:gap-8 lg:flex-row lg:gap-12">
          <!-- Main Content -->
          <div class="flex-1 w-full space-y-4 sm:space-y-6 px-0 sm:px-0">
              <div v-if="checkoutStatus === 'success'" class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p class="font-semibold">Payment received!</p>
                  <p>Our team will confirm your booking shortly and email the voucher details.</p>
                </div>
              </div>
              <div v-else-if="checkoutStatus === 'cancel'" class="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="font-semibold">Checkout cancelled.</p>
                  <p>No charges were made. You can restart the booking whenever you’re ready.</p>
                </div>
              </div>

            <div class="space-y-6">
              <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span
                  v-if="event.category"
                  class="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 font-semibold text-emerald-700"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                  </svg>
                  {{ event.category }}
                </span>
                <span
                  v-if="event.location"
                  class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{ event.location }}
                </span>
                <span
                  v-if="event.duration"
                  class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ event.duration }}
                </span>
              </div>

              <div class="space-y-2 sm:space-y-3">
                <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">{{ event.title }}</h1>
                <p
                  v-if="event.subtitle"
                  class="text-sm sm:text-base text-slate-500"
                >
                  {{ event.subtitle }}
                </p>
              </div>

              <div
                v-if="event.publicPrice || event.price || event.originalPrice"
                class="flex flex-wrap items-center gap-3 sm:gap-4 rounded-none sm:rounded-2xl border-0 sm:border border-emerald-100 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-emerald-50/50 sm:from-emerald-500/15 sm:via-teal-500/10 sm:to-emerald-500/15 px-4 sm:px-6 py-4 sm:py-5 text-slate-800 shadow-none sm:shadow-inner"
              >
                <div class="space-y-1">
                  <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-emerald-600">From</span>
                  <div class="flex items-baseline gap-2 sm:gap-3">
                    <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600">
                      {{ event.publicPrice ? formatCurrency(event.publicPrice) : event.price }}
                    </span>
                    <span
                      v-if="event.originalPrice"
                      class="text-sm sm:text-lg text-slate-400 line-through"
                    >
                      {{ event.originalPrice }}
                    </span>
                  </div>
                </div>
                <div
                  v-if="event.rating"
                  class="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/70 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-emerald-700 shadow-sm"
                >
                  <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  {{ event.rating }} / 5
                </div>
              </div>
            </div>

            <div v-if="event.description" class="prose max-w-none">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">About</h2>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{{ event.description }}</p>
            </div>

            <div
              v-if="copyMessage"
              class="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ copyMessage }}</span>
            </div>

            <!-- Ticket Options -->
            <div v-if="hasOptions" ref="optionsSectionRef" class="space-y-4 sm:space-y-5 pt-6 sm:pt-10 border-t border-gray-200">
              <div class="px-0 sm:px-0">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Available Ticket Options</h2>
                <p class="text-gray-600 text-xs sm:text-sm mt-1">
                  Compare packages, promo codes and validity before you book.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:gap-6 max-w-3xl">
                <div
                  v-for="option in ticketOptions"
                  :key="option.code || option.name"
                  class="group relative overflow-hidden rounded-none sm:rounded-3xl border-0 sm:border border-b sm:border-slate-200/70 border-slate-200 bg-transparent sm:bg-white/70 p-4 sm:p-6 shadow-none sm:shadow-[0_18px_48px_-28px_rgba(15,23,42,0.4)] transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98] touch-manipulation"
                  :class="isSelectedOption(option)
                    ? 'bg-emerald-50/50 sm:border-emerald-300/80 sm:shadow-[0_32px_70px_-40px_rgba(16,185,129,0.55)]'
                    : 'hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-[0_28px_70px_-45px_rgba(16,185,129,0.35)]'"
                  role="button"
                  tabindex="0"
                  @click="selectOption(option)"
                  @keydown.enter.prevent="selectOption(option)"
                  @keydown.space.prevent="selectOption(option)"
                >
                  <div
                    class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 transition duration-300"
                    :class="isSelectedOption(option) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                  ></div>

                  <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4">
                    <div class="space-y-2 flex-1">
                      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                          {{ option.name || 'Ticket Option' }}
                        </h3>
                        <span
                          v-if="isSelectedOption(option)"
                          class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-emerald-700"
                        >
                          Selected
                        </span>
                      </div>
                      <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <span
                          v-if="shouldDisplayOptionCode(option)"
                          class="px-2 py-0.5 sm:py-1 bg-emerald-100 text-emerald-700 font-mono rounded-lg text-[10px] sm:text-xs"
                        >
                          {{ option.code }}
                        </span>
                        <span v-if="option.validity" class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-slate-600">
                          <svg class="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"></path>
                          </svg>
                          {{ option.validity }}
                        </span>
                        <span v-if="option.details" class="text-xs sm:text-sm text-gray-500">{{ option.details }}</span>
                      </div>
                    </div>
                    <div class="text-left sm:text-right">
                      <div v-if="option.priceText" class="text-2xl sm:text-3xl font-bold text-emerald-600">
                        {{ option.priceText }}
                      </div>
                      <div
                        v-if="option.originalPriceText && option.originalPriceText !== option.priceText"
                        class="text-gray-400 line-through text-xs sm:text-sm"
                      >
                        {{ option.originalPriceText }}
                      </div>
                      <div
                        v-if="savingsText(option)"
                        class="text-xs sm:text-sm font-semibold text-emerald-600"
                      >
                        {{ savingsText(option) }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                    <button
                      v-if="option.code"
                      @click.stop="copyCode(option.code)"
                      class="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600 active:scale-95 touch-manipulation min-h-[44px]"
                    >
                      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8a2 2 0 002-2V7a2 2 0 00-2-2h-5l-3 3v6a2 2 0 002 2z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 16v2a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h1" />
                      </svg>
                      Copy Code
                    </button>
                    <button
                      @click="handleRequestOption(option)"
                      class="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(16,185,129,0.55)] transition active:scale-95 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 touch-manipulation min-h-[44px]"
                    >
                      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.57-3 3.5S10.343 15 12 15s3-1.57 3-3.5S13.657 8 12 8z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 11.5c0 7-7.5 9.5-7.5 9.5s-7.5-2.5-7.5-9.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      Request via GoVietHub
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="mt-4 sm:mt-6">
              <button
                @click="handleRequestWithoutOption"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(16,185,129,0.55)] transition active:scale-95 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 touch-manipulation min-h-[44px]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.57-3 3.5S10.343 15 12 15s3-1.57 3-3.5S13.657 8 12 8z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 11.5c0 7-7.5 9.5-7.5 9.5s-7.5-2.5-7.5-9.5a7.5 7.5 0 1115 0z" />
                </svg>
                Request via GoVietHub
              </button>
            </div>

            <!-- Additional Info -->
            <div class="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 border-t border-slate-200/70 pt-6 sm:pt-8 md:pt-10 md:grid-cols-2">
              <div
                v-if="event.location"
                class="flex items-start gap-3 sm:gap-4 rounded-none sm:rounded-2xl border-0 sm:border border-b sm:border-slate-200/70 border-slate-200 bg-transparent sm:bg-white/70 p-4 sm:p-5 shadow-none sm:shadow-sm sm:shadow-emerald-500/5"
              >
                <div class="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500">Location</h3>
                  <p class="mt-1 text-sm sm:text-base font-medium text-slate-800">{{ event.location }}</p>
                </div>
              </div>

              <div
                v-if="event.duration"
                class="flex items-start gap-3 sm:gap-4 rounded-none sm:rounded-2xl border-0 sm:border border-b sm:border-slate-200/70 border-slate-200 bg-transparent sm:bg-white/70 p-4 sm:p-5 shadow-none sm:shadow-sm sm:shadow-emerald-500/5"
              >
                <div class="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500">Duration</h3>
                  <p class="mt-1 text-sm sm:text-base font-medium text-slate-800">{{ event.duration }}</p>
                </div>
              </div>

              <div
                v-if="event.ageRestriction"
                class="flex items-start gap-3 sm:gap-4 rounded-none sm:rounded-2xl border-0 sm:border border-b sm:border-slate-200/70 border-slate-200 bg-transparent sm:bg-white/70 p-4 sm:p-5 shadow-none sm:shadow-sm sm:shadow-emerald-500/5"
              >
                <div class="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500">Age Restriction</h3>
                  <p class="mt-1 text-sm sm:text-base font-medium text-slate-800">{{ event.ageRestriction }}</p>
                </div>
              </div>

              <div
                v-if="event.cancellation"
                class="flex items-start gap-3 sm:gap-4 rounded-none sm:rounded-2xl border-0 sm:border border-b sm:border-slate-200/70 border-slate-200 bg-transparent sm:bg-white/70 p-4 sm:p-5 shadow-none sm:shadow-sm sm:shadow-emerald-500/5"
              >
                <div class="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500">Cancellation</h3>
                  <p class="mt-1 text-sm sm:text-base font-medium text-slate-800">{{ event.cancellation }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Sidebar -->
          <div class="w-full lg:w-[360px]">
            <div
              class="sticky top-20 sm:top-24 rounded-none sm:rounded-3xl border-0 sm:border border-t sm:border-emerald-100/80 border-slate-200 p-4 sm:p-6 shadow-none sm:shadow-[0_28px_80px_-40px_rgba(16,185,129,0.45)] backdrop-blur-none sm:backdrop-blur-xl bg-white sm:bg-white"
              ref="bookingFormRef"
            >
              <div class="mb-4 sm:mb-6 flex items-center justify-between">
                <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {{ canSelfBook ? 'Book Your Ticket' : 'Request a Booking' }}
                </h2>
              </div>

              <template v-if="canSelfBook">
                <p class="mb-4 text-xs sm:text-sm text-slate-500">
                  Instant checkout with secure payment powered by Stripe. You'll receive a confirmation email after payment.
                </p>

                <div class="mb-4 sm:mb-6 space-y-3 sm:space-y-4 rounded-none sm:rounded-2xl border-0 sm:border border-b sm:border-emerald-100/80 border-slate-200 bg-transparent sm:bg-white/90 p-0 sm:p-5">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Selected option</p>
                      <p class="mt-1 text-base font-semibold text-slate-900">{{ selectedOptionLabel }}</p>
                    </div>
                    <button
                      type="button"
                      class="text-xs font-semibold text-emerald-600 underline-offset-4 transition hover:underline"
                      @click="scrollToOptions"
                    >
                      Change
                    </button>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <label class="flex flex-col gap-1">
                      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Adults</span>
                      <input
                        v-model.number="quantityAdults"
                        type="number"
                        min="0"
                        step="1"
                        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:py-2 text-base sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 touch-manipulation"
                      />
                    </label>
                    <label class="flex flex-col gap-1">
                      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Children</span>
                      <input
                        v-model.number="quantityChildren"
                        type="number"
                        min="0"
                        step="1"
                        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:py-2 text-base sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 touch-manipulation"
                      />
                    </label>
                  </div>
                </div>

                <div class="space-y-2 rounded-none sm:rounded-2xl border-0 sm:border border-t sm:border-emerald-100/80 border-slate-200 bg-gray-50/50 sm:bg-white/95 p-4 sm:p-5 text-xs sm:text-sm shadow-none sm:shadow-inner">
                  <div class="flex items-center justify-between text-slate-500">
                    <span>Tickets ({{ totalQuantity }} total)</span>
                    <span class="font-semibold text-slate-900">
                      {{ totalQuantity > 0 && unitPublicPrice > 0 ? formatCurrency(unitPublicPrice) + ' each' : '—' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-base font-semibold text-slate-900">
                    <span>Total due today</span>
                    <span>{{ totalDue > 0 ? formatCurrency(totalDue) : '—' }}</span>
                  </div>
                </div>

                <div v-if="cartError" class="rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-600">
                  {{ cartError }}
                </div>
                <div class="flex flex-col gap-3 mt-4">
                  <button
                    type="button"
                    @click="addToCart"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200/80 bg-white px-4 py-3.5 sm:py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 touch-manipulation min-h-[48px]"
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    @click="startCheckout"
                    :disabled="checkoutDisabled"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 sm:py-3 text-sm font-semibold text-white shadow-[0_18px_38px_-18px_rgba(16,185,129,0.65)] transition active:scale-[0.98] hover:from-emerald-600 hover:to-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:transform-none touch-manipulation min-h-[48px]"
                  >
                    <span v-if="checkoutLoading" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{{ checkoutLoading ? 'Redirecting…' : 'Checkout' }}</span>
                  </button>
                </div>
                
                <div
                  v-if="cartConfirmed && !checkoutLoading"
                  class="mt-3 rounded-xl sm:rounded-2xl border border-emerald-200/80 bg-emerald-50 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-emerald-700 shadow-none sm:shadow-inner"
                >
                  <p class="font-semibold">Cart ready for checkout</p>
                  <p class="mt-1">Review the summary above, then click "Checkout" to pay securely via Stripe.</p>
                </div>

                <p class="mt-4 text-[10px] sm:text-xs text-slate-500">
                  After payment, our team will place the order using our reseller credentials and email you the e-ticket.
                </p>
                <p v-if="checkoutError" class="text-xs sm:text-sm font-medium text-red-600 mt-2">{{ checkoutError }}</p>
              </template>
              <template v-else>
                <div class="space-y-5">
                  <div class="rounded-2xl border border-slate-200/80 bg-white/90 p-4">
                    <div class="flex items-start gap-3">
                      <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        ✉️
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-slate-800">Ready to book?</p>
                        <p class="text-xs text-slate-500">
                          Leave your details and our experts will confirm availability and pricing.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <BookingRequestForm
                      :event-title="event.title"
                      :event-price="formattedTotalDue || event.price || ''"
                      :selected-option="selectedOptionForForm || undefined"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        </div>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col items-center justify-center gap-6 rounded-[32px] border border-slate-200 bg-white p-16 text-center shadow-[0_35px_120px_-35px_rgba(15,23,42,0.25)]">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 via-white to-emerald-200 text-3xl">
            🔍
          </div>
          <div class="space-y-3">
            <h3 class="text-3xl font-bold text-slate-900">
              {{ notFound ? 'This attraction is unavailable right now' : 'Event not found' }}
            </h3>
            <p class="max-w-xl text-base text-slate-500">
              {{
                notFound
                  ? 'This experience has been unpublished or is temporarily unavailable. Please browse our other Singapore attractions.'
                  : 'The requested attraction could not be found. It may have expired or the link is incorrect.'
              }}
            </p>
          </div>
          <NuxtLink
            to="/attractionsg"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_-18px_rgba(16,185,129,0.6)] transition hover:from-emerald-600 hover:to-teal-600"
          >
            Browse all attractions
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </NuxtLink>
        </div>
      </template>
      <ClientOnly>
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm touch-manipulation"
          @click.self="closeLightbox"
        >
          <button
            type="button"
            class="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 transition hover:text-white active:scale-90 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            @click="closeLightbox"
            aria-label="Close lightbox"
          >
            <svg class="h-6 w-6 sm:h-8 sm:w-8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="w-full max-w-4xl px-3 sm:px-4">
            <div class="relative">
              <img
                :src="galleryImages[lightboxIndex]"
                :alt="`${event?.title} enlarged photo ${lightboxIndex + 1}`"
                class="h-auto w-full rounded-xl sm:rounded-2xl bg-black/20 object-contain shadow-2xl max-h-[85vh] sm:max-h-[90vh]"
              />
              <div
                v-if="galleryImages.length > 1"
                class="absolute inset-x-0 bottom-2 sm:bottom-3 flex justify-between items-center px-3 sm:px-4 text-xs sm:text-sm text-white/80"
              >
                <button
                  type="button"
                  class="transition hover:text-white active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 touch-manipulation px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-black/30 backdrop-blur-sm min-h-[44px]"
                  @click.stop="prevLightboxImage"
                  :disabled="galleryImages.length <= 1"
                  aria-label="Previous image"
                >
                  ‹ Prev
                </button>
                <span class="px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-sm">{{ lightboxIndex + 1 }} / {{ galleryImages.length }}</span>
                <button
                  type="button"
                  class="transition hover:text-white active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 touch-manipulation px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-black/30 backdrop-blur-sm min-h-[44px]"
                  @click.stop="nextLightboxImage"
                  :disabled="galleryImages.length <= 1"
                  aria-label="Next image"
                >
                  Next ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import BookingRequestForm from '~/components/BookingRequestForm.vue'

const route = useRoute()
const router = useRouter()
const loading = ref<boolean>(true)
const event = ref<Record<string, any> | null>(null)
const notFound = ref<boolean>(false)

// Smart back navigation based on referrer
const backUrl = computed(() => {
  const from = route.query.from as string | undefined
  
  if (from === 'search') {
    // Build search URL with preserved query params
    const searchParams = new URLSearchParams()
    if (route.query.searchQuery) searchParams.set('q', route.query.searchQuery as string)
    if (route.query.searchLocation) searchParams.set('location', route.query.searchLocation as string)
    if (route.query.searchCategory) searchParams.set('category', route.query.searchCategory as string)
    if (route.query.searchPlatforms) {
      const platforms = Array.isArray(route.query.searchPlatforms) 
        ? route.query.searchPlatforms 
        : [route.query.searchPlatforms]
      platforms.forEach(p => searchParams.append('platforms', p as string))
    }
    
    const queryString = searchParams.toString()
    return `/search${queryString ? `?${queryString}` : ''}`
  }
  
  // Fallback: check document.referrer if available (for browser back button cases)
  if (process.client && typeof document !== 'undefined') {
    const referrer = document.referrer
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer)
        // If referrer is from search page
        if (referrerUrl.pathname === '/search' || referrerUrl.pathname.includes('/search')) {
          // Extract search params from referrer
          const searchQuery = referrerUrl.searchParams.get('q')
          if (searchQuery) {
            const searchParams = new URLSearchParams()
            searchParams.set('q', searchQuery)
            referrerUrl.searchParams.forEach((value, key) => {
              if (['location', 'category', 'platforms'].includes(key)) {
                searchParams.append(key, value)
              }
            })
            return `/search?${searchParams.toString()}`
          }
          return '/search'
        }
      } catch (e) {
        // Invalid URL, ignore
      }
    }
  }
  
  // Default: go back to attractions listing page
  return '/attractionsg'
})

const backLabel = computed(() => {
  const from = route.query.from as string | undefined
  if (from === 'search') return 'Back to Search'
  
  // Check referrer as fallback
  if (process.client && typeof document !== 'undefined') {
    const referrer = document.referrer
    if (referrer && referrer.includes('/search')) {
      return 'Back to Search'
    }
  }
  
  return 'Back to Attractions'
})
const selectedOption = ref<Record<string, any> | null>(null)
const bookingFormRef = ref<HTMLElement | null>(null)
const copyMessage = ref<string>('')
let copyTimeout: ReturnType<typeof setTimeout> | null = null
const checkoutLoading = ref<boolean>(false)
const checkoutError = ref<string>('')
const checkoutStatus = ref<string>('')
const quantityAdults = ref<number>(1)
const quantityChildren = ref<number>(0)
const cartError = ref<string>('')
const cartConfirmed = ref<boolean>(false)
const runtimeConfig = useRuntimeConfig()
const stripePercent = Number(runtimeConfig.public?.stripeFeePercent ?? 0.034)
const stripeFixed = Number(runtimeConfig.public?.stripeFeeFixed ?? 0.5)

const requestURL = useRequestURL()
const baseUrl = computed(() => `${requestURL.protocol}//${requestURL.host}`)

const clampCount = (value: unknown) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.max(0, Math.floor(value))
}

const toNumber = (value: unknown) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }
  const parsed = parseFloat(String(value ?? ''))
  return Number.isFinite(parsed) ? parsed : null
}

const formatCurrency = (amount: number) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return ''
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD'
  }).format(amount)
}

const shouldDisplayOptionCode = (option: any) => {
  const code = typeof option?.code === 'string' ? option.code.trim() : ''
  if (!code) return false
  const eventIds = [event.value?.id, event.value?.slug].filter(Boolean)
  if (eventIds.includes(code)) return false
  if (/^[a-z0-9-]{20,}$/i.test(code) && code.includes('-')) return false
  return true
}

const initialSlugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const currentSlug = ref(initialSlugParam)

const { data: initialEventData } = await useAsyncData<{ event?: Record<string, any> }>(
  `attractionsg-event-${initialSlugParam}`,
  () => $fetch(`/api/attractionsg/event/${initialSlugParam}`)
)

if (initialEventData.value?.event) {
  event.value = initialEventData.value.event as Record<string, any>
  loading.value = false
}

const ticketOptions = computed<Record<string, any>[]>(() => {
  const sourceOptions =
    (event.value?.options as Record<string, any>[] | undefined) ??
    (event.value?.raw?.options as Record<string, any>[] | undefined) ??
    []

  if (Array.isArray(sourceOptions) && sourceOptions.length > 0) {
    return sourceOptions.map((option) => {
      const amount = toNumber(option?.priceAmount ?? option?.price) ?? null
      return {
        ...option,
        priceAmount: amount,
        priceText: option?.priceText || (amount ? formatCurrency(amount) : null),
        originalPriceText: option?.originalPriceText ?? option?.originalPrice ?? null
      }
    })
  }

  if (!event.value) return []

  const fallbackPrice =
    toNumber(event.value.publicPrice) ??
    toNumber(event.value.priceAmount) ??
    toNumber(event.value.originalPriceAmount) ??
    null

  return [
    {
      code: event.value.id,
      name: event.value.title || 'General Admission',
      priceText: fallbackPrice ? formatCurrency(fallbackPrice) : event.value.priceText || null,
      priceAmount: fallbackPrice,
      description: event.value.description || null
    }
  ]
})

const galleryImages = computed<string[]>(() => {
  const images = [
    event.value?.image as string | undefined,
    ...(Array.isArray(event.value?.gallery) ? (event.value?.gallery as string[]) : [])
  ].filter((value, index, self) => value && self.indexOf(value) === index)
  return images as string[]
})

const activeImageIndex = ref(0)
const activeImage = computed(() => galleryImages.value[activeImageIndex.value] || null)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const optionsSectionRef: Ref<HTMLElement | null> = ref(null)

const estimateStripeFeeLocal = (amount: number) => {
  if (!amount || Number.isNaN(amount) || amount <= 0) return 0
  return amount * stripePercent + stripeFixed
}

const unitPublicPrice = computed<number>(() => {
  const eventPublic = toNumber(event.value?.publicPrice)
  const optionPublic = toNumber(selectedOption.value?.publicPrice)
  const optionPrice = toNumber(selectedOption.value?.priceAmount ?? selectedOption.value?.price)
  const eventPrice = toNumber(event.value?.priceAmount)
  const eventOriginal = toNumber(event.value?.originalPriceAmount)
  return optionPublic ?? optionPrice ?? eventPublic ?? eventPrice ?? eventOriginal ?? 0
})

const unitResellerPrice = computed<number>(() => {
  const optionPrice = toNumber(selectedOption.value?.priceAmount ?? selectedOption.value?.price)
  const eventReseller = toNumber(event.value?.resellerPriceAmount)
  const eventPrice = toNumber(event.value?.priceAmount)
  const eventOriginal = toNumber(event.value?.originalPriceAmount)
  return optionPrice ?? eventReseller ?? eventPrice ?? eventOriginal ?? 0
})

const totalQuantity = computed<number>(() => {
  const adults = clampCount(quantityAdults.value)
  const children = clampCount(quantityChildren.value)
  return adults + children
})

const totalDue = computed<number>(() => {
  if (!unitPublicPrice.value || totalQuantity.value <= 0) return 0
  return Number((unitPublicPrice.value * totalQuantity.value).toFixed(2))
})

const cartReady = computed(() => !!selectedOption.value && totalQuantity.value > 0 && unitPublicPrice.value > 0)

const checkoutDisabled = computed(() => checkoutLoading.value || !cartConfirmed.value || !cartReady.value)

const selectedOptionLabel = computed<string>(() => {
  if (!selectedOption.value) return 'Select a ticket option'
  return selectedOption.value.name || selectedOption.value.code || 'Selected option'
})

const selectedOptionForForm = computed<Record<string, any> | null>(() => {
  if (!selectedOption.value) return null
  const adults = clampCount(quantityAdults.value)
  const children = clampCount(quantityChildren.value)
  return {
    ...selectedOption.value,
    priceText:
      selectedOption.value.priceText ||
      (unitPublicPrice.value > 0 ? formatCurrency(unitPublicPrice.value) : null),
    adultCount: adults,
    childCount: children,
    totalPriceText: totalDue.value > 0 ? formatCurrency(totalDue.value) : null
  }
})

const formattedTotalDue = computed<string>(() =>
  totalDue.value > 0 ? formatCurrency(totalDue.value) : event.value?.price || ''
)

const stripeFeeTotal = computed<number>(() => {
  if (totalDue.value <= 0) return 0
  return Number(estimateStripeFeeLocal(totalDue.value).toFixed(2))
})

const totalResellerCost = computed<number | null>(() => {
  if (!unitResellerPrice.value || totalQuantity.value <= 0) return null
  return Number((unitResellerPrice.value * totalQuantity.value).toFixed(2))
})

const openLightbox = (index = activeImageIndex.value) => {
  const images = galleryImages.value
  if (!images.length) return
  const clamped = Math.max(0, Math.min(index, images.length - 1))
  activeImageIndex.value = clamped
  lightboxIndex.value = clamped
  lightboxOpen.value = true
  if (typeof document !== 'undefined') {
    document.body.classList.add('overflow-hidden')
  }
}

const closeLightbox = () => {
  lightboxOpen.value = false
  if (typeof document !== 'undefined') {
    document.body.classList.remove('overflow-hidden')
  }
}

const nextLightboxImage = () => {
  const images = galleryImages.value
  if (images.length <= 1) return
  const next = (lightboxIndex.value + 1) % images.length
  lightboxIndex.value = next
  activeImageIndex.value = next
}

const prevLightboxImage = () => {
  const images = galleryImages.value
  if (images.length <= 1) return
  const prev = (lightboxIndex.value - 1 + images.length) % images.length
  lightboxIndex.value = prev
  activeImageIndex.value = prev
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeLightbox()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextLightboxImage()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prevLightboxImage()
  }
}

const hasOptions = computed(() => ticketOptions.value.length > 0)
const canSelfBook = computed(() => !!event.value?.isSelfBookable)

const savingsText = (option: Record<string, any>) => {
  if (!option?.originalPriceAmount || !option?.priceAmount) return ''
  const diff = option.originalPriceAmount - option.priceAmount
  if (diff <= 0) return ''
  return `Save ${formatCurrency(diff)}`
}

const filterPublished = (items: Record<string, any>[]) => {
  return (items || []).filter((item: Record<string, any>) => item && item.isPublished === true)
}

const handleRequestOption = (option: Record<string, any>) => {
  selectOption(option)
  nextTick(() => {
    bookingFormRef.value?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  })
}

const handleRequestWithoutOption = () => {
  selectedOption.value = null
  nextTick(() => {
    bookingFormRef.value?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  })
}

const copyCode = async (code: string) => {
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
    copyMessage.value = `Copied ${code} to clipboard`
  } catch (err) {
    console.error('Clipboard error:', err)
    copyMessage.value = 'Copy failed, please copy manually.'
  } finally {
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copyMessage.value = ''
    }, 4000)
  }
}

const resolveImageUrl = (image?: string | null) => {
  if (!image) return `${baseUrl.value}/sg-attractions-logo.svg`
  if (image.startsWith('//')) return `https:${image}`
  if (/^https?:\/\//i.test(image)) return image
  return `${baseUrl.value}${image.startsWith('/') ? image : `/${image}`}`
}

const handleCheckoutQuery = () => {
  const statusParam = Array.isArray(route.query.checkout)
    ? route.query.checkout[0]
    : route.query.checkout
  if (!statusParam) {
    checkoutStatus.value = ''
    checkoutError.value = ''
    return
  }
  checkoutError.value = ''
  checkoutStatus.value = String(statusParam)
  router.replace({
    query: {
      ...route.query,
      checkout: undefined
    }
  })
}

const startCheckout = async () => {
  if (!event.value) return
  cartError.value = ''
  if (!cartReady.value) {
    cartError.value = 'Select a ticket option and quantity before checkout.'
    return
  }
  if (!cartConfirmed.value) {
    cartError.value = 'Please add the ticket to your cart before checkout.'
    return
  }
  if (!cartConfirmed.value) {
    cartError.value = 'Please add the ticket to your cart before checkout.'
    return
  }
  checkoutError.value = ''
  checkoutLoading.value = true
  try {
    const adults = clampCount(quantityAdults.value)
    const children = clampCount(quantityChildren.value)
    const selected = selectedOption.value
    const payload: Record<string, any> = {
      eventId: event.value.id,
      quantity: Math.max(totalQuantity.value, 1),
      selectedOption: selected
        ? {
            code: selected.code ?? null,
            name: selected.name ?? null,
            priceText: selected.priceText ?? null
          }
        : null,
      cart: {
        optionCode: selected?.code ?? null,
        optionName: selected?.name ?? null,
        unitPrice: Number(unitPublicPrice.value.toFixed(2)),
        quantity: Math.max(totalQuantity.value, 1),
        adultCount: adults,
        childCount: children,
        totalPrice: Number(totalDue.value.toFixed(2)),
        stripeFeeEstimate: stripeFeeTotal.value,
        resellerCost: totalResellerCost.value,
        unitResellerPrice: unitResellerPrice.value ?? null
      }
    }

    const response = await $fetch<{ success: boolean; url?: string; message?: string }>('/api/checkout/create', {
      method: 'POST',
      body: payload
    })
    if (response?.url) {
      window.location.href = response.url
    } else {
      checkoutError.value = response?.message || 'Unable to start checkout. Please try again.'
    }
  } catch (err: any) {
    checkoutError.value = err?.data?.message || err?.message || 'Unable to start checkout. Please try again.'
  } finally {
    checkoutLoading.value = false
  }
}

const selectOption = (option: Record<string, any>) => {
  selectedOption.value = option
  cartConfirmed.value = false
  nextTick(() => {
    optionsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const isSelectedOption = (option: Record<string, any>) => {
  if (!selectedOption.value) return false
  if (option?.code && selectedOption.value?.code) {
    return option.code === selectedOption.value.code
  }
  if (option?.name && selectedOption.value?.name) {
    return option.name === selectedOption.value.name
  }
  return false
}

const addToCart = () => {
  cartError.value = ''
  checkoutError.value = ''
  if (!cartReady.value) {
    cartError.value = 'Select a ticket option and quantity before adding to cart.'
    return
  }
  cartConfirmed.value = true
  cartError.value = ''
}

const scrollToOptions = () => {
  optionsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const shareImage = computed(() => resolveImageUrl(activeImage.value || event.value?.image))
const pageTitle = computed(() =>
  event.value ? `${event.value.title} | Singapore Attractions Deals | GoVietHub` : 'Attraction Details | GoVietHub'
)
const pageDescription = computed(() =>
  event.value?.description || 'Book Singapore attractions with exclusive deals from GoVietHub.'
)
const canonicalUrl = computed(() =>
  `${baseUrl.value}/attractionsg/${event.value?.slug || event.value?.id || currentSlug.value || ''}`
)

watch(
  ticketOptions,
  (options: Record<string, any>[]) => {
    if (!Array.isArray(options) || options.length === 0) {
      selectedOption.value = null
      return
    }
    const current = selectedOption.value
    if (!current) {
      selectedOption.value = options[0]
      return
    }

    const matchByCode = current.code
      ? options.find((option: Record<string, any>) => option?.code === current.code)
      : null
    const matchByName = !matchByCode && current.name
      ? options.find((option: Record<string, any>) => option?.name === current.name)
      : null
    const matchedOption = (matchByCode || matchByName || options[0]) as Record<string, any>
    if (matchedOption !== current) {
      selectedOption.value = matchedOption
    }
  },
  { immediate: true }
)

watch(quantityAdults, (value: number) => {
  if (!Number.isFinite(value) || value < 0) {
    quantityAdults.value = 0
  }
})

watch(quantityChildren, (value: number) => {
  if (!Number.isFinite(value) || value < 0) {
    quantityChildren.value = 0
  }
})

watch([selectedOption, quantityAdults, quantityChildren], () => {
  cartError.value = ''
})

onMounted(async () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }

  if (event.value) {
    handleCheckoutQuery()
    return
  }

  console.log(`🔍 Looking for event with slug/ID: ${currentSlug.value}`)
  notFound.value = false
  
  try {
    // Fetch all events (slug already contains the ID)
    let allEvents: Record<string, any>[] = []
    
    try {
      console.log('📡 Trying API endpoint...')
      const res = await $fetch('/api/attractionsg/events', {
        method: 'POST',
        body: {
          limit: 1000 // Get all events to find by ID
        }
      })
      console.log('📊 Detail page API response:', res)
      allEvents = filterPublished(res.data || [])
      console.log(`✅ API returned ${allEvents.length} events`)
    } catch (apiErr) {
      console.error('❌ API error, trying direct fetch:', apiErr)
    }
    
    console.log(`📊 Total events loaded: ${allEvents.length}`)
    console.log(
      `🔍 First 3 event IDs:`,
      allEvents.slice(0, 3).map((e: Record<string, any>) => e.id)
    )
    
    // Find the matching event by ID
    const foundEvent = allEvents.find(
      (e: Record<string, any>) => e.slug === currentSlug.value || e.id === currentSlug.value
    )
    
    if (foundEvent) {
      console.log(`✅ Found event: ${foundEvent.title}`)
      event.value = foundEvent
      notFound.value = false
      currentSlug.value = foundEvent.slug || foundEvent.id || currentSlug.value
      if (foundEvent.slug && foundEvent.slug !== initialSlugParam) {
        console.log(`🔄 Updating slug in URL to canonical slug: ${foundEvent.slug}`)
        navigateTo(`/attractionsg/${foundEvent.slug}`, { replace: true })
      }
      handleCheckoutQuery()
    } else {
      console.error(`❌ Event not found or unpublished with slug/ID: ${currentSlug.value}`)
      notFound.value = true
    }
  } catch (err) {
    console.error('❌ Error loading event:', err)
  } finally {
    loading.value = false
  }
})

watch(
  () => event.value,
  (value: Record<string, any> | null) => {
    if (!value) {
      selectedOption.value = null
      activeImageIndex.value = 0
      checkoutStatus.value = ''
      checkoutError.value = ''
      lightboxIndex.value = 0
      lightboxOpen.value = false
    } else {
      activeImageIndex.value = 0
      lightboxIndex.value = 0
    }
  }
)

watch(
  galleryImages,
  (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    activeImageIndex.value = 0
    lightboxIndex.value = 0
    lightboxOpen.value = false
    return
  }
  if (activeImageIndex.value >= images.length) {
    activeImageIndex.value = 0
  }
  if (lightboxIndex.value >= images.length) {
    lightboxIndex.value = activeImageIndex.value
  }
  },
  { immediate: true }
)

watch(
  () => route.query.checkout,
  () => {
    if (event.value) {
      handleCheckoutQuery()
    }
  }
)

watch(
  lightboxOpen,
  (isOpen) => {
    if (!isOpen && typeof document !== 'undefined') {
      document.body.classList.remove('overflow-hidden')
    }
  }
)

// SEO
useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:description', content: pageDescription.value },
    { property: 'og:image', content: shareImage.value },
    { property: 'og:image:secure_url', content: shareImage.value },
    { property: 'og:image:alt', content: event.value?.title || 'GoVietHub Attraction' },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'GoVietHub' },
    ...(event.value?.publishedAt
      ? [{ property: 'article:published_time', content: new Date(event.value.publishedAt).toISOString() }]
      : []),
    ...(event.value?.category ? [{ property: 'article:section', content: event.value.category }] : []),
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle.value },
    { name: 'twitter:description', content: pageDescription.value },
    { name: 'twitter:image', content: shareImage.value },
    { name: 'twitter:image:alt', content: event.value?.title || 'GoVietHub Attraction' }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl.value }
  ]
}))

onUnmounted(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (typeof document !== 'undefined') {
    document.body.classList.remove('overflow-hidden')
  }
})
</script>
