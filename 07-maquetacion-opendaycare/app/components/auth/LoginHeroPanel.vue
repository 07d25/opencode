<script setup lang="ts">
import AuthBrandMark from '~/components/auth/AuthBrandMark.vue'

// Panel de marca del login: columna izquierda con gradiente y círculos decorativos.
</script>

<template>
  <div
    class="relative flex flex-col justify-between overflow-hidden px-[30px] py-[36px] text-white sm:px-[60px] sm:py-[56px]"
    style="background: linear-gradient(155deg, #f6a98e 0%, #f2937a 45%, #ec7e62 100%)"
  >
    <div
      class="absolute -top-[140px] -right-[120px] size-[420px] rounded-full bg-white/12"
    />
    <div
      class="absolute -bottom-[110px] -left-[80px] size-[300px] rounded-full bg-white/10"
    />

    <div class="relative flex items-center gap-[13px]">
      <AuthBrandMark :size="46" />
      <span class="font-display text-[21px] font-semibold tracking-[0.5px]">OpenDayCare</span>
    </div>

    <div class="relative">
      <h1
        class="font-display text-[32px] font-semibold leading-[1.12] sm:text-[42px]"
      >
        El día de cada niño,<br />
        compartido con su familia.
      </h1>
      <p class="mt-[18px] max-w-[430px] text-[16px] leading-[1.6] text-white/92 sm:text-[17px]">
        Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.
      </p>
    </div>

    <div class="relative text-[14px] text-white/90">🌿 Guardería Sala Soles</div>
  </div>
</template>
