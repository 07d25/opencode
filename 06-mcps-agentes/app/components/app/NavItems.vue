<script setup lang="ts">
import { Bell, House, UserRound, Users } from '@lucide/vue'

// Ítems de navegación del staff (solo visual: sin rutas funcionales en esta spec).
const navItems = [
  { id: 'feed', label: 'Feed', icon: House, active: true },
  { id: 'ninos', label: 'Niños', icon: Users, active: false },
  { id: 'avisos', label: 'Avisos', icon: Bell, active: false },
  { id: 'mi-cuenta', label: 'Mi cuenta', icon: UserRound, active: false },
]
</script>

<template>
  <nav class="flex flex-1 flex-col gap-1">
    <a
      v-for="item in navItems"
      :key="item.id"
      class="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
      :class="
        item.active
          ? 'bg-coral-soft font-extrabold text-terracotta'
          : 'font-semibold text-nav hover:bg-surf'
      "
    >
      <component :is="item.icon" :size="19" />
      {{ item.label }}
    </a>
  </nav>
</template>
