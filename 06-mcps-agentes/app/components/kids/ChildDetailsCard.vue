<script setup lang="ts">
import type { Child } from '~/types/child'

// Ficha con los datos básicos del niño.
defineProps<{
  child: Child
}>()
</script>

<template>
  <div class="overflow-hidden rounded-[16px] border border-hairline bg-surface">
    <div
      class="flex items-center justify-between border-b border-divider-soft px-[18px] py-[15px]"
    >
      <span class="text-[14.5px] text-muted-soft">Fecha de nacimiento</span>
      <span class="text-[14.5px] font-extrabold text-ink">{{ child.birthDate }}</span>
    </div>
    <div
      class="flex items-center justify-between border-b border-divider-soft px-[18px] py-[15px]"
    >
      <span class="text-[14.5px] text-muted-soft">Sala</span>
      <span class="text-[14.5px] font-extrabold text-ink">{{ child.room }}</span>
    </div>
    <div class="flex items-center justify-between px-[18px] py-[15px]">
      <span class="text-[14.5px] text-muted-soft">Ingreso</span>
      <span class="text-[14.5px] font-extrabold text-ink">{{ child.enrolledAt }}</span>
    </div>
  </div>
</template>
