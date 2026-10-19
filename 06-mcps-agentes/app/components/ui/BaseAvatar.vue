<script setup lang="ts">
// Avatar circular con iniciales; también acepta un ícono en el slot.
type AvatarSize = 'sm' | 'md' | 'lg'
type AvatarTone = 'coral' | 'sky' | 'royal'

const props = withDefaults(
  defineProps<{
    initials?: string
    size?: AvatarSize
    tone?: AvatarTone
  }>(),
  {
    initials: '',
    size: 'md',
    tone: 'coral',
  },
)

// Tamaños y tonos tomados de la referencia de diseño (pantallas/feed.dc.html).
const sizeClasses: Record<AvatarSize, string> = {
  sm: 'size-[38px] text-[16px]',
  md: 'size-10 text-[16px]',
  lg: 'size-[44px] text-[17px]',
}

const toneClasses: Record<AvatarTone, string> = {
  coral: 'bg-coral text-white',
  sky: 'bg-sky text-sky-deep',
  royal: 'bg-royal-soft text-royal',
}
</script>

<template>
  <div
    class="flex shrink-0 items-center justify-center rounded-full font-display font-semibold"
    :class="[sizeClasses[props.size], toneClasses[props.tone]]"
  >
    <slot>
      <span v-if="props.initials">{{ props.initials }}</span>
    </slot>
  </div>
</template>
