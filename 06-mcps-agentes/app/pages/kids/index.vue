<script setup lang="ts">
import { kids, kidsCountLabel, kidsRoomLabel } from '~/data/KidsMock'
import KidsHeader from '~/components/kids/KidsHeader.vue'
import KidsSearchInput from '~/components/kids/KidsSearchInput.vue'
import KidsSectionHeader from '~/components/kids/KidsSectionHeader.vue'
import KidsChildCard from '~/components/kids/ChildCard.vue'
import KidsEmptyState from '~/components/kids/KidsEmptyState.vue'

// Término de búsqueda; vive solo en esta página (sin persistencia).
const search = ref('')

// Normaliza para comparar sin acentos ni mayúsculas.
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

// Filtra por nombre y por alertas (etiqueta y notas).
const filteredKids = computed(() => {
  const term = normalize(search.value)
  if (!term) return kids

  return kids.filter((child) => {
    const haystack = [
      child.fullName,
      ...child.alerts.map((alert) => `${alert.label} ${alert.notes}`),
    ]
      .join(' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

    return haystack.includes(term)
  })
})

const clearSearch = () => {
  search.value = ''
}
</script>

<template>
  <div class="mx-auto w-full max-w-[880px] px-5 pb-20 pt-[34px] sm:px-10">
    <KidsHeader />
    <KidsSearchInput v-model="search" />
    <KidsSectionHeader :room-label="kidsRoomLabel" :count-label="kidsCountLabel" />

    <div v-if="filteredKids.length" class="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
      <KidsChildCard v-for="child in filteredKids" :key="child.id" :child="child" />
    </div>

    <KidsEmptyState v-else :query="search" @clear="clearSearch" />
  </div>
</template>
