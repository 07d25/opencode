<script setup lang="ts">
import { ChevronLeft } from '@lucide/vue'
import type { Child } from '~/types/child'
import UiBaseAvatar from '~/components/ui/BaseAvatar.vue'

// Encabezado del perfil: volver al listado, identidad del niño y acción de edición.
defineProps<{
  child: Child
}>()
</script>

<template>
  <div>
    <NuxtLink
      to="/kids"
      class="mb-5 flex items-center gap-[7px] text-[14px] font-bold text-muted-soft"
    >
      <ChevronLeft :size="18" :stroke-width="2.2" />
      Volver a Niños
    </NuxtLink>

    <div class="flex flex-wrap items-center gap-[18px]">
      <UiBaseAvatar :initials="child.initials" :tone="child.avatarTone" size="2xl" />

      <div class="min-w-0 flex-1">
        <h1 class="font-display text-[28px] font-semibold text-ink">{{ child.fullName }}</h1>
        <p class="mt-[3px] text-[15px] text-muted-soft">
          {{ child.age }} · Sala {{ child.room }}
        </p>
      </div>

      <NuxtLink
        :to="`/kids/${child.slug}/edit`"
        class="rounded-[12px] border-[1.5px] border-hairline bg-surface px-4 py-[9px] text-[14px] font-bold text-nav"
      >
        Editar
      </NuxtLink>
    </div>
  </div>
</template>
