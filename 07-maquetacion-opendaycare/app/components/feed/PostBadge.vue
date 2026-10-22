<script setup lang="ts">
import type { FeedPostType } from '~/types/feed'

// Pill de tipo de publicación (LOGRO / ACTIVIDAD / ANUNCIO).
const props = defineProps<{
  type: FeedPostType
}>()

const badgeMap: Record<FeedPostType, { label: string; classes: string; dot: string }> = {
  food: {
    label: 'COMIDA',
    classes: 'bg-type-food-soft text-type-food',
    dot: 'bg-type-food',
  },
  nap: {
    label: 'SIESTA',
    classes: 'bg-type-nap-soft text-type-nap',
    dot: 'bg-type-nap',
  },
  achievement: {
    label: 'LOGRO',
    classes: 'bg-type-achievement-soft text-type-achievement',
    dot: 'bg-type-achievement',
  },
  activity: {
    label: 'ACTIVIDAD',
    classes: 'bg-type-activity-soft text-type-activity',
    dot: 'bg-type-activity',
  },
  mood: {
    label: 'ÁNIMO',
    classes: 'bg-type-mood-soft text-type-mood',
    dot: 'bg-type-mood',
  },
  photo: {
    label: 'FOTO',
    classes: 'bg-type-photo-soft text-type-photo',
    dot: 'bg-type-photo',
  },
  announcement: {
    label: 'ANUNCIO',
    classes: 'bg-type-announcement-soft text-type-announcement',
    dot: 'bg-type-announcement',
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
