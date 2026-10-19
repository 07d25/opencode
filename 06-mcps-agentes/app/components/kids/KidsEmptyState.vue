<script setup lang="ts">
// Estado vacío de la búsqueda de niños.
defineProps<{
  query: string
}>()

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-hairline bg-surface px-6 py-12 text-center"
  >
    <p class="text-[15px] text-body">
      No encontramos niños con ese nombre.
    </p>
    <p v-if="query" class="text-[13px] text-muted">Búsqueda: “{{ query }}”</p>
    <button
      type="button"
      class="rounded-[12px] bg-coral-soft px-4 py-2 text-[14px] font-extrabold text-terracotta"
      @click="emit('clear')"
    >
      Limpiar búsqueda
    </button>
  </div>
</template>
