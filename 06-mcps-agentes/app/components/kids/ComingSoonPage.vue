<script setup lang="ts">
import { Clock } from '@lucide/vue'

// PantallaPlaceholder para las acciones aún no implementadas.
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="mx-auto w-full max-w-[820px] px-5 pb-20 pt-[34px] sm:px-10">
    <div
      class="flex flex-col items-center gap-4 rounded-[18px] border border-dashed border-hairline bg-surface px-6 py-16 text-center"
    >
      <div
        class="flex size-14 items-center justify-center rounded-[16px] bg-coral-soft text-accent"
      >
        <Clock :size="26" :stroke-width="2" />
      </div>
      <h1 class="font-display text-[24px] font-semibold text-ink">{{ title }}</h1>
      <p class="max-w-[420px] text-[15px] leading-[1.5] text-muted">{{ description }}</p>
      <p class="text-[13px] font-extrabold tracking-[0.8px] text-terracotta">PRÓXIMAMENTE</p>
    </div>
  </div>
</template>
