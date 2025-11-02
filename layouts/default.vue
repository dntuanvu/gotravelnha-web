<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);
const route = useRoute();
const router = useRouter();

const isActive = (path) => {
  return route.path === path ? 'active-link' : '';
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};
const navigate = (path) => {
  router.push(path);
  closeDropdown();
};

</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Sticky Top Nav -->
    <header class="fixed top-0 left-0 w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white z-50 shadow-lg backdrop-blur-sm border-b border-slate-600/20">
      <nav class="container mx-auto flex items-center justify-between p-4 min-h-[72px]">
        <!-- Logo --> 
        <NuxtLink 
          to="/" 
          @click="navigate('/')" 
          class="flex items-center gap-2 font-bold text-xl hover:text-blue-300 transition-colors"
        >
          <span class="text-2xl">✈️</span>
          <span>GoTravelNha</span>
        </NuxtLink>

        <!-- Toggle Button for Mobile -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="text-white block lg:hidden focus:outline-none p-2 hover:bg-slate-600/30 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
          </svg>
        </button>

        <!-- Full Menu -->
        <ul
          :class="[
            'flex flex-col lg:flex-row gap-3 items-center lg:items-stretch',
            isMenuOpen ? 'block' : 'hidden',
            'absolute lg:relative lg:flex bg-slate-700 lg:bg-transparent top-16 lg:top-auto left-0 w-full lg:w-auto p-4 lg:p-0 z-40 rounded-lg lg:rounded-none'
          ]"
        >
          <li>
            <NuxtLink 
              to="/attractionsg" 
              @click="navigate('/attractionsg')" 
              :class="['nav-link-sg', isActive('/attractionsg')]"
              class="px-4 py-2 rounded-lg transition-all"
            >
              <div class="bg-yellow-400 rounded-full px-3 py-1 shadow-md inline-flex items-center transition-transform hover:scale-105">
                <span class="text-[#166534] font-black text-sm tracking-tight">SG</span>
                <span class="text-[#1e3a8a] font-black text-sm tracking-tight">ATTRACTIONS</span>
              </div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/trip" 
              @click="navigate('/trip')" 
              :class="['nav-link', isActive('/trip')]"
              class="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span class="mr-1">🏨</span>
              Trip.com
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/klook" 
              @click="navigate('/klook')" 
              :class="['nav-link', isActive('/klook')]"
              class="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span class="mr-1">🎯</span>
              Klook
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/contact" 
              @click="navigate('/contact')" 
              :class="['nav-link', isActive('/contact')]"
              class="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span class="mr-1">📧</span>
              Contact
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 pt-24 container mx-auto px-4 w-full">
      <NuxtPage />
    </main>

    <!-- Footer: always sticks to bottom -->
    <footer class="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white py-8 w-full border-t border-slate-600/20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <!-- About -->
          <div>
            <h3 class="font-bold text-lg mb-4">About GoTravelNha</h3>
            <p class="text-slate-300 text-sm">
              Your one-stop destination for comparing and booking the best travel deals across multiple platforms.
            </p>
          </div>
          
          <!-- Links -->
          <div>
            <h3 class="font-bold text-lg mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/trip" class="text-slate-300 hover:text-blue-400 transition-colors">Trip.com Deals</NuxtLink></li>
              <li><NuxtLink to="/klook" class="text-slate-300 hover:text-blue-400 transition-colors">Klook Activities</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-slate-300 hover:text-blue-400 transition-colors">Contact Us</NuxtLink></li>
            </ul>
          </div>
          
          <!-- Contact Info -->
          <div>
            <h3 class="font-bold text-lg mb-4">Stay Connected</h3>
            <p class="text-slate-300 text-sm mb-3">
              Get the latest travel deals and exclusive offers delivered to your inbox.
            </p>
          </div>
        </div>
        
        <div class="border-t border-slate-600/30 pt-6 text-center">
          <p class="text-slate-400 text-sm">
            © {{ new Date().getFullYear() }} GoTravelNha. All rights reserved.
          </p>
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  font-weight: bold;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Special hover effect for SG Attractions - no background, just scale */
.nav-link-sg:hover {
  background-color: transparent;
}

.nav-link-sg.active-link .bg-yellow-400 {
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
  background-color: rgba(251, 191, 36, 1);
}
</style>
