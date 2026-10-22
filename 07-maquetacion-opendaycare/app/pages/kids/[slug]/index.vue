<script setup lang="ts">
// Perfil de un niño: identidad, alertas, ficha de datos y familiares.
import { getChildBySlug } from '~/data/KidsMock'
import KidsChildProfileView from '~/components/kids/ChildProfileView.vue'
import KidsLinkParentModal from '~/components/kids/LinkParentModal.vue'

const route = useRoute()

// Niño de la ruta actual.
const child = computed(() => getChildBySlug(String(route.params.slug)))

// Estado del modal de vinculación.
const linkParentOpen = ref(false)
</script>

<template>
  <div class="mx-auto w-full max-w-[820px] px-5 pb-20 pt-[34px] sm:px-10">
    <KidsChildProfileView :child="child" @link-parent="linkParentOpen = true" />

    <KidsLinkParentModal
      v-if="child"
      :child="child"
      :open="linkParentOpen"
      @close="linkParentOpen = false"
    />
  </div>
</template>
