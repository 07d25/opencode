<script setup lang="ts">
import { Plus, Sun } from '@lucide/vue'
import type { Child } from '~/types/child'
import UiBaseAvatar from '~/components/ui/BaseAvatar.vue'

// Panel lateral con el resumen del día y los padres vinculados.
defineProps<{
  child: Child
}>()

const emit = defineEmits<{
  'link-parent': []
}>()
</script>

<template>
  <div class="flex flex-col gap-[14px]">
    <NuxtLink
      :to="`/kids/${child.slug}/daily-summary`"
      class="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-ink px-3 py-[13px] text-[15px] font-extrabold text-white"
    >
      <Sun :size="18" :stroke-width="2" />
      Resumen del día
    </NuxtLink>

    <div class="rounded-[16px] border border-hairline bg-surface px-[18px] py-4">
      <div class="mb-3.5 text-[12.5px] font-extrabold tracking-[0.8px] text-faint">
        PADRES VINCULADOS
      </div>

      <div class="flex flex-col gap-[14px]">
        <div
          v-for="(parent, index) in child.parents"
          :key="parent.name"
          class="flex items-center gap-3"
        >
          <UiBaseAvatar
            :initials="parent.initials"
            :tone="index % 2 === 0 ? 'parent-violet' : 'parent-blue'"
            size="md"
          />
          <div class="min-w-0 flex-1">
            <div class="text-[14.5px] font-extrabold text-ink">{{ parent.name }}</div>
            <div class="text-[12.5px] text-muted">{{ parent.role }} · {{ parent.statusLabel }}</div>
          </div>
          <span
            class="shrink-0 rounded-full px-[9px] py-1 text-[10.5px] font-extrabold"
            :class="
              parent.status === 'active'
                ? 'bg-mint-soft text-mint'
                : 'bg-pending-soft text-yellow-deep'
            "
          >
            {{ parent.status === 'active' ? 'ACTIVA' : 'PENDIENTE' }}
          </span>
        </div>

        <button
          type="button"
          class="flex cursor-pointer items-center gap-3 pt-2"
          @click="emit('link-parent')"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-dashed-line text-placeholder-text"
          >
            <Plus :size="18" :stroke-width="2.2" />
          </span>
          <span class="text-[14.5px] font-extrabold text-edit">Vincular otro padre</span>
        </button>
      </div>
    </div>
  </div>
</template>
