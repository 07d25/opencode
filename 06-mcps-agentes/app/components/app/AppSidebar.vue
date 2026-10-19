<script setup lang="ts">
import { Plus, Sun } from '@lucide/vue'
import type { FeedUser } from '~/types/feed'
import AppNavItems from '~/components/app/NavItems.vue'
import AppSidebarProfile from '~/components/app/SidebarProfile.vue'

// Sidebar del staff: logo, CTA de nueva publicación, navegación y perfil.
defineProps<{
  teacher: FeedUser
  room: string
}>()
</script>

<template>
  <aside
    class="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-hairline bg-surface px-4 py-6 sm:flex"
  >
    <a class="flex items-center gap-[11px] px-2 pb-[22px] pt-1">
      <div
        class="flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-linear-[155deg] from-coral-light to-coral text-white"
      >
        <Sun :size="21" :stroke-width="2.2" />
      </div>
      <div>
        <div class="font-display text-[17px] font-semibold leading-none text-ink">OpenDayCare</div>
        <div class="mt-0.5 text-[11.5px] text-muted">{{ room }}</div>
      </div>
    </a>

    <a
      class="mb-[18px] flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-linear-to-b from-coral-500 to-coral-600 px-3 py-3 text-[14.5px] font-extrabold text-white shadow-cta"
    >
      <Plus :size="17" :stroke-width="2.4" />
      Nueva publicación
    </a>

    <AppNavItems />

    <AppSidebarProfile :teacher="teacher" />
  </aside>
</template>
