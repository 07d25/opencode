<script setup lang="ts">
import { Clock } from '@lucide/vue'

useSeoMeta({
  title: 'Familia · OpenDayCare',
  description: 'Próximamente: el feed de las familias.',
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-cream px-[30px] py-[40px]">
    <div
      class="flex w-full max-w-[520px] flex-col items-center gap-4 rounded-[18px] border border-dashed border-hairline bg-surface px-6 py-16 text-center"
    >
      <div class="flex size-14 items-center justify-center rounded-[16px] bg-coral-soft text-accent">
        <Clock :size="26" :stroke-width="2" />
      </div>
      <h1 class="font-display text-[24px] font-semibold text-ink">Feed de la familia</h1>
      <p class="max-w-[420px] text-[15px] leading-[1.5] text-muted">
        El feed de las familias con las fotos y los avisos de la guardería llega muy pronto.
      </p>
      <p class="text-[13px] font-extrabold tracking-[0.8px] text-terracotta">PRÓXIMAMENTE</p>
      <NuxtLink
        to="/login"
        class="text-[14px] font-extrabold text-edit transition-opacity hover:opacity-80"
      >
        Volver a iniciar sesión
      </NuxtLink>
    </div>
  </div>
</template>
