<template>
  <div class="min-h-full bg-gray-50 pb-12">
    <div class="px-4 sm:px-6 lg:px-8 py-5">
      <div class="mb-4 flex justify-end">
        <button
          @click="showCreateModal = true"
          class="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>➕</span>
          <span>Create User</span>
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by username, email, or name..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              v-model="filterRole"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>
          <div>
            <select
              v-model="filterStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Loading users...</p>
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <!-- User Info -->
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-9 w-9">
                      <div class="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {{ user.firstName ? user.firstName.charAt(0) : user.username.charAt(0) }}
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username }}
                      </div>
                      <div class="text-xs text-gray-500">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>

                <!-- Email -->
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>

                <!-- Role -->
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    {{ user.role }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <!-- Joined Date -->
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>

                <!-- Actions -->
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      v-if="!isCurrentUser(user)"
                      @click="toggleUserStatus(user)"
                      :class="[
                        'transition-colors',
                        user.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                      ]"
                    >
                      {{ user.isActive ? '🚫 Deactivate' : '✅ Activate' }}
                    </button>
                    <button
                      v-if="!isCurrentUser(user)"
                      @click="confirmDelete(user)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                    <span v-if="isCurrentUser(user)" class="text-gray-400 text-xs">
                      (Current User)
                    </span>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="paginatedUsers.length === 0">
                <td colspan="6" class="px-4 py-10 text-center text-gray-500">
                  <span class="text-4xl block mb-2">🔍</span>
                  <p class="text-lg font-medium">No users found</p>
                  <p class="text-sm">Try adjusting your search or filters</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > 0" class="mt-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
          <div>
            Showing {{ paginationInfo.start }} to {{ paginationInfo.end }} of {{ paginationInfo.total }} users
          </div>
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="flex items-center gap-2">
              <label for="rows-per-page" class="text-gray-500">Rows per page</label>
              <select
                id="rows-per-page"
                v-model.number="itemsPerPage"
                class="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
            <div class="text-gray-700">
              {{ paginationInfo.start }}-{{ paginationInfo.end }} of {{ paginationInfo.total }}
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="h-8 w-8 inline-flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="h-8 w-8 inline-flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ showEditModal ? '✏️ Edit User' : '➕ Create User' }}
          </h2>
        </div>

        <form @submit.prevent="showEditModal ? updateUser() : createUser()" class="p-6 space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Username <span class="text-red-500">*</span>
            </label>
            <input
              v-model="userForm.username"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="username"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="userForm.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="userForm.password"
              :type="showPassword ? 'text' : 'password'"
              :required="!showEditModal"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <p v-if="showEditModal" class="mt-1 text-xs text-gray-500">
              Leave blank to keep current password
            </p>
          </div>

          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              v-model="userForm.firstName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              v-model="userForm.lastName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Doe"
            />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Role <span class="text-red-500">*</span>
            </label>
            <select
              v-model="userForm.role"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USER">Regular User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="userForm.isActive"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Active Account</span>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 font-semibold transition-all"
            >
              {{ loading ? 'Processing...' : (showEditModal ? 'Update User' : 'Create User') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">⚠️ Delete User</h2>
        </div>

        <div class="p-6">
          <p class="text-gray-700 mb-4">
            Are you sure you want to delete <strong>{{ userToDelete?.username }}</strong>?
          </p>
          <p class="text-sm text-red-600 font-medium mb-6">
            This action cannot be undone. All user data, bookings, and points will be permanently deleted.
          </p>

          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteUser"
              :disabled="loading"
              class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-semibold transition-colors"
            >
              {{ loading ? 'Deleting...' : 'Delete User' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthState } from '~/composables/useAuthState'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { user: currentUser } = useAuthState()

const loading = ref(false)
const error = ref<string | null>(null)
const users = ref<any[]>([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showPassword = ref(false)

const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

const userToDelete = ref<any>(null)
const userToEdit = ref<any>(null)

const userForm = ref({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'USER',
  isActive: true
})

const filteredUsers = computed(() => {
  let filtered = users.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query)
    )
  }

  // Role filter
  if (filterRole.value) {
    filtered = filtered.filter(user => user.role === filterRole.value)
  }

  // Status filter
  if (filterStatus.value !== '') {
    const isActive = filterStatus.value === 'true'
    filtered = filtered.filter(user => user.isActive === isActive)
  }

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

const paginationInfo = computed(() => {
  const total = filteredUsers.value.length
  if (total === 0) {
    return { start: 0, end: 0, total: 0 }
  }
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length)
  return { start, end, total }
})

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const isCurrentUser = (user: any) => {
  return currentUser.value && user.id === currentUser.value.id
}

const loadUsers = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await $fetch('/api/users')
    users.value = response.users
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to load users'
    console.error('Load users error:', err)
  } finally {
    loading.value = false
  }
}

const createUser = async () => {
  loading.value = true
  error.value = null

  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: userForm.value
    })

    await loadUsers()
    closeModal()
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to create user'
    console.error('Create user error:', err)
  } finally {
    loading.value = false
  }
}

const editUser = (user: any) => {
  userToEdit.value = user
  userForm.value = {
    username: user.username,
    email: user.email,
    password: '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    role: user.role,
    isActive: user.isActive
  }
  showEditModal.value = true
}

const updateUser = async () => {
  loading.value = true
  error.value = null

  try {
    // Don't send password if it's empty
    const updateData = !userForm.value.password
      ? {
          username: userForm.value.username,
          email: userForm.value.email,
          firstName: userForm.value.firstName,
          lastName: userForm.value.lastName,
          role: userForm.value.role,
          isActive: userForm.value.isActive
        }
      : { ...userForm.value }

    await $fetch(`/api/users/${userToEdit.value.id}`, {
      method: 'PUT',
      body: updateData
    })

    await loadUsers()
    closeModal()
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to update user'
    console.error('Update user error:', err)
  } finally {
    loading.value = false
  }
}

const toggleUserStatus = async (user: any) => {
  loading.value = true
  error.value = null

  try {
    await $fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      body: {
        ...user,
        isActive: !user.isActive
      }
    })

    await loadUsers()
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to update user status'
    console.error('Toggle user status error:', err)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (user: any) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  loading.value = true
  error.value = null

  try {
    await $fetch(`/api/users/${userToDelete.value.id}`, {
      method: 'DELETE'
    })

    await loadUsers()
    showDeleteModal.value = false
    userToDelete.value = null
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to delete user'
    console.error('Delete user error:', err)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  userForm.value = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    isActive: true
  }
  error.value = null
  userToDelete.value = null
  userToEdit.value = null
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Watch for filter/paging changes to reset pagination
watch([searchQuery, filterRole, filterStatus, itemsPerPage], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadUsers()
})
</script>

