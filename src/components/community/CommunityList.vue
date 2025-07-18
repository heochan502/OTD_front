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

        <v-btn color="primary" rounded="lg" @click="goToWrite"> 글쓰기 </v-btn>
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
              <v-img :src="post.avatar" alt="프로필" />
            </v-avatar>
            <div>
              <div class="text-caption text-grey-darken-1">
                {{ post.category }} · {{ post.time }}
              </div>
              <div class="font-weight-medium">{{ post.title }}</div>
            </div>
          </v-row>

          <v-img
            :src="post.image"
            alt="썸네일"
            width="60"
            height="60"
            class="rounded-lg"
            cover
          />
        </v-row>

        <v-row class="mt-3" dense>
          <v-icon size="18" color="grey" class="mr-1">mdi-heart-outline</v-icon>
          <span class="text-caption mr-4">{{ post.likes }}</span>

          <v-icon size="18" color="grey" class="mr-1"
            >mdi-comment-outline</v-icon
          >
          <span class="text-caption">{{ post.comments }}</span>
        </v-row>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const search = ref('');
const sort = ref('최신순');
const sortOptions = ['최신순', '인기순', '댓글순'];

const posts = ref([
  {
    nickname: '교동불주먹',
    time: '1시간 전',
    title: '오늘 점메추 가능하신분',
    likes: 0,
    comments: 3,
    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
    image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
  },
  {
    nickname: '대구상남자',
    time: '2시간 전',
    title: '오늘밤 주인공은 나야나',
    likes: 0,
    comments: 3,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
  },
  {
    nickname: '요아정러버',
    time: '5시간 전',
    title: '오늘 간식은 요아정',
    likes: 0,
    comments: 3,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
    image: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
  },
]);

const goToWrite = () => {
  // 글쓰기 이동 로직 추가
};
</script>

<style scoped></style>
