<script setup lang="ts">
import { Bell, House, UserRound, Users } from '@lucide/vue'

// Ítems de navegación del staff.
// "Feed" y "Niños" navegan; "Avisos" y "Mi cuenta" siguen siendo visuales
// hasta que exista su pantalla.
const navItems = [
  { id: 'feed', label: 'Feed', icon: House, to: '/', match: 'exact' },
  { id: 'kids', label: 'Niños', icon: Users, to: '/kids', match: 'prefix' },
  { id: 'avisos', label: 'Avisos', icon: Bell },
  { id: 'mi-cuenta', label: 'Mi cuenta', icon: UserRound },
]
</script>

<template>
  <nav class="flex flex-1 flex-col gap-1">
    <template v-for="item in navItems" :key="item.id">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        :active-class="item.match === 'prefix' ? 'is-active' : ''"
        :exact-active-class="item.match === 'exact' ? 'is-active' : ''"
        class="flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
      >
        <component :is="item.icon" :size="19" />
        {{ item.label }}
      </NuxtLink>

      <span
        v-else
        class="flex cursor-default items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]"
      >
        <component :is="item.icon" :size="19" />
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>

<style scoped>
/* Colores del item de navegación según la referencia (pantallas/feed.dc.html). */
a,
span {
  color: var(--color-nav);
  font-weight: 600;
}

a:hover {
  background-color: var(--color-surf);
}

a.is-active,
a.is-active:hover {
  background-color: var(--color-coral-soft);
  color: var(--color-terracotta);
  font-weight: 800;
}
</style>
