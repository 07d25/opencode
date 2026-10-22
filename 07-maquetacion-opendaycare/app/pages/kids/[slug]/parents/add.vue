<script setup lang="ts">
// Deep link: abre el perfil del niño con el modal de vinculación activo.
import { getChildBySlug } from '~/data/KidsMock'
import KidsChildProfileView from '~/components/kids/ChildProfileView.vue'
import KidsLinkParentModal from '~/components/kids/LinkParentModal.vue'

const route = useRoute()

// Niño de la ruta actual.
const child = computed(() => getChildBySlug(String(route.params.slug)))

// El modal arranca abierto en esta ruta.
const linkParentOpen = computed(() => Boolean(child.value))

const closeModal = () => navigateTo(`/kids/${String(route.params.slug)}`)
</script>

<template>
  <div class="mx-auto w-full max-w-[820px] px-5 pb-20 pt-[34px] sm:px-10">
    <KidsChildProfileView :child="child" />

    <KidsLinkParentModal
      v-if="child"
      :child="child"
      :open="linkParentOpen"
      @close="closeModal"
    />
  </div>
</template>
