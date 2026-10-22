<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import type { FeedUser } from '~/types/feed'
import UiBaseAvatar from '~/components/ui/BaseAvatar.vue'

// Bloque inferior del sidebar: datos de la docente y cierre de sesión (visual).
defineProps<{
  teacher: FeedUser
}>()
</script>

<template>
  <div class="mt-2.5 border-t border-hairline pt-3.5">
    <div class="flex items-center gap-[11px] px-2 py-1.5">
      <UiBaseAvatar :initials="teacher.initials" size="sm" tone="coral" />
      <div class="min-w-0 flex-1">
        <div class="text-[14px] font-extrabold text-ink">{{ teacher.name }}</div>
        <div class="text-[12px] text-muted">{{ teacher.role }}</div>
      </div>
      <NuxtLink
        to="/login"
        title="Cerrar sesión"
        class="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-surf text-muted-soft transition-colors hover:bg-coral-soft hover:text-terracotta"
      >
        <LogOut :size="16" />
      </NuxtLink>
    </div>
  </div>
</template>
