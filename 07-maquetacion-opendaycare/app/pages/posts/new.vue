<script setup lang="ts">
import { Image, Plus, X } from '@lucide/vue'
import { feedPosts } from '~/data/PublicacionesMock'
import { kids } from '~/data/KidsMock'
import type { Child } from '~/types/child'
import type { FeedPost, PostType } from '~/types/feed'
import FeedPostTypeChip from '~/components/feed/PostTypeChip.vue'
import FeedRecipientChip from '~/components/feed/RecipientChip.vue'

// Pantalla de nueva publicación: destinatario, tipo, descripción y fotos.
useSeoMeta({
  title: 'Nueva publicación · OpenDayCare',
  description: 'Compartí un momento del día con las familias de la sala.',
})

// Niños destinatarios de la sala (los tres primeros del mock).
const recipientKids = kids.slice(0, 3)

const recipientSlug = ref<string>(recipientKids[0]?.slug ?? '')
const postType = ref<PostType>('activity')
const description = ref(
  'Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón.',
)
const errorMessage = ref('')

// Fotos elegidas con su vista previa local (URL de objeto, sin subir).
const photos = ref<{ name: string; url: string }[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

const typeOptions: { value: PostType; label: string }[] = [
  { value: 'food', label: 'Comida' },
  { value: 'nap', label: 'Siesta' },
  { value: 'activity', label: 'Actividad' },
  { value: 'achievement', label: 'Logro' },
  { value: 'mood', label: 'Ánimo' },
  { value: 'photo', label: 'Foto' },
  { value: 'announcement', label: 'Anuncio' },
]

const avatarClasses: Record<string, string> = {
  sky: 'bg-sky text-sky-deep',
  pink: 'bg-pink text-pink-deep',
  mint: 'bg-mint-avatar text-mint-avatar-deep',
  yellow: 'bg-yellow text-yellow-deep',
  violet: 'bg-violet text-violet-deep',
}

// Niño destinatario seleccionado (null cuando es toda la sala).
const selectedKid = computed<Child | null>(
  () => recipientKids.find((kid) => kid.slug === recipientSlug.value) ?? null,
)

const pickRecipient = (slug: string) => {
  recipientSlug.value = slug
  errorMessage.value = ''
}

const pickType = (type: PostType) => {
  postType.value = type
  errorMessage.value = ''
}

const openFilePicker = () => fileInput.value?.click()

const onFilesSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])].filter((file) => file.type.startsWith('image/'))
  photos.value = [...photos.value, ...files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))]
  input.value = ''
}

const removePhoto = (index: number) => {
  const [removed] = photos.value.splice(index, 1)
  if (removed) URL.revokeObjectURL(removed.url)
}

const currentTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

const publish = () => {
  errorMessage.value = ''
  if (!recipientSlug.value) {
    errorMessage.value = 'Elegí para quién es la publicación.'
    return
  }
  if (!description.value.trim()) {
    errorMessage.value = 'Contá cómo le fue hoy.'
    return
  }

  const kid = selectedKid.value
  const firstName = kid ? kid.fullName.split(' ')[0] : ''
  const photo = photos.value[0]

  const post: FeedPost = {
    id: `post-${Date.now()}`,
    type: postType.value,
    title: kid ? firstName : 'Anuncio general',
    initials: kid ? kid.initials : '',
    time: currentTime(),
    publisherLabel: 'publicado por vos',
    recipient: kid ? `familia de ${firstName}` : 'toda la sala',
    content: description.value.trim(),
    photoCaption: photo ? `Foto · ${photo.name}` : undefined,
    photoUrl: photo?.url,
    likes: 0,
    comments: 0,
  }

  feedPosts.value.unshift(post)
  navigateTo('/')
}

// Las fotos que no se publican liberan su URL de objeto.
onBeforeUnmount(() => {
  for (const photo of photos.value) URL.revokeObjectURL(photo.url)
})
</script>

<template>
  <div class="flex min-h-screen items-start justify-center bg-surf px-6 py-10">
    <div
      class="w-full max-w-[580px] overflow-hidden rounded-[24px] border border-hairline bg-cream shadow-[0_20px_50px_-24px_rgb(63_54_46_/_0.35)]"
    >
      <div
        class="flex items-center justify-between border-b border-hairline px-[26px] py-[20px]"
      >
        <NuxtLink
          to="/"
          class="text-[15px] font-bold text-muted-soft transition-colors hover:text-ink"
        >
          Cancelar
        </NuxtLink>
        <span class="font-display text-[18px] font-semibold text-ink">Nueva publicación</span>
        <button
          type="button"
          class="cursor-pointer text-[15px] font-extrabold text-terracotta transition-opacity hover:opacity-75"
          @click="publish"
        >
          Publicar
        </button>
      </div>

      <div class="px-[26px] py-[24px]">
        <div class="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-soft">
          PARA
        </div>
        <div class="mb-[22px] flex flex-wrap gap-[9px]">
          <FeedRecipientChip
            v-for="kid in recipientKids"
            :key="kid.slug"
            :label="kid.fullName.split(' ')[0]"
            :initials="kid.initials"
            :avatar-class="avatarClasses[kid.avatarTone]"
            :selected="recipientSlug === kid.slug"
            @select="pickRecipient(kid.slug)"
          />
          <FeedRecipientChip
            label="Toda la sala"
            :selected="recipientSlug === 'room'"
            @select="pickRecipient('room')"
          />
        </div>

        <div class="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-soft">
          TIPO
        </div>
        <div class="mb-[22px] flex flex-wrap gap-[9px]">
          <FeedPostTypeChip
            v-for="option in typeOptions"
            :key="option.value"
            :type="option.value"
            :label="option.label"
            :selected="postType === option.value"
            @select="pickType"
          />
        </div>

        <div class="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-soft">
          DESCRIPCIÓN
        </div>
        <textarea
          v-model="description"
          placeholder="Contá cómo le fue hoy…"
          class="mb-[22px] min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] leading-[1.5] text-ink outline-none placeholder:text-field-placeholder focus:border-coral"
        />

        <div class="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-soft">
          FOTOS
        </div>
        <div class="flex flex-wrap gap-3">
          <div
            class="flex size-24 items-center justify-center rounded-[14px] border border-hairline bg-placeholder text-chevron"
          >
            <Image :size="26" :stroke-width="1.7" />
          </div>

          <div
            v-for="(photo, index) in photos"
            :key="photo.url"
            class="relative size-24 overflow-hidden rounded-[14px] border border-hairline bg-placeholder"
          >
            <img :src="photo.url" :alt="photo.name" class="size-full object-cover">
            <button
              type="button"
              title="Quitar foto"
              class="absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-ink/70 text-white"
              @click="removePhoto(index)"
            >
              <X :size="13" :stroke-width="2.4" />
            </button>
          </div>

          <button
            type="button"
            class="flex size-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-dashed-line bg-placeholder text-placeholder-text transition-colors hover:border-coral hover:text-edit"
            @click="openFilePicker"
          >
            <Plus :size="22" :stroke-width="2" class="text-edit" />
            <span class="text-[12px]">Agregar</span>
          </button>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="onFilesSelected"
          >
        </div>

        <p v-if="errorMessage" class="mt-4 text-center text-[13.5px] font-semibold text-terracotta">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
