<script setup lang="ts">
// Chip de destinatario: un niño (con avatar) o toda la sala.
const props = defineProps<{
  label: string
  initials?: string
  avatarClass?: string
  selected: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    type="button"
    class="flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] py-[6px] pr-[14px] text-[14px] font-bold transition-colors"
    :class="[
      props.initials ? 'pl-[6px]' : 'pl-[16px]',
      props.selected
        ? 'border-ink bg-ink text-white'
        : 'border-hairline bg-surface text-nav',
    ]"
    :aria-pressed="props.selected"
    @click="emit('select')"
  >
    <span
      v-if="props.initials"
      class="flex size-[26px] items-center justify-center rounded-full font-display text-[13px] font-semibold"
      :class="props.avatarClass"
    >
      {{ props.initials }}
    </span>
    {{ props.label }}
  </button>
</template>
