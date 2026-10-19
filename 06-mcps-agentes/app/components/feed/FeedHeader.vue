<script setup lang="ts">
import type { FeedMeta } from '~/types/feed'

// Encabezado del feed: guardería, saludo y resumen del día.
defineProps<{
  meta: FeedMeta
}>()
</script>

<template>
  <div class="mb-6">
    <div class="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-terracotta">
      GUARDERÍA · SALA SOLES
    </div>
    <h1 class="font-display text-[30px] font-semibold text-ink">{{ meta.greeting }}</h1>
    <p class="mt-[5px] text-[14.5px] text-muted-soft">{{ meta.subtitle }}</p>
  </div>
</template>
