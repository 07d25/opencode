<script setup lang="ts">
import { Camera } from '@lucide/vue'
import type { FeedUser } from '~/types/feed'
import UiBaseAvatar from '~/components/ui/BaseAvatar.vue'

// Prompt simulado de "nueva publicación" (sin interacción en esta spec).
defineProps<{
  teacher: FeedUser
}>()
</script>

<template>
  <NuxtLink
    to="/posts/new"
    class="mb-6 flex items-center gap-[14px] rounded-[18px] border border-hairline bg-surface px-[18px] py-[14px] shadow-prompt transition-colors hover:border-coral"
  >
    <UiBaseAvatar :initials="teacher.initials" tone="coral" />
    <span class="flex-1 text-[15px] text-muted">Compartí un momento…</span>
    <span
      class="flex size-[38px] items-center justify-center rounded-xl bg-coral-soft text-accent"
    >
      <Camera :size="19" />
    </span>
  </NuxtLink>
</template>
