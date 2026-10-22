<script setup lang="ts">
import { Plus } from '@lucide/vue'

// Encabezado de la pantalla de gestión: título y acción de alta.
</script>

<template>
  <div class="mb-[22px] flex flex-wrap items-end justify-between gap-4">
    <div>
      <div class="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-terracotta">
        GESTIÓN
      </div>
      <h1 class="font-display text-[30px] font-semibold text-ink">Niños</h1>
    </div>

    <NuxtLink
      to="/kids/add"
      class="flex items-center gap-2 rounded-[14px] bg-linear-to-b from-coral-500 to-coral-600 px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-cta"
    >
      <Plus :size="17" :stroke-width="2.4" />
      Agregar niño
    </NuxtLink>
  </div>
</template>
