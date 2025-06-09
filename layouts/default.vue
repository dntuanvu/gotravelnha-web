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
  <div class="flex flex-col min-h-screen">
    <!-- Sticky Top Nav -->
    <header class="fixed top-0 left-0 w-full bg-gray-800 text-white z-50 shadow">
      <nav class="container mx-auto flex items-center justify-between p-4 min-h-[64px]">
        <!-- Logo --> 
        <NuxtLink to="/" @click="navigate('/')" :class="isActive('/')"">
          Home
        </NuxtLink>

        <!-- Toggle Button for Mobile -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="text-white block lg:hidden focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Full Menu -->
        <ul
          :class="[
            'flex flex-col lg:flex-row gap-4 items-center lg:items-stretch lg:gap-6',
            isMenuOpen ? 'block' : 'hidden',
            'absolute lg:relative lg:flex bg-gray-800 lg:bg-transparent top-16 lg:top-auto left-0 w-full lg:w-auto p-4 lg:p-0 z-40'
          ]"
        >
          <li><NuxtLink to="/trip" @click="navigate('/trip')" :class="isActive('/trip')">Trip.com</NuxtLink></li>
          <li><NuxtLink to="/klook" @click="navigate('/klook')" :class="isActive('/klook')">Klook</NuxtLink></li>
          
          <li><span class="text-gray-400 cursor-not-allowed" title="Coming Soon">Agoda</span></li>
          <li><span class="text-gray-400 cursor-not-allowed" title="Coming Soon">Booking.com</span></li>
          <li><NuxtLink to="/contact" @click="navigate('/contact')" :class="isActive('/contact')">Contact Us</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 pt-20 container mx-auto px-4 w-full">
      <NuxtPage />
    </main>

    <!-- Footer: always sticks to bottom -->
    <footer class="bg-gray-100 text-center text-sm text-gray-600 py-4 w-full">
      <p class="mt-2">© {{ new Date().getFullYear() }} GoTravelNha. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
header {
  background-color: #1f2937;
}

ul {
  transition: all 0.3s ease-in-out;
}

.group ul {
  display: none;
}

.group:hover ul {
  display: block !important;
}

.active-link {
  background-color: #ffffff;
  color: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}
</style>
