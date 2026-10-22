<script setup lang="ts">
import { Megaphone } from '@lucide/vue'
import type { FeedPost } from '~/types/feed'
import UiBaseAvatar from '~/components/ui/BaseAvatar.vue'
import FeedPostBadge from '~/components/feed/PostBadge.vue'
import FeedPhotoPlaceholder from '~/components/feed/PhotoPlaceholder.vue'
import FeedPostFooter from '~/components/feed/PostFooter.vue'

// Tarjeta de una publicación del feed.
defineProps<{
  post: FeedPost
}>()
</script>

<template>
  <article class="rounded-[20px] border border-hairline bg-surface p-5 shadow-card">
    <div class="mb-3.5 flex items-center gap-3">
      <UiBaseAvatar
        v-if="post.initials"
        :initials="post.initials"
        tone="sky"
        size="lg"
      />
      <UiBaseAvatar v-else tone="royal" size="lg">
        <Megaphone :size="20" />
      </UiBaseAvatar>
      <div class="flex-1">
        <div class="font-display text-[16.5px] font-semibold text-ink">{{ post.title }}</div>
        <div class="text-[12.5px] text-muted">{{ post.time }} · {{ post.publisherLabel }}</div>
      </div>
      <FeedPostBadge :type="post.type" />
    </div>

    <div class="mb-2.5 text-[12.5px] text-muted">Para: {{ post.recipient }}</div>
    <p class="text-[15.5px] leading-[1.55] text-body">{{ post.content }}</p>

    <img
      v-if="post.photoUrl"
      :src="post.photoUrl"
      :alt="post.photoCaption || 'Foto de la publicación'"
      class="mt-[14px] h-[200px] w-full rounded-[16px] border border-hairline object-cover"
    >

    <FeedPhotoPlaceholder
      v-else-if="post.photoCaption"
      :caption="post.photoCaption"
    />

    <FeedPostFooter :post="post" />
  </article>
</template>
