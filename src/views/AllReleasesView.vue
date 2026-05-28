<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ReleaseCard from '../components/ReleaseCard.vue'
import SearchBox from '../components/SearchBox.vue'
import SortSelect from '../components/SortSelect.vue'

const search = ref('')
const sortBy = ref('date-desc')
const filterLabels = ref([])
const showFilter = ref(false)
const filterDropdownRef = ref(null)
const currentPage = ref(1)
const perPage = 8

const releases = ref([])
const labels = ref([])

const sortOptions = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'artist', label: 'Artist A-Z' },
  { value: 'label', label: 'Label A-Z' }
]

onMounted(async () => {
  try {
    const [releasesResponse, labelsResponse] = await Promise.all([
      fetch('http://localhost:3000/api/releases'),
      fetch('http://localhost:3000/api/labels')
    ])

    releases.value = await releasesResponse.json()
    labels.value = await labelsResponse.json()

    document.addEventListener('click', handleClickOutside)
  } catch (error) {
    console.error('Error loading releases:', error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const filteredReleases = computed(() => {
  let result = [...releases.value]

  if (filterLabels.value.length > 0) {
    result = result.filter(r =>
        filterLabels.value.includes(r.label_id)
    )
  }

  const q = search.value.toLowerCase().trim()

  if (q) {
    result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.artists.join(' ').toLowerCase().includes(q) ||
        r.label_name.toLowerCase().includes(q)
    )
  }

  switch (sortBy.value) {
    case 'date-desc':
      result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      break

    case 'date-asc':
      result.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      break

    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break

    case 'artist':
      result.sort((a, b) =>
          a.artists.join(', ').localeCompare(b.artists.join(', '))
      )
      break

    case 'label':
      result.sort((a, b) => a.label_name.localeCompare(b.label_name))
      break
  }

  return result
})

const totalPages = computed(() =>
    Math.ceil(filteredReleases.value.length / perPage)
)

const paginatedReleases = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredReleases.value.slice(start, start + perPage)
})

watch([search, sortBy, filterLabels], () => {
  currentPage.value = 1
})

function toggleFilter() {
  showFilter.value = !showFilter.value
}

function resetFilters() {
  search.value = ''
  sortBy.value = 'date-desc'
  filterLabels.value = []
  showFilter.value = false
  currentPage.value = 1
}

function handleClickOutside(e) {
  if (
      filterDropdownRef.value &&
      !filterDropdownRef.value.contains(e.target)
  ) {
    showFilter.value = false
  }
}
</script>

<template>
  <main>
    <section class="container" style="padding-top: 48px;">
      <h1 class="section-title">All Releases</h1>
      <div class="toolbar">
        <SearchBox v-model="search" placeholder="Search tracks, artists..." />
        <div class="filter-dropdown" ref="filterDropdownRef">
          <button class="filter-btn" @click="toggleFilter">
            {{ filterLabels.length ? filterLabels.length + ' selected' : 'All Labels' }} ▾
          </button>
          <div v-if="showFilter" class="filter-menu">
            <label v-for="l in labels" :key="l.id" class="filter-option">
              <input type="checkbox" :value="l.id" v-model="filterLabels" />
              {{ l.name }}
            </label>
            <button class="filter-clear" @click="filterLabels = []">Clear all</button>
          </div>
        </div>
        <SortSelect v-model="sortBy" :options="sortOptions" @click="showFilter = false" />
        <button class="reset-btn" @click="resetFilters">Reset</button>
      </div>

      <div class="release-list" v-if="paginatedReleases.length">
        <ReleaseCard
            v-for="release in paginatedReleases"
            :key="release.id"
            :release="release"
            :label-id="release.label_id"
            :label-name="release.label_name"
            :show-label="true"
        />
      </div>

      <div class="empty-state" v-else>
        <p>No releases match your filters.</p>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button @click="currentPage--" :disabled="currentPage === 1">‹</button>
        <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="{ active: currentPage === page }"
        >{{ page }}</button>
        <button @click="currentPage++" :disabled="currentPage === totalPages">›</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}


.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 32px;
}

.filter-dropdown {
  position: relative;
}

.filter-btn {
  padding: 10px 14px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.filter-btn:hover {
  border-color: var(--accent);
}

.filter-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px;
  z-index: 50;
  min-width: 220px;
  box-shadow: var(--shadow-card);
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: var(--transition);
}

.filter-option:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.filter-option input[type="checkbox"] {
  accent-color: var(--accent);
}

.filter-clear {
  width: 100%;
  padding: 8px 12px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
  color: var(--accent-light);
  font-size: 0.8rem;
  cursor: pointer;
  text-align: center;
  background: none;
  border-left: none;
  border-right: none;
  border-bottom: none;
}

.filter-clear:hover {
  color: var(--text-primary);
}

.reset-btn {
  padding: 10px 14px;
  background: var(--bg-card);
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.reset-btn:hover {
  color: var(--text-primary);
}

.release-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 32px 0 60px;
}

.pagination button {
  padding: 8px 14px;
  background: var(--bg-card);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.pagination button:hover {
  color: var(--text-primary);
  background: var(--bg-card-hover);
}

.pagination button.active {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.pagination button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}
</style>