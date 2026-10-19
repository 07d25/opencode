<script setup lang="ts">
import { Image } from '@lucide/vue'

// Bloque punteado que representa la foto de la publicación.
defineProps<{
  caption: string
}>()
</script>

<template>
  <div
    class="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-placeholder-line bg-placeholder text-placeholder-text"
  >
    <Image :size="30" :stroke-width="1.7" />
    <span class="text-[13.5px]">{{ caption }}</span>
  </div>
</template>
