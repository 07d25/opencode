<script setup lang="ts">
// Separador de la sección de niños: sala, cantidad y línea.
defineProps<{
  roomLabel: string
  countLabel: string
}>()
</script>

<template>
  <div class="mb-3.5 flex items-center gap-3">
    <span class="text-[12.5px] font-extrabold tracking-[0.8px] text-ink">{{ roomLabel }}</span>
    <span class="text-[13px] text-muted">{{ countLabel }}</span>
    <span class="h-px flex-1 bg-divider"></span>
  </div>
</template>
