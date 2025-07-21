<template>
  <v-container fluid class="pa-6">
    <v-card class="pa-6" elevation="2" rounded="xl">
      <v-row align="center" justify="space-between" class="mb-6">
        <v-text-field
          v-model="search"
          placeholder="검색어를 입력해 주세요"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          class="mr-4"
          style="max-width: 400px"
        />

        <v-btn color="primary" rounded="lg" @click="goToWrite">글쓰기</v-btn>
      </v-row>

      <v-select
        v-model="sort"
        :items="sortOptions"
        label="정렬 기준"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        hide-details
        style="max-width: 200px"
      />

      <v-card
        v-for="(post, index) in posts"
        :key="index"
        class="mb-4 pa-4"
        rounded="xl"
        elevation="1"
      >
        <v-row no-gutters align="center" justify="space-between">
          <v-row align="center">
            <v-avatar class="mr-4" size="40">
              <v-img :src="post.avatar || defaultAvatar" alt="프로필" />
            </v-avatar>
            <div>
              <div class="text-caption text-grey-darken-1">
                {{ post.nickname || '익명' }} · {{ formatTime(post.createdAt) }}
              </div>
              <div class="font-weight-medium">{{ post.title }}</div>
            </div>
          </v-row>

          <v-img
            v-if="post.filePath"
            :src="post.filePath"
            alt="썸네일"
            width="60"
            height="60"
            class="rounded-lg"
            cover
          />
        </v-row>

        <v-row class="mt-3" dense>
          <v-icon size="18" color="grey" class="mr-1">mdi-heart-outline</v-icon>
          <span class="text-caption mr-4">{{ post.like }}</span>

          <v-icon size="18" color="grey" class="mr-1"
            >mdi-comment-outline</v-icon
          >
          <span class="text-caption">{{ post.comments ?? 0 }}</span>
        </v-row>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter();

const search = ref('');
const sort = ref('최신순');
const sortOptions = ['최신순', '인기순', '댓글순'];
const defaultAvatar =
  'https://cdn.vuetifyjs.com/images/profiles/default_avatar.png';

// 나중에 실제 axios로 API 연동 시 replace
const posts = ref([
  {
    postId: 1,
    memberNoLogin: 12,
    nickname: '교동불주먹',
    title: '오늘 점메추 가능하신분',
    createdAt: '2025-07-18T11:03:00',
    filePath: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
    like: 0,
    comments: 3,
    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
  },
  {
    postId: 2,
    memberNoLogin: 5,
    nickname: '대구상남자',
    title: '오늘밤 주인공은 나야나',
    createdAt: '2025-07-18T09:00:00',
    filePath: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    like: 0,
    comments: 5,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  },
]);

const goToWrite = () => {
  router.push('/community/write');
};

const formatTime = (time) => {
  return dayjs(time).fromNow(); // 예: 1시간 전
};
</script>

<style scoped></style>
