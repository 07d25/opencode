<script setup lang="ts">
import ActivateAccountForm from '~/components/auth/ActivateAccountForm.vue'

useSeoMeta({
  title: 'Activar cuenta · OpenDayCare',
  description: 'Creá tu contraseña para activar tu cuenta de OpenDayCare.',
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-cream px-[30px] py-[40px]">
    <ActivateAccountForm />
  </div>
</template>
