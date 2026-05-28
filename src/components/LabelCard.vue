<script setup>
defineProps({
  label: { type: Object, required: true }
})
</script>

<template>
  <RouterLink :to="`/label/${label.id}`" class="label-card">
    <div class="card-bg" v-if="label.logo">
      <img :src="label.logo" :alt="''" />
    </div>
    <div class="card-overlay"></div>
    <div class="card-content">
      <div class="label-rank">#{{ label.rank }}</div>
      <div class="label-logo">
        <img v-if="label.logo" :src="label.logo" :alt="label.name + ' logo'" />
        <span v-else>{{ label.shortName }}</span>
      </div>
      <h3>{{ label.name }}</h3>
      <p class="desc">{{ label.description }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.label-card {
  display: block;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  min-height: 240px;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.card-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5px) brightness(0.2);
  transform: scale(1.2);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 15, 0.10);
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 28px 24px;
}

.label-card:hover {
  border-color: var(--border-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.label-card:hover .card-overlay {
  background: rgba(10, 10, 15, 0.55);
}

.label-rank {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-light);
  margin-bottom: 8px;
}

.label-logo {
  width: 70px;
  height: 70px;
  border-radius: var(--radius-md);
  background: rgba(17, 17, 24, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.label-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.label-logo span {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--accent-light);
}

h3 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.desc {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>