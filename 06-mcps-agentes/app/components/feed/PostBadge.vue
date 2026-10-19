<script setup lang="ts">
import type { FeedPostType } from '~/types/feed'

// Pill de tipo de publicación (LOGRO / ACTIVIDAD / ANUNCIO).
const props = defineProps<{
  type: FeedPostType
}>()

const badgeMap: Record<FeedPostType, { label: string; classes: string; dot: string }> = {
  achievement: {
    label: 'LOGRO',
    classes: 'bg-mint-soft text-mint',
    dot: 'bg-mint',
  },
  activity: {
    label: 'ACTIVIDAD',
    classes: 'bg-sky-soft text-blue',
    dot: 'bg-blue',
  },
  announcement: {
    label: 'ANUNCIO',
    classes: 'bg-royal-soft text-royal',
    dot: 'bg-royal',
  },
}
</script>

<template>
  <div
    class="flex items-center gap-[7px] rounded-full px-3 py-1.5"
    :class="badgeMap[props.type].classes"
  >
    <span class="size-2 rounded-full" :class="badgeMap[props.type].dot"></span>
    <span class="text-[12px] font-extrabold tracking-[0.5px]">
      {{ badgeMap[props.type].label }}
    </span>
  </div>
</template>
