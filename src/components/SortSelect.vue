<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="select-wrap">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.select-wrap {
  position: relative;
}

.select-wrap select {
  appearance: none;
  padding: 10px 36px 10px 14px;
  background: var(--bg-card);
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select-wrap select:focus {
  outline: none;
}
.select-wrap::after {
  content: '▾';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  font-size: 0.8rem;
}
</style>
