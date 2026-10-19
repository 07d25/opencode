<script setup lang="ts">
import { Heart, MessageCircle } from '@lucide/vue'
import type { FeedPost } from '~/types/feed'

// Pie de la publicación: likes, comentarios y edición (todo visual).
defineProps<{
  post: FeedPost
}>()
</script>

<template>
  <div class="mt-4 flex items-center gap-[18px] border-t border-divider-soft pt-3.5">
    <span class="flex items-center gap-[7px] text-[14px] font-bold text-accent">
      <Heart :size="19" class="fill-accent" />
      {{ post.likes }}
    </span>
    <span class="flex items-center gap-[7px] text-[14px] font-bold text-muted-soft">
      <MessageCircle :size="18" />
      {{ post.comments }}
    </span>
    <span class="flex-1"></span>
    <a class="cursor-pointer text-[14px] font-extrabold text-edit">Editar</a>
  </div>
</template>
