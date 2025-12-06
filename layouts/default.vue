<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthState } from '~/composables/useAuthState';
import Logo from '~/components/Logo.vue';

const isMenuOpen = ref(false);
const isProfileDropdownOpen = ref(false);
const route = useRoute();
const router = useRouter();

// Auth state
const { user, setUser, clearUser, isAuthenticated, isAdmin } = useAuthState();

const runtimeConfig = useRuntimeConfig();

const isFeatureEnabled = (value) => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return !['false', '0', 'off', 'no'].includes(normalized);
  }
  return Boolean(value);
};

const showBestDealsNav = computed(() => isFeatureEnabled(runtimeConfig.public?.enableBestDealsNav));
const showCompareNav = computed(() => isFeatureEnabled(runtimeConfig.public?.enableCompareNav));

const isActive = (path) => {
  return route.path === path ? 'active-link' : '';
};

const navigate = (path) => {
  router.push(path);
  isMenuOpen.value = false; // Close mobile menu on navigation
};

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// Prevent body scroll when menu is open
watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const logout = async () => {
  // Clear user from state
  clearUser();
  isProfileDropdownOpen.value = false;
  
  // Redirect to home
  router.push('/');
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const target = event.target;
  if (isProfileDropdownOpen.value && !target.closest('.relative')) {
    isProfileDropdownOpen.value = false;
  }
};

