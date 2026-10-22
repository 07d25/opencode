<script setup lang="ts">
import type { PostType } from '~/types/feed'

// Chip de tipo de publicación (Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio).
const props = defineProps<{
  type: PostType
  label: string
  selected: boolean
}>()

const emit = defineEmits<{
  select: [type: PostType]
}>()

// Colores de la referencia: pantallas/crear-publicacion.dc.html.
const toneClasses: Record<PostType, string> = {
  food: 'bg-type-food text-white',
  nap: 'bg-type-nap-soft text-type-nap',
  activity: 'bg-type-activity text-white',
  achievement: 'bg-type-achievement-soft text-type-achievement',
  mood: 'bg-type-mood-soft text-type-mood',
  photo: 'bg-type-photo-soft text-type-photo',
  announcement: 'bg-type-announcement-soft text-type-announcement',
}
</script>

<template>
  <button
    type="button"
    class="cursor-pointer rounded-full px-4 py-[8px] text-[13.5px] font-extrabold transition-shadow"
    :class="[
      toneClasses[props.type],
      props.selected ? 'ring-2 ring-ink ring-offset-2' : '',
    ]"
    :aria-pressed="props.selected"
    @click="emit('select', props.type)"
  >
    {{ props.label }}
  </button>
</template>
