<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ReleaseCard from '../components/ReleaseCard.vue'
import SearchBox from '../components/SearchBox.vue'
import SortSelect from '../components/SortSelect.vue'

const route = useRoute()
const search = ref('')
const sortBy = ref('date-desc')
const label = ref(null)
const loading = ref(true)

const sortOptions = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
]

async function loadLabel() {
  loading.value = true

  try {
    const response = await fetch(`http://localhost:3000/api/labels/${route.params.id}`)

    if (!response.ok) {
      label.value = null
      return
    }

    label.value = await response.json()
  } catch (error) {
    console.error('Error loading label:', error)
    label.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadLabel)

watch(
    () => route.params.id,
    () => loadLabel()
)

const filteredReleases = computed(() => {
  if (!label.value) return []

  let result = [...label.value.releases]

  const q = search.value.toLowerCase().trim()

  if (q) {
    result = result.filter(release =>
        release.title.toLowerCase().includes(q) ||
        release.artists.join(' ').toLowerCase().includes(q)
    )
  }

  switch (sortBy.value) {
    case 'date-desc':
      result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      break
    case 'date-asc':
      result.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      break
  }

  return result
})
</script>

<template>
  <main v-if="!loading && label">
    <section class="detail-header container">
      <RouterLink to="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Labels
      </RouterLink>
      <div class="detail-hero">
        <div class="detail-logo">
          <img v-if="label.logo" :src="label.logo" :alt="label.name + ' logo'" />
          <span v-else>{{ label.shortName }}</span>
        </div>
        <div class="detail-info">
          <h1>{{ label.name }}</h1>
          <p>{{ label.description }}</p>
        </div>
      </div>
    </section>

    <section class="releases-section container">
      <h2 class="section-title">Releases</h2>

      <div class="toolbar">
        <SearchBox v-model="search" placeholder="Search releases or artists..." />
        <SortSelect v-model="sortBy" :options="sortOptions" />
      </div>

      <div class="release-list" v-if="filteredReleases.length">
        <ReleaseCard
          v-for="release in filteredReleases"
          :key="release.id"
          :release="release"
          :label-id="label.id"
        />
      </div>

      <div class="empty-state" v-else>
        <p>No releases match your search.</p>
      </div>
    </section>
  </main>

  <main v-else class="container empty-state">
    <p>Label not found.</p>
  </main>
</template>

<style scoped>
.detail-header {
  padding: 48px 0 32px;
}
.detail-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 24px;
  transition: var(--transition);
}

.back-link:hover { color: var(--accent-light); }

.detail-hero {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.detail-logo {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.8rem;
  color: var(--accent-light);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.detail-info h1 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.detail-info p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  max-width: 600px;
  line-height: 1.6;
}

.releases-section { padding-bottom: 80px; }

.section-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 32px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 32px;
}

.release-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .detail-hero { flex-direction: column; }
}
</style>
