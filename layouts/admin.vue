<template>
  <div class="admin-layout min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
        'w-64 bg-gray-800 text-white overflow-hidden',
        'pt-16'
      ]"
    >
      <!-- Sidebar Menu -->
      <nav class="px-3 py-4 overflow-y-auto h-[calc(100vh-4rem)]" :class="sidebarCollapsed && isDesktop ? 'px-2' : ''">
        <ul class="space-y-2">
          <!-- Dashboard -->
          <li>
            <NuxtLink
              to="/admin"
              @click="closeSidebar"
              :class="[
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                sidebarCollapsed && isDesktop ? 'justify-center' : '',
                isActiveRoute('/admin') && (!$route.path.startsWith('/admin/') || $route.path === '/admin')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
              :title="sidebarCollapsed && isDesktop ? 'Dashboard' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed && isDesktop ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span v-show="!sidebarCollapsed || !isDesktop">Dashboard</span>
            </NuxtLink>
          </li>

          <!-- Users -->
          <li>
            <NuxtLink
              to="/admin/users"
              @click="closeSidebar"
              :class="[
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                sidebarCollapsed && isDesktop ? 'justify-center' : '',
                $route.path === '/admin/users'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
              :title="sidebarCollapsed && isDesktop ? 'Users' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed && isDesktop ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span v-show="!sidebarCollapsed || !isDesktop">Users</span>
            </NuxtLink>
          </li>

          <!-- Analytics -->
          <li>
            <NuxtLink
              to="/admin/analytics"
              @click="closeSidebar"
              :class="[
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                sidebarCollapsed && isDesktop ? 'justify-center' : '',
                $route.path === '/admin/analytics'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
              :title="sidebarCollapsed && isDesktop ? 'Analytics' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed && isDesktop ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span v-show="!sidebarCollapsed || !isDesktop">Analytics</span>
            </NuxtLink>
          </li>

          <!-- Scrapers with Sub-menu -->
          <li class="relative">
            <div>
              <button
                @click="handleScrapersMenuClick"
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  sidebarCollapsed && isDesktop ? 'justify-center' : '',
                  isScraperRoute
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                ]"
                :title="sidebarCollapsed && isDesktop ? 'Scraper Management' : ''"
              >
                <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed && isDesktop ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span v-show="!sidebarCollapsed || !isDesktop" class="flex-1 text-left">Scraper Management</span>
                <svg
                  v-if="!sidebarCollapsed || !isDesktop"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="scrapersMenuOpen ? 'rotate-180' : ''"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <!-- Sub-menu - Visible when expanded -->
              <ul
                v-if="scrapersMenuOpen && (!sidebarCollapsed || !isDesktop)"
                class="mt-1 ml-4 space-y-1 border-l-2 border-gray-700 pl-3"
              >
                <li>
                  <NuxtLink
                    to="/admin/scrapers"
                    @click="closeSidebar"
                    :class="[
                      'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                      $route.path === '/admin/scrapers' || $route.path === '/admin/scrapers/'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    ]"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                    <span>Overview</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/admin/scrapers/klook"
                    @click="closeSidebar"
                    :class="[
                      'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                      $route.path === '/admin/scrapers/klook'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    ]"
                  >
                    <span class="mr-2">🎯</span>
                    <span>Klook Events</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/admin/scrapers/trip"
                    @click="closeSidebar"
                    :class="[
                      'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                      $route.path === '/admin/scrapers/trip'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    ]"
                  >
                    <span class="mr-2">🏨</span>
                    <span>Trip Events</span>
                  </NuxtLink>
                </li>
              </ul>
              
              <!-- Dropdown menu when collapsed -->
              <Teleport to="body">
                <div
                  v-if="scrapersMenuOpen && sidebarCollapsed && isDesktop"
                  class="fixed left-16 top-20 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
                  @click.stop
                >
                  <NuxtLink
                    to="/admin/scrapers"
                    @click="scrapersMenuOpen = false"
                    :class="[
                      'flex items-center px-4 py-2 text-sm transition-colors border-b border-gray-700 mb-1',
                      $route.path === '/admin/scrapers' || $route.path === '/admin/scrapers/'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    ]"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                    <span>Overview</span>
                  </NuxtLink>
                  <NuxtLink
                    to="/admin/scrapers/klook"
                    @click="scrapersMenuOpen = false"
                    :class="[
                      'flex items-center px-4 py-2 text-sm transition-colors',
                      $route.path === '/admin/scrapers/klook'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    ]"
                  >
                    <span class="mr-3 text-lg">🎯</span>
                    <span>Klook Events</span>
                  </NuxtLink>
                  <NuxtLink
                    to="/admin/scrapers/trip"
                    @click="scrapersMenuOpen = false"
                    :class="[
                      'flex items-center px-4 py-2 text-sm transition-colors',
                      $route.path === '/admin/scrapers/trip'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    ]"
                  >
                    <span class="mr-3 text-lg">🏨</span>
                    <span>Trip Events</span>
                  </NuxtLink>
                </div>
              </Teleport>
            </div>
          </li>

          <!-- Divider -->
          <li class="pt-4 mt-4 border-t border-gray-700">
            <span v-show="!sidebarCollapsed || !isDesktop" class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Public Pages</span>
          </li>

          <!-- Trip.com -->
          <li>
            <NuxtLink
              to="/trip"
              @click="closeSidebar"
              :class="[
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                sidebarCollapsed && isDesktop ? 'justify-center' : '',
                'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
              :title="sidebarCollapsed && isDesktop ? 'Trip.com' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed && isDesktop ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span v-show="!sidebarCollapsed || !isDesktop">Trip.com</span>
            </NuxtLink>
          </li>

          <!-- Klook -->
          <li>
            <NuxtLink
              to="/klook"
              @click="closeSidebar"
              :class="[
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                sidebarCollapsed && isDesktop ? 'justify-center' : '',
                'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
              :title="sidebarCollapsed && isDesktop ? 'Klook' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed && isDesktop ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>
              <span v-show="!sidebarCollapsed || !isDesktop">Klook</span>
            </NuxtLink>
          </li>

          <!-- Divider -->
          <li class="pt-4 mt-4 border-t border-gray-700">
            <span v-show="!sidebarCollapsed || !isDesktop" class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</span>
          </li>

          <!-- Home -->
          <li>
            <NuxtLink
              to="/"
              @click="closeSidebar"
              :class="[
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                sidebarCollapsed && isDesktop ? 'justify-center' : '',
                'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
              :title="sidebarCollapsed && isDesktop ? 'Home' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" :class="sidebarCollapsed && isDesktop ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span v-show="!sidebarCollapsed || !isDesktop">Back to Home</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen && !isDesktop"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>

    <!-- Top Navbar - Full Width -->
    <nav class="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center shadow-sm transition-all duration-300" :class="sidebarCollapsed && isDesktop ? 'lg:pl-16' : 'lg:pl-64'">
      <div class="flex items-center px-4 w-full">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <!-- Sidebar Collapse Button (Desktop) -->
        <button
          v-if="isDesktop"
          @click="toggleSidebarCollapse"
          class="hidden lg:flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-2"
          title="Toggle sidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!sidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
          </svg>
        </button>

        <div class="flex-1 flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h1>
          
          <div class="flex items-center gap-4">
            <!-- User menu -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                <span class="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- User dropdown -->
              <div
                v-if="userMenuOpen"
                @click.stop
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <NuxtLink
                  to="/user"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </NuxtLink>
                <NuxtLink
                  to="/"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Back to Site
                </NuxtLink>
                <hr class="my-1">
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div :class="['transition-all duration-300 pt-16', sidebarCollapsed && isDesktop ? 'lg:pl-16' : 'lg:pl-64']">
      <!-- Page Content -->
      <main class="min-h-[calc(100vh-4rem)]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthState } from '~/composables/useAuthState'

const route = useRoute()
const router = useRouter()
const { user, clearUser } = useAuthState()

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const userMenuOpen = ref(false)
const isDesktop = ref(false)
const scrapersMenuOpen = ref(false)

// Handle scrapers menu click - navigate to overview when collapsed, toggle menu when expanded
const handleScrapersMenuClick = () => {
  if (sidebarCollapsed.value && isDesktop.value) {
    // When collapsed, show dropdown or navigate to overview
    scrapersMenuOpen.value = !scrapersMenuOpen.value
  } else {
    // When expanded, toggle the sub-menu
    scrapersMenuOpen.value = !scrapersMenuOpen.value
  }
}

// Page titles based on route
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/users': 'User Management',
    '/admin/analytics': 'Analytics',
    '/admin/scrapers': 'Scraper Management',
    '/admin/scrapers/klook': 'Klook Events',
    '/admin/scrapers/trip': 'Trip Events',
  }
  
  // Check if path matches any route (including dynamic routes)
  if (titles[route.path]) {
    return titles[route.path]
  }
  
  // Fallback for scraper routes
  if (route.path.startsWith('/admin/scrapers')) {
    if (route.path.includes('klook')) return 'Klook Events'
    if (route.path.includes('trip')) return 'Trip Events'
    return 'Scraper Management'
  }
  
  return 'Admin Portal'
})

const isActiveRoute = (path) => {
  if (path === '/admin') {
    return route.path === '/admin' || route.path === '/admin/'
  }
  return route.path === path || route.path.startsWith(path + '/')
}

const isScraperRoute = computed(() => {
  return route.path.startsWith('/admin/scrapers')
})

const closeSidebar = () => {
  if (!isDesktop.value) {
    sidebarOpen.value = false
  }
}

const toggleSidebarCollapse = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  // Save to localStorage
  if (process.client) {
    localStorage.setItem('adminSidebarCollapsed', sidebarCollapsed.value.toString())
  }
}

const logout = async () => {
  clearUser()
  userMenuOpen.value = false
  router.push('/')
}

// Check screen size
const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) {
    sidebarOpen.value = false // Desktop doesn't need overlay
  }
}

// Close menus when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    userMenuOpen.value = false
  }
  // Close scrapers menu when clicking outside (when collapsed)
  if (sidebarCollapsed.value && isDesktop.value && scrapersMenuOpen.value) {
    // Check if click is outside the scrapers menu button and dropdown
    const scrapersButton = target.closest('li.relative')
    const scrapersDropdown = target.closest('.fixed.left-16')
    if (!scrapersButton && !scrapersDropdown) {
      scrapersMenuOpen.value = false
    }
  }
}

// Load sidebar state from localStorage
const loadSidebarState = () => {
  if (process.client) {
    const saved = localStorage.getItem('adminSidebarCollapsed')
    if (saved !== null) {
      sidebarCollapsed.value = saved === 'true'
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', checkScreenSize)
  checkScreenSize()
  loadSidebarState()
  
  // Auto-collapse on mobile by default
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
  
  // Auto-expand scrapers menu if on a scraper route or attractionsg route
  if (route.path.startsWith('/admin/scrapers')) {
    scrapersMenuOpen.value = true
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', checkScreenSize)
})

// Watch route changes to close mobile sidebar and auto-open scrapers menu
watch(() => route.path, (newPath) => {
  if (!isDesktop.value) {
    sidebarOpen.value = false
  }
  // Auto-expand scrapers menu if on a scraper route or attractionsg route
  if (newPath.startsWith('/admin/scrapers')) {
    scrapersMenuOpen.value = true
  }
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}
</style>
