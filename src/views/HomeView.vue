<script setup>
import { ref, computed, onMounted } from 'vue'
import LabelCard from '../components/LabelCard.vue'
import SearchBox from '../components/SearchBox.vue'

const search = ref('')
const labels = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/labels')
    const data = await response.json()

    console.log('LABELS FROM API:', data)

    labels.value = data
  } catch (error) {
    console.error('Error loading labels:', error)
  }
})

const filteredLabels = computed(() => {
  let result = [...labels.value]
  const q = search.value.toLowerCase().trim()

  if (q) {
    result = result.filter(label =>
        label.name.toLowerCase().includes(q)
    )
  }

  result.sort((a, b) => a.rank - b.rank)
  return result
})
</script>

<template>
  <main>
    <section class="hero container">
      <h1>Top 10 Electronic Music Labels </h1>
      <p>Here are the record labels that defined electronic music in 2025 and the releases worth hearing.</p>
    </section>
    <section class="container">
      <div class="toolbar">
        <SearchBox v-model="search" placeholder="Search labels..." />
      </div>

      <div class="label-grid" v-if="filteredLabels.length">
        <LabelCard
          v-for="label in filteredLabels"
          :key="label.id"
          :label="label"
        />
      </div>

      <div class="empty-state" v-else>
        <p>No labels match your search.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  padding: 48px 0 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent-light);
  background: rgba(108, 92, 231, 0.12);
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 20px;
}

.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.hero h1 span {
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 520px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 32px;
}

.label-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding-bottom: 60px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
  font-size: 0.95rem;
}
</style>
