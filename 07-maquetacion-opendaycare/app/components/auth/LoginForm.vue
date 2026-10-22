<script setup lang="ts">
import { Users, User } from '@lucide/vue'

type LoginRole = 'staff' | 'parent'

// Formulario de login del personal y de las familias.
const role = ref<LoginRole>('staff')
const email = ref('caro@opendaycare.com')
const password = ref('')
const errorMessage = ref('')

const roleOptions: { value: LoginRole; label: string; email: string }[] = [
  { value: 'staff', label: 'Personal', email: 'caro@opendaycare.com' },
  { value: 'parent', label: 'Familia', email: 'lucia.fernandez@gmail.com' },
]

const pickRole = (option: (typeof roleOptions)[number]) => {
  role.value = option.value
  email.value = option.email
  errorMessage.value = ''
}

const submit = () => {
  errorMessage.value = ''
  if (!email.value.trim()) {
    errorMessage.value = 'Ingresá tu email.'
    return
  }
  if (!password.value) {
    errorMessage.value = 'Ingresá tu contraseña.'
    return
  }
  navigateTo(role.value === 'staff' ? '/' : '/family')
}
</script>

<template>
  <div class="w-full max-w-[392px]">
    <h2 class="font-display text-[30px] font-semibold text-ink">Iniciar sesión</h2>
    <p class="mt-[6px] text-[15px] text-muted-soft">Ingresá para ver el día de hoy.</p>

    <div class="mt-[28px] mb-[9px] text-[12px] font-bold tracking-[0.7px] text-muted-soft">
      INGRESO COMO
    </div>
    <div class="mb-[22px] flex gap-[10px]">
      <button
        v-for="option in roleOptions"
        :key="option.value"
        type="button"
        class="flex flex-1 cursor-pointer items-center gap-[9px] rounded-[14px] border-[1.5px] px-[14px] py-[13px] text-[14px] font-bold transition-[background-color,border-color,color] duration-150"
        :class="
          role === option.value
            ? 'border-coral bg-coral-soft text-terracotta'
            : 'border-field-border bg-white text-nav'
        "
        @click="pickRole(option)"
      >
        <Users v-if="option.value === 'staff'" :size="18" :stroke-width="2" />
        <User v-else :size="18" :stroke-width="2" />
        {{ option.label }}
      </button>
    </div>

    <form novalidate @submit.prevent="submit">
      <label class="mb-[8px] block text-[12px] font-bold tracking-[0.7px] text-muted-soft" for="login-email">
        EMAIL
      </label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        autocomplete="email"
        class="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-field-placeholder focus:border-coral"
      >

      <label class="mb-[8px] block text-[12px] font-bold tracking-[0.7px] text-muted-soft" for="login-password">
        CONTRASEÑA
      </label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
        class="mb-[10px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-field-placeholder focus:border-coral"
      >

      <div class="mb-[20px] text-right">
        <span class="cursor-pointer text-[13.5px] font-bold text-edit">¿Olvidaste tu contraseña?</span>
      </div>

      <p v-if="errorMessage" class="mb-[12px] text-center text-[13.5px] font-semibold text-terracotta">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        class="block w-full cursor-pointer rounded-[15px] bg-linear-to-b from-coral-500 to-coral-600 px-4 py-[15px] text-[16px] font-extrabold text-white shadow-cta"
      >
        Iniciar sesión
      </button>
    </form>

    <p class="mt-[24px] text-center text-[14.5px] text-muted-soft">
      ¿Te invitó la guardería?
      <NuxtLink to="/activate-account" class="font-extrabold text-edit">Activá tu cuenta</NuxtLink>
    </p>
  </div>
</template>
