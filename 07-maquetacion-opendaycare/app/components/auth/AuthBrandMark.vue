<script setup lang="ts">
import { Sun } from '@lucide/vue'

// Marca del producto: bloque redondeado con gradiente terracota e ícono de sol.
withDefaults(
  defineProps<{
    size?: number
    rounded?: string
    iconSize?: number
    shadow?: boolean
    tone?: 'glass' | 'gradient'
  }>(),
  {
    size: 46,
    rounded: 'rounded-[14px]',
    iconSize: 26,
    shadow: false,
    tone: 'glass',
  },
)
</script>

<template>
  <div
    class="flex shrink-0 items-center justify-center text-white"
    :class="[
      rounded,
      tone === 'gradient' ? 'bg-linear-[155deg] from-coral-light to-coral' : 'bg-white/22',
      shadow ? 'shadow-[0_12px_26px_-10px_rgb(238_129_100_/_0.65)]' : '',
    ]"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <Sun :size="iconSize" :stroke-width="2.2" />
  </div>
</template>
