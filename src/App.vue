<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="site-header">
    <nav class="nav-inner">
      <RouterLink to="/" class="logo">SoundFlow</RouterLink>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Labels</RouterLink>
        <RouterLink to="/releases" class="nav-link">All Releases</RouterLink>
      </div>
    </nav>
  </header>

  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>

  <footer class="site-footer">
    <div class="container">
      SoundFlow &copy; 2025 — Top 10 Electronic Music Labels
    </div>
  </footer>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition);
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
}


.site-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
}
</style>
