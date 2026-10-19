<script setup lang="ts">
import { currentTeacher, feedMeta } from '~/data/PublicacionesMock'
import AppSidebar from '~/components/app/AppSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-surf">
    <AppSidebar :teacher="currentTeacher" :room="feedMeta.room" />
    <main class="min-w-0 flex-1">
      <NuxtPage />
    </main>
  </div>
</template>