// Check for logged-in user on mount
onMounted(() => {
  // Session will be managed by the login system
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <div class="flex flex-col min-h-screen bg-white-50">
    <!-- Sticky Top Nav -->
    <header class="fixed top-0 left-0 w-full bg-white/98 backdrop-blur-md text-slate-900 z-50 shadow-sm border-b border-slate-200/80">
      <nav class="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 min-h-[70px] sm:min-h-[76px]">
        <!-- Left Side: Logo + Hamburger -->
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <!-- Toggle Button for Mobile -->
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="text-slate-700 block lg:hidden focus:outline-none p-2.5 touch-manipulation active:bg-slate-100 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
            </svg>
          </button>

          <!-- Logo --> 
          <NuxtLink 
            to="/" 
            @click="navigate('/')" 
            class="flex items-center gap-2 sm:gap-2.5 font-bold text-lg sm:text-xl text-slate-900 hover:text-emerald-600 transition-colors group touch-manipulation"
          >
            <div class="relative">
              <Logo :size="'32'" class="sm:w-9 sm:h-9" />
              <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span class="hidden xs:inline bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-teal-600 transition-all">GoVietHub</span>
          </NuxtLink>
        </div>

        <!-- Center: Navigation Menu (Desktop Only) -->
        <ul class="hidden lg:flex flex-row gap-1 items-center">
          <li>
            <NuxtLink 
              to="/klook" 
              @click="navigate('/klook')" 
              :class="['nav-link', isActive('/klook')]"
              class="px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              <KlookIcon :size="18" />
              Klook
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/trip" 
              @click="navigate('/trip')" 
              :class="['nav-link', isActive('/trip')]"
              class="px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              <span class="mr-1.5">🏨</span>
              Trip.com
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/attractionsg" 
              @click="navigate('/attractionsg')" 
              :class="['nav-link', isActive('/attractionsg')]"
              class="px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              <span class="mr-1.5">🎫</span>
              SG Attractions
            </NuxtLink>
          </li>
          <li v-if="showBestDealsNav">
            <NuxtLink 
              to="/deals" 
              @click="navigate('/deals')" 
              :class="['nav-link', isActive('/deals')]"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all group relative text-sm font-semibold text-orange-700 hover:text-orange-800 border border-orange-200/50"
            >
              <div class="inline-flex items-center gap-1.5">
                <span class="text-lg group-hover:scale-110 transition-transform">🔥</span>
                <span class="font-bold">Best Deals</span>
                </div>
            </NuxtLink>
          </li>
          <li v-if="showCompareNav">
            <NuxtLink 
              to="/compare" 
              @click="navigate('/compare')" 
              :class="['nav-link', isActive('/compare')]"
              class="px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              <span class="mr-1.5">🔍</span>
              Compare
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/contact" 
              @click="navigate('/contact')" 
              :class="['nav-link', isActive('/contact')]"
              class="px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all text-sm font-semibold text-slate-700 hover:text-emerald-600"
            >
              <span class="mr-1.5">📧</span>
              Contact
            </NuxtLink>
          </li>
        </ul>

        <!-- Right Side: Login/Avatar (Always Visible) -->
        <ClientOnly>
          <div class="flex items-center gap-3 flex-shrink-0">
            <!-- Login or Profile Dropdown -->
            <div v-if="!isAuthenticated" class="relative">
              <NuxtLink 
                to="/login" 
                @click="navigate('/login')" 
                :class="['nav-link', isActive('/login')]"
                class="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 active:scale-95 transition-all font-semibold text-sm sm:text-base text-white shadow-md hover:shadow-lg min-h-[44px] flex items-center justify-center touch-manipulation"
              >
                <span class="mr-1.5">🔐</span>
                <span class="hidden sm:inline">Login</span>
                <span class="sm:hidden">Login</span>
              </NuxtLink>
            </div>
            
            <!-- Profile Dropdown -->
            <div v-else class="relative">
            <button
              @click="toggleProfileDropdown"
              class="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors border border-slate-200/50 touch-manipulation min-h-[44px]"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {{ user.firstName ? user.firstName.charAt(0) : user.username.charAt(0) }}
              </div>
              <span class="hidden lg:block text-sm font-semibold text-slate-700">{{ user.firstName || user.username }}</span>
              <svg class="w-4 h-4 text-slate-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div
              v-if="isProfileDropdownOpen"
              class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 overflow-hidden backdrop-blur-sm"
            >
              <NuxtLink
                to="/user"
                @click="isProfileDropdownOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                My Profile
              </NuxtLink>
              <div v-if="isAdmin">
                <NuxtLink
                  to="/admin"
                  @click="isProfileDropdownOpen = false"
                  class="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Admin Portal
                </NuxtLink>
              </div>
              <hr class="my-2 border-slate-200">
              <button
                @click="logout"
                class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
          </div>
          
          <template #fallback>
            <div class="flex items-center gap-3 flex-shrink-0">
              <div class="w-20 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </template>
        </ClientOnly>
      </nav>

      <!-- Mobile: Native Style Side Drawer with Backdrop -->
      <Teleport to="body">
        <!-- Backdrop Overlay -->
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isMenuOpen"
            @click="closeMenu"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            aria-hidden="true"
          ></div>
        </Transition>

        <!-- Side Drawer -->
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-250 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
        >
          <aside
            v-if="isMenuOpen"
            class="fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-[70] lg:hidden shadow-2xl flex flex-col overflow-hidden"
          >
            <!-- Drawer Header -->
            <div class="flex items-center justify-between p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div class="flex items-center gap-3">
                <Logo :size="'32'" />
                <span class="font-bold text-lg text-slate-900">GoVietHub</span>
              </div>
              <button
                @click="closeMenu"
                class="p-2 rounded-full hover:bg-white/80 active:bg-white transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg class="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Navigation Items -->
            <nav class="flex-1 overflow-y-auto py-4 px-4">
              <ul class="flex flex-col gap-2">
                <li>
                  <NuxtLink 
                    to="/klook" 
                    @click="navigate('/klook')" 
                    :class="['nav-link', isActive('/klook')]"
                    class="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-700 font-semibold text-base touch-manipulation min-h-[56px]"
                  >
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50">
                      <KlookIcon :size="24" />
                    </div>
                    <span>Klook</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/trip" 
                    @click="navigate('/trip')" 
                    :class="['nav-link', isActive('/trip')]"
                    class="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-700 font-semibold text-base touch-manipulation min-h-[56px]"
                  >
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                      <span class="text-2xl">🏨</span>
                    </div>
                    <span>Trip.com</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/attractionsg" 
                    @click="navigate('/attractionsg')" 
                    :class="['nav-link', isActive('/attractionsg')]"
                    class="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-700 font-semibold text-base touch-manipulation min-h-[56px]"
                  >
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50">
                      <span class="text-2xl">🎫</span>
                    </div>
                    <span>SG Attractions</span>
                  </NuxtLink>
                </li>
                <li v-if="showBestDealsNav">
                  <NuxtLink 
                    to="/deals" 
                    @click="navigate('/deals')" 
                    :class="['nav-link', isActive('/deals')]"
                    class="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 active:from-orange-200 active:to-red-200 transition-all border-2 border-orange-200/60 text-orange-700 font-bold text-base touch-manipulation min-h-[56px]"
                  >
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100">
                      <span class="text-2xl">🔥</span>
                    </div>
                    <span class="flex-1">Best Deals</span>
                    <span class="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full">!</span>
                  </NuxtLink>
                </li>
                <li v-if="showCompareNav">
                  <NuxtLink 
                    to="/compare" 
                    @click="navigate('/compare')" 
                    :class="['nav-link', isActive('/compare')]"
                    class="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-700 font-semibold text-base touch-manipulation min-h-[56px]"
                  >
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50">
                      <span class="text-2xl">🔍</span>
                    </div>
                    <span>Compare</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/contact" 
                    @click="navigate('/contact')" 
                    :class="['nav-link', isActive('/contact')]"
                    class="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-700 font-semibold text-base touch-manipulation min-h-[56px]"
                  >
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50">
                      <span class="text-2xl">📧</span>
                    </div>
                    <span>Contact</span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>

            <!-- Drawer Footer (User section) -->
            <div v-if="isAuthenticated" class="p-4 border-t border-slate-200 bg-slate-50">
              <div class="flex items-center gap-3 px-2 py-2">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {{ user.firstName ? user.firstName.charAt(0) : user.username.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-900 truncate">{{ user.firstName || user.username }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ user.email }}</p>
                </div>
              </div>
            </div>
          </aside>
        </Transition>
      </Teleport>
    </header>

    <!-- Main Content -->
    <main class="flex-1 pt-20 sm:pt-24 md:pt-28 container mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <NuxtPage />
    </main>

    <!-- Footer: always sticks to bottom -->
    <footer class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8 sm:py-12 w-full border-t border-slate-700/50 mt-12 sm:mt-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-6 sm:mb-8">
          <!-- About -->
          <div class="sm:col-span-2 md:col-span-1">
            <div class="flex items-center gap-2.5 mb-3 sm:mb-4">
              <Logo :size="'28'" />
              <h3 class="font-bold text-lg text-white">GoVietHub</h3>
            </div>
            <p class="text-slate-300 text-sm mb-3 leading-relaxed">
              Your one-stop destination for comparing and booking the best travel deals across multiple platforms.
            </p>
            <p class="text-slate-400 text-xs italic">
              (formerly known as GoTravelNha)
            </p>
          </div>
          
          <!-- Links -->
          <div>
            <h3 class="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">Quick Links</h3>
            <ul class="space-y-2 sm:space-y-2.5 text-sm">
              <li>
                <NuxtLink to="/trip" class="text-slate-300 hover:text-emerald-400 active:text-emerald-300 transition-colors flex items-center gap-2 group touch-manipulation py-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-emerald-400 transition-colors"></span>
                  Trip.com Deals
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/klook" class="text-slate-300 hover:text-emerald-400 active:text-emerald-300 transition-colors flex items-center gap-2 group touch-manipulation py-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-emerald-400 transition-colors"></span>
                  Klook Activities
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/attractionsg" class="text-slate-300 hover:text-emerald-400 active:text-emerald-300 transition-colors flex items-center gap-2 group touch-manipulation py-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-emerald-400 transition-colors"></span>
                  SG Attractions
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-slate-300 hover:text-emerald-400 active:text-emerald-300 transition-colors flex items-center gap-2 group touch-manipulation py-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-emerald-400 transition-colors"></span>
                  Contact Us
                </NuxtLink>
              </li>
            </ul>
          </div>
          
          <!-- Contact Info -->
          <div>
            <h3 class="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">Stay Connected</h3>
            <p class="text-slate-300 text-sm mb-4 leading-relaxed">
              Get the latest travel deals and exclusive offers delivered to your inbox.
            </p>
            <div class="flex items-center gap-3">
              <button class="w-12 h-12 sm:w-10 sm:h-10 rounded-xl sm:rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-emerald-600 active:bg-emerald-700 transition-colors cursor-pointer touch-manipulation">
                <span class="text-lg sm:text-base">📧</span>
              </button>
              <button class="w-12 h-12 sm:w-10 sm:h-10 rounded-xl sm:rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-emerald-600 active:bg-emerald-700 transition-colors cursor-pointer touch-manipulation">
                <span class="text-lg sm:text-base">💬</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="border-t border-slate-700/50 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center md:text-left">
          <p class="text-slate-400 text-xs sm:text-sm">
            © {{ new Date().getFullYear() }} GoVietHub. All rights reserved.
          </p>
          <div class="flex items-center gap-4 sm:gap-6 text-xs text-slate-500">
            <a href="#" class="hover:text-slate-300 active:text-slate-200 transition-colors touch-manipulation py-1">Privacy Policy</a>
            <a href="#" class="hover:text-slate-300 active:text-slate-200 transition-colors touch-manipulation py-1">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
ul {
  transition: all 0.3s ease-in-out;
}

.group ul {
  display: none;
}

.group:hover ul {
  display: block !important;
}

.nav-link.active-link {
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  color: #ffffff;
  font-weight: bold;
}

.nav-link:hover {
  background-color: rgba(15, 23, 42, 0.05);
}
</style>
