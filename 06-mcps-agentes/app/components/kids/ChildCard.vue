<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import type { Child } from '~/types/child'
import UiBaseAvatar from '~/components/ui/BaseAvatar.vue'

// Card de un niño dentro del listado.
defineProps<{
  child: Child
}>()
</script>

<template>
  <NuxtLink
    :to="`/kids/${child.slug}`"
    class="flex min-w-0 items-center gap-[14px] rounded-[18px] border border-hairline bg-surface p-4 shadow-card transition duration-150 hover:-translate-y-0.5 hover:border-card-hover"
  >
    <UiBaseAvatar :initials="child.initials" :tone="child.avatarTone" size="xl" />

    <div class="min-w-0 flex-1">
      <div class="font-display text-[16px] font-semibold text-ink">{{ child.fullName }}</div>
      <div class="text-[13px] text-muted">
        {{ child.age }} · {{ child.linkedParentsLabel }}
      </div>
    </div>

    <span
      v-if="child.badge.type === 'alert'"
      class="shrink-0 rounded-full bg-badge-alert px-[9px] py-[5px] text-[11px] font-extrabold text-badge-alert-text"
    >
      {{ child.badge.label }}
    </span>

    <span
      v-else-if="child.badge.type === 'link'"
      class="shrink-0 rounded-full bg-badge-link px-[9px] py-[5px] text-[11px] font-extrabold text-badge-link-text"
    >
      {{ child.badge.label }}
    </span>

    <ChevronRight v-else :size="18" :stroke-width="2.2" class="shrink-0 text-chevron" />
  </NuxtLink>
</template>
