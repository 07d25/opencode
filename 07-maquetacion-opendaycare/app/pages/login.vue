<script setup lang="ts">
import AuthBrandMark from '~/components/auth/AuthBrandMark.vue'
import LoginHeroPanel from '~/components/auth/LoginHeroPanel.vue'
import LoginForm from '~/components/auth/LoginForm.vue'

useSeoMeta({
  title: 'Iniciar sesión · OpenDayCare',
  description: 'Ingresá para ver el día de hoy en OpenDayCare.',
})
</script>

<template>
  <div class="grid min-h-screen bg-cream lg:grid-cols-[1.05fr_1fr]">
    <LoginHeroPanel class="hidden lg:flex" />

    <div class="flex items-center justify-center px-[30px] py-[40px] sm:px-10">
      <div class="w-full max-w-[392px]">
        <div class="mb-[28px] flex items-center gap-[11px] lg:hidden">
          <AuthBrandMark :size="38" rounded="rounded-xl" :icon-size="21" tone="gradient" />
          <span class="font-display text-[19px] font-semibold text-ink">OpenDayCare</span>
        </div>

        <LoginForm />
      </div>
    </div>
  </div>
</template>
