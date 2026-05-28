<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ReleaseCard from '../components/ReleaseCard.vue'

const route = useRoute()
const playingIdx = ref(-1)

const release = ref(null)
const loading = ref(true)

const parentLabel = computed(() => {
  if (!release.value) return null

  return {
    id: release.value.label_id,
    name: release.value.label_name
  }
})

const otherAppearances = computed(() => {
  return release.value?.otherAppearances || []
})

async function loadRelease() {
  loading.value = true

  try {
    const response = await fetch(`http://localhost:3000/api/releases/${route.params.id}`)

    if (!response.ok) {
      release.value = null
      return
    }

    release.value = await response.json()
  } catch (error) {
    console.error('Error loading release:', error)
    release.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadRelease)

watch(
    () => route.params.id,
    () => loadRelease()
)

const audioRefs = ref({})
const progress = ref({})
const currentTimes = ref({})
const durations = ref({})

function togglePlay(idx) {
  const audio = audioRefs.value[idx]
  if (playingIdx.value === idx) {
    audio?.pause()
    playingIdx.value = -1
  } else {
    if (playingIdx.value !== -1) {
      audioRefs.value[playingIdx.value]?.pause()
    }
    audio?.play()
    playingIdx.value = idx
  }
}

function onTimeUpdate(idx) {
  const audio = audioRefs.value[idx]
  if (audio) {
    currentTimes.value[idx] = audio.currentTime
    progress.value[idx] = (audio.currentTime / audio.duration) * 100
  }
}

function onLoaded(idx) {
  const audio = audioRefs.value[idx]
  if (audio) {
    durations.value[idx] = audio.duration
  }
}

function onEnded(idx) {
  playingIdx.value = -1
  progress.value[idx] = 0
  currentTimes.value[idx] = 0
}

function seek(event, idx) {
  const audio = audioRefs.value[idx]
  if (audio) {
    const bar = event.currentTarget
    const percent = event.offsetX / bar.offsetWidth
    audio.currentTime = percent * audio.duration
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <main v-if="!loading && release && parentLabel" class="release-detail container">
    <RouterLink :to="`/label/${parentLabel.id}`" class="back-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m15 18-6-6 6-6" />
      </svg>
      Back to {{ parentLabel.name }}
    </RouterLink>

    <div class="rd-layout">
      <div class="rd-artwork">
        <img v-if="release.artwork" :src="release.artwork" :alt="release.title" />
        <div v-else class="artwork-placeholder">&#9835;</div>
      </div>

      <div class="rd-content">
        <h1>{{ release.title }}</h1>
        <div class="rd-artist">
          {{ release.artists.join(', ') }}
          <template v-if="release.featured_artists"> feat. {{ release.featured_artists }}</template>
        </div>
        <RouterLink :to="`/label/${parentLabel.id}`" class="rd-label-link">
          {{ parentLabel.name }}
        </RouterLink>

        <div class="rd-meta">
          <div class="rd-meta-item">
            <span class="meta-label">Released</span>
            <span class="meta-value">{{ formatDate(release.release_date) }}</span>
          </div>
          <div class="rd-meta-item">
            <span class="meta-label">Versions</span>
            <span class="meta-value">{{ release.versions.length }}</span>
          </div>
        </div>

        <p class="rd-description">{{ release.pr_text }}</p>

        <div class="audio-section">
          <h3>Tracklist</h3>
          <div v-for="(ver, idx) in release.versions" :key="idx" class="audio-track">
            <button class="play-btn" @click="togglePlay(idx)">
              <svg v-if="playingIdx !== idx" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
              <svg v-else viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            </button>
            <div class="track-middle">
              <div class="track-info">
                <div class="track-title">{{ release.title }}</div>
                <div class="track-version">{{ ver.label }}</div>
              </div>
              <div v-if="ver.src" class="progress-bar" @click="seek($event, idx)">
                <div class="progress-fill" :style="{ width: (progress[idx] || 0) + '%' }"></div>
              </div>
              <div class="track-time" v-if="ver.src">
                {{ formatTime(currentTimes[idx] || 0) }} / {{ formatTime(durations[idx] || 0) }}
              </div>
            </div>
            <span class="version-tag" :class="ver.type">
              {{ ver.type === 'original' ? 'Original' : ver.type === 'extended' ? 'Extended' : 'Remix' }}
            </span>
            <audio v-if="ver.src" :src="ver.src" :ref="el => { if (el) audioRefs[idx] = el }" @timeupdate="onTimeUpdate(idx)" @loadedmetadata="onLoaded(idx)" @ended="onEnded(idx)"></audio>
          </div>
        </div>

        <div v-if="otherAppearances.length" class="cross-label">
          <h3>Also appears on</h3>
          <div class="release-list">
            <ReleaseCard
                v-for="app in otherAppearances"
                :key="app.id"
                :release="app"
                :label-id="app.label_id"
                :label-name="app.label_name"
                :show-label="true"
            />
          </div>
        </div>
      </div>
    </div>
  </main>

  <main v-else class="container empty-state">
    <p>Release not found.</p>
  </main>
</template>

<style scoped>
.release-detail { padding: 48px 0 80px; }
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
.back-link:hover {
  color: var(--accent-light);
}
.rd-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;
  align-items: flex-start;
}
.rd-artwork {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: 0 0 40px rgba(108, 92, 231, 0.15);
}
.rd-artwork img, .rd-artwork .artwork-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.artwork-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}
h1 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.rd-artist {
  font-size: 1.1rem;
  color: var(--accent-light);
  font-weight: 500;
  margin-bottom: 4px;
}
.rd-label-link {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 20px;
  display: inline-block;
}
.rd-label-link:hover {
  color: var(--accent-light);
}
.rd-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}
.rd-meta-item {
  display: flex;
  align-items: center;
  gap: 6px; background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 8px 14px;
  font-size: 0.825rem;
}
.meta-label {
  color: var(--text-muted);
}
.meta-value {
  color: var(--text-primary);
  font-weight: 500;
}
.rd-description {
  color: var(--text-secondary);
  font-size: 0.925rem;
  line-height: 1.7;
  margin-bottom: 28px;
}
.audio-section {
  margin-bottom: 24px;
}
.audio-section h3, .cross-label h3 {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-secondary);
}
.audio-track {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0;
}
.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition);
  cursor: pointer;
  border: none;
}
.play-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 0 20px var(--accent-glow);
}
.play-btn svg {
  width: 16px;
  height: 16px;
  fill: white;
}
.track-middle {
  flex: 1;
  min-width: 0;
}
.track-info {
  min-width: 0;
}
.track-title {
  font-size: 0.875rem;
  font-weight: 500;
}
.track-version {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  margin-top: 8px;
  cursor: pointer;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--gradient-1);
  border-radius: 3px;
  transition: width 0.1s linear;
}
.track-time {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 4px;
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
  flex-shrink: 0;
}
.version-tag.extended {
  background: rgba(204, 188, 188, 0.35);
  color: #bfb3b3;
}
.cross-label {
  margin-top: 24px;
}
.release-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}
@media (max-width: 768px) {
  .rd-layout {
  grid-template-columns: 1fr;
    gap: 28px;
  } .rd-artwork {
        max-width: 280px;
      }
}
</style>