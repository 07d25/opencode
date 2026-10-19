<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'
import type { ChildAlert } from '~/types/child'

// Panel de alergias y notas; solo se renderiza si el niño tiene alertas.
defineProps<{
  alert: ChildAlert
}>()
</script>

<template>
  <div class="flex gap-[14px] rounded-[16px] bg-alert-surface px-[18px] py-4">
    <div
      class="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-alert-icon"
    >
      <TriangleAlert :size="22" :stroke-width="2.2" class="text-white" />
    </div>
    <div>
      <div class="mb-0.5 text-[15px] font-extrabold text-alert-title">{{ alert.title }}</div>
      <div class="text-[14.5px] leading-[1.5] text-alert-text">{{ alert.notes }}</div>
    </div>
  </div>
</template>
