<script setup lang="ts">
import { Check, Info, Send, X } from '@lucide/vue'
import type { Child, ParentRelationship } from '~/types/child'

// Modal de invitación a un familiar, sobre el perfil del niño.
const props = defineProps<{
  child: Child
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  sent: [payload: { email: string; code: string }]
}>()

// Código de invitación de diseño (mock): no se envía ni se valida contra backend.
const invitationCode = '7K4P9'

const name = ref('')
const email = ref('')
const relationship = ref<ParentRelationship>('mother')
const errorMessage = ref('')
const sent = ref(false)

const relationships: { value: ParentRelationship; label: string }[] = [
  { value: 'mother', label: 'Mamá' },
  { value: 'father', label: 'Papá' },
  { value: 'guardian', label: 'Tutor/a' },
]

const pickRelationship = (value: ParentRelationship) => {
  relationship.value = value
  errorMessage.value = ''
}

const submit = () => {
  errorMessage.value = ''
  if (!name.value.trim()) {
    errorMessage.value = 'Ingresá el nombre del padre o madre.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    errorMessage.value = 'Ingresá un email válido.'
    return
  }
  sent.value = true
  emit('sent', { email: email.value.trim(), code: invitationCode })
}

const close = () => {
  emit('close')
}

// Al reabrir el modal se limpia el estado del intento anterior.
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      sent.value = false
      errorMessage.value = ''
      name.value = ''
      email.value = ''
      relationship.value = 'mother'
    }
  },
)

// Escape cierra el modal mientras está abierto.
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

// El fondo no se desplaza mientras el modal está abierto.
watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/45 px-6 py-10"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        class="w-full max-w-[480px] overflow-hidden rounded-[24px] border border-hairline bg-cream shadow-[0_20px_50px_-24px_rgb(63_54_46_/_0.35)]"
      >
        <div
          class="flex items-center justify-between border-b border-hairline px-[26px] py-[20px]"
        >
          <div>
            <div class="font-display text-[18px] font-semibold text-ink">Vincular padre</div>
            <div class="text-[13px] text-muted">a {{ child.fullName }}</div>
          </div>
          <button
            type="button"
            title="Cerrar"
            class="flex size-[34px] cursor-pointer items-center justify-center rounded-[10px] bg-divider-soft text-muted-soft transition-colors hover:bg-hairline hover:text-ink"
            @click="close"
          >
            <X :size="18" :stroke-width="2.2" />
          </button>
        </div>

        <div class="px-[26px] py-[22px]">
          <template v-if="!sent">
            <div
              class="mb-5 flex gap-[11px] rounded-[14px] bg-royal-banner px-4 py-[13px]"
            >
              <Info :size="20" :stroke-width="2" class="mt-px shrink-0 text-royal" />
              <span class="text-[13.5px] leading-[1.45] text-royal-deep">
                Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed
                de {{ child.fullName.split(' ')[0] }}.
              </span>
            </div>

            <form novalidate @submit.prevent="submit">
              <label
                class="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-soft"
                for="link-parent-name"
              >
                NOMBRE DEL PADRE/MADRE
              </label>
              <input
                id="link-parent-name"
                v-model="name"
                type="text"
                placeholder="Ej. Diego Fernández"
                class="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] text-[15px] text-ink outline-none placeholder:text-field-placeholder focus:border-coral"
              >

              <label
                class="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-soft"
                for="link-parent-email"
              >
                EMAIL
              </label>
              <input
                id="link-parent-email"
                v-model="email"
                type="email"
                placeholder="correo@ejemplo.com"
                class="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] text-[15px] text-ink outline-none placeholder:text-field-placeholder focus:border-coral"
              >

              <div class="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-soft">
                PARENTESCO
              </div>
              <div class="mb-5 flex gap-[9px]">
                <button
                  v-for="option in relationships"
                  :key="option.value"
                  type="button"
                  class="flex-1 cursor-pointer rounded-full border-[1.5px] px-2 py-[11px] text-[14px] font-extrabold transition-colors"
                  :class="
                    relationship === option.value
                      ? 'border-royal-border bg-royal-soft text-royal'
                      : 'border-hairline bg-surface text-nav'
                  "
                  @click="pickRelationship(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>

              <div
                class="mb-5 rounded-[16px] border-[1.5px] border-dashed border-gold-border bg-consent px-4 py-[18px] text-center"
              >
                <div class="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-gold">
                  CÓDIGO DE INVITACIÓN
                </div>
                <div class="font-display text-[34px] font-semibold tracking-[7px] text-consent-text">
                  {{ invitationCode }}
                </div>
                <div class="mt-[6px] text-[13px] text-gold">Vence en 7 días</div>
              </div>

              <p v-if="errorMessage" class="mb-3 text-center text-[13.5px] font-semibold text-terracotta">
                {{ errorMessage }}
              </p>

              <button
                type="submit"
                class="flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-[14px] bg-linear-to-b from-coral-500 to-coral-600 px-4 py-[14px] text-[15.5px] font-extrabold text-white shadow-cta"
              >
                <Send :size="19" :stroke-width="2" />
                Enviar invitación
              </button>
            </form>
          </template>

          <div v-else class="flex flex-col items-center py-6 text-center">
            <div
              class="mb-4 flex size-14 items-center justify-center rounded-full bg-check-green/15 text-check-green"
            >
              <Check :size="28" :stroke-width="2.6" />
            </div>
            <h2 class="font-display text-[21px] font-semibold text-ink">Invitación enviada</h2>
            <p class="mt-2 max-w-[320px] text-[14.5px] leading-[1.5] text-muted-soft">
              Enviamos el código <span class="font-bold text-ink">{{ invitationCode }}</span> a
              <span class="font-bold text-ink">{{ email }}</span> para que active su cuenta.
            </p>
            <p class="mt-1 text-[13.5px] text-muted">
              Solo verá el feed de {{ child.fullName.split(' ')[0] }}.
            </p>
            <button
              type="button"
              class="mt-6 w-full cursor-pointer rounded-[14px] bg-linear-to-b from-coral-500 to-coral-600 px-4 py-[14px] text-[15.5px] font-extrabold text-white shadow-cta"
              @click="close"
            >
              Volver al perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
