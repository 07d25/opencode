<script setup lang="ts">
// Perfil de un niño: identidad, alertas, ficha de datos y familiares.
import { getChildBySlug } from '~/data/KidsMock'
import KidsChildProfileHeader from '~/components/kids/ChildProfileHeader.vue'
import KidsChildAlertPanel from '~/components/kids/ChildAlertPanel.vue'
import KidsChildDetailsCard from '~/components/kids/ChildDetailsCard.vue'
import KidsLinkedParentsCard from '~/components/kids/LinkedParentsCard.vue'

const route = useRoute()

// Niño de la ruta actual.
const child = computed(() => getChildBySlug(String(route.params.slug)))
</script>

<template>
  <div class="mx-auto w-full max-w-[820px] px-5 pb-20 pt-[34px] sm:px-10">
    <template v-if="child">
      <KidsChildProfileHeader :child="child" />

      <div class="mt-[18px] flex flex-col gap-[26px] lg:flex-row lg:items-start">
        <div class="flex min-w-0 flex-1 flex-col gap-[18px]">
          <KidsChildAlertPanel
            v-for="alert in child.alerts"
            :key="alert.label"
            :alert="alert"
          />
          <KidsChildDetailsCard :child="child" />
        </div>

        <div class="w-full shrink-0 lg:w-[300px]">
          <KidsLinkedParentsCard :child="child" />
        </div>
      </div>
    </template>

    <div v-else class="rounded-[18px] border border-dashed border-hairline bg-surface px-6 py-12 text-center">
      <h1 class="font-display text-[22px] font-semibold text-ink">No encontramos ese niño</h1>
      <p class="mt-2 text-[15px] text-muted">
        El perfil solicitado no existe en esta sala.
      </p>
      <NuxtLink
        to="/kids"
        class="mt-5 inline-block rounded-[12px] bg-coral-soft px-4 py-2 text-[14px] font-extrabold text-terracotta"
      >
        Volver a Niños
      </NuxtLink>
    </div>
  </div>
</template>
