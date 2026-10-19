<script setup lang="ts">
import { Search } from '@lucide/vue'

// Campo de búsqueda de niños: emite el texto hacia el padre.
const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
  }>(),
  {
    placeholder: 'Buscar niño…',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div
    class="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-hairline bg-surface px-4 py-3"
  >
    <Search :size="18" class="text-placeholder-text" />
    <input
      :value="props.modelValue"
      :placeholder="props.placeholder"
      type="search"
      class="flex-1 border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-field-placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
