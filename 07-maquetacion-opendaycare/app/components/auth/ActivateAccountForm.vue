<script setup lang="ts">
import { Check } from '@lucide/vue'

// Formulario de activación de cuenta para familias invitadas por la guardería.
const invitationCode = ref('7K4P9')
const email = ref('lucia.fernandez@gmail.com')
const password = ref('')
const photoConsent = ref(true)
const errorMessage = ref('')

const submit = () => {
  errorMessage.value = ''
  if (!invitationCode.value.trim()) {
    errorMessage.value = 'Ingresá el código de invitación.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    errorMessage.value = 'Ingresá un email válido.'
    return
  }
  if (password.value.length < 8) {
    errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  if (!photoConsent.value) {
    errorMessage.value = 'Necesitamos tu autorización para compartir fotos.'
    return
  }
  navigateTo('/family')
}
</script>

<template>
  <div class="w-full max-w-[440px]">
    <div
      class="mb-[22px] flex size-[58px] items-center justify-center rounded-[18px] bg-white text-white"
      style="background: linear-gradient(155deg, #f8c3a8, #f2937a); box-shadow: 0 12px 26px -10px rgb(238 129 100 / 0.65)"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        />
      </svg>
    </div>

    <h1 class="font-display text-[32px] font-semibold leading-[1.15] text-ink">
      Bienvenida a OpenDayCare
    </h1>
    <p class="mt-[8px] mb-[26px] text-[15.5px] leading-[1.55] text-muted-soft">
      Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.
    </p>

    <div
      class="mb-[22px] flex items-center gap-[14px] rounded-[16px] border-[1.5px] border-field-border bg-white px-4 py-[14px]"
    >
      <div
        class="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-sky font-display text-[19px] font-semibold text-sky-deep"
      >
        M
      </div>
      <div>
        <div class="text-[13px] text-muted-soft">Te invitaron a seguir a</div>
        <div class="font-display text-[17px] font-semibold text-ink">Mateo · Sala Soles</div>
      </div>
    </div>

    <form novalidate @submit.prevent="submit">
      <label
        class="mb-[8px] block text-[12px] font-bold tracking-[0.7px] text-muted-soft"
        for="activation-code"
      >
        CÓDIGO DE INVITACIÓN
      </label>
      <input
        id="activation-code"
        v-model="invitationCode"
        type="text"
        autocomplete="one-time-code"
        class="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] font-display text-[18px] font-bold tracking-[3px] text-ink outline-none placeholder:text-field-placeholder focus:border-coral"
      >

      <label class="mb-[8px] block text-[12px] font-bold tracking-[0.7px] text-muted-soft" for="activation-email">
        EMAIL
      </label>
      <input
        id="activation-email"
        v-model="email"
        type="email"
        autocomplete="email"
        class="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-field-placeholder focus:border-coral"
      >

      <label
        class="mb-[8px] block text-[12px] font-bold tracking-[0.7px] text-muted-soft"
        for="activation-password"
      >
        CREAR CONTRASEÑA
      </label>
      <input
        id="activation-password"
        v-model="password"
        type="password"
        autocomplete="new-password"
        class="mb-[18px] w-full rounded-[14px] border-[1.5px] border-card-hover bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-field-placeholder focus:border-coral"
      >

      <label
        class="mb-[24px] flex cursor-pointer items-start gap-3 rounded-[14px] bg-consent px-4 py-[14px]"
      >
        <input v-model="photoConsent" type="checkbox" class="sr-only">
        <span
          class="mt-px flex size-[24px] shrink-0 items-center justify-center rounded-[8px] transition-colors"
          :class="photoConsent ? 'bg-check-green' : 'border-[1.5px] border-dashed-line bg-white'"
        >
          <Check v-if="photoConsent" :size="15" :stroke-width="3" class="text-white" />
        </span>
        <span class="text-[14px] leading-[1.45] text-consent-text">
          Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.
        </span>
      </label>

      <p v-if="errorMessage" class="mb-[12px] text-center text-[13.5px] font-semibold text-terracotta">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        class="block w-full cursor-pointer rounded-[15px] bg-linear-to-b from-coral-500 to-coral-600 px-4 py-[15px] text-[16px] font-extrabold text-white shadow-cta"
      >
        Activar mi cuenta
      </button>
    </form>

    <p class="mt-[22px] text-center text-[14.5px] text-muted-soft">
      ¿Ya tenés cuenta?
      <NuxtLink to="/login" class="font-extrabold text-edit">Iniciar sesión</NuxtLink>
    </p>
  </div>
</template>
