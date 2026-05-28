<script setup>
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

defineProps({
  release: { type: Object, required: true },
  labelId: { type: String, required: true },
  labelName: { type: String, default: '' },
  showLabel: { type: Boolean, default: false }
})
</script>

<template>
  <RouterLink :to="`/release/${release.id}`" class="release-card">
    <div class="release-artwork">
      <img v-if="release.artwork" :src="release.artwork" :alt="release.title" />
      <div v-else class="artwork-placeholder">♪</div>
    </div>
    <div class="release-info">
      <h4>{{ release.title }}</h4>
      <div class="artist-name">{{ Array.isArray(release.artists) ? release.artists.join(', ') : release.artists }}</div>
      <div class="release-date">
        <template v-if="showLabel && labelName">{{ labelName }} · </template>
        {{ formatDate(release.release_date || release.date) }}
      </div>
    </div>
    <div class="release-actions">
      <span
          v-for="ver in release.versions"
          :key="ver.type"
          class="version-tag"
          :class="ver.type"
      >
        {{ ver.type === 'original' ? 'Original' : ver.type === 'extended' ? 'Extended' : 'Remix' }}
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.release-card {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  transition: var(--transition);
}

.release-card:hover {
  background: rgba(255, 255, 255, 0.02);
}

.release-artwork {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.release-artwork img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artwork-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.release-info {
  min-width: 0;
}

h4 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name {
  color: var(--accent-light);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.release-date {
  color: var(--text-muted);
  font-size: 0.78rem;
}

.release-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.version-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(108, 92, 231, 0.15);
  color: var(--accent-light);
  min-width: 80px;
  text-align: center;
}

.version-tag.extended {
  background: rgba(204, 188, 188, 0.35);
  color: #bfb3b3;
}

@media (max-width: 640px) {
  .release-card {
    grid-template-columns: 60px 1fr;
    gap: 12px;
  }
  .release-artwork { width: 60px; height: 60px; }
  .release-actions {
    grid-column: 1 / -1;
    flex-direction: row;
  }
}
</style>