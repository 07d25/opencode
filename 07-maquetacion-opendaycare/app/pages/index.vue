<script setup lang="ts">
import { currentTeacher, feedMeta, feedPosts } from '~/data/PublicacionesMock'
import AppSidebar from '~/components/app/AppSidebar.vue'
import FeedHeader from '~/components/feed/FeedHeader.vue'
import FeedCreatePostPrompt from '~/components/feed/CreatePostPrompt.vue'
import FeedPostsDivider from '~/components/feed/PostsDivider.vue'
import FeedPostCard from '~/components/feed/PostCard.vue'

// Lista reactiva del feed: incluye las publicaciones nuevas creadas en memoria.
const posts = feedPosts
</script>

<template>
  <div class="flex min-h-screen bg-surf">
    <AppSidebar :teacher="currentTeacher" :room="feedMeta.room" />

    <main class="min-w-0 flex-1">
      <div class="mx-auto w-full max-w-[760px] px-5 pb-20 pt-[34px] sm:px-10">
        <FeedHeader :meta="feedMeta" />
        <FeedCreatePostPrompt :teacher="currentTeacher" />
        <FeedPostsDivider />

        <div class="flex flex-col gap-4">
          <FeedPostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>
      </div>
    </main>
  </div>
</template>
