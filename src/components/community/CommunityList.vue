<script setup>
import { ref, computed } from 'vue';
import { useCommunityStore } from '@/stores/CommunityStore';

const store = useCommunityStore();

const search = ref('');
const sortOption = ref('latest');

const posts = ref([
  {
    category: '교동 불주먹',
    time: '1시간 전',
    title: '오늘 점메추 가능하신분',
    likes: 3,
    comments: 2,
    thumbnail: '',
    ments: [],
  },
  {
    category: '사나이',
    time: '2시간 전',
    title: '오늘밤 주인공은 나야나',
    likes: 5,
    comments: 1,
    thumbnail: '',
    ments: [],
  },
  {
    category: '요아정 맛있어',
    time: '5시간 전',
    title: '오늘 간식은 요아정임',
    likes: 1,
    comments: 4,
    thumbnail: '',
    ments: [],
  },
]);

const filteredPosts = computed(() => {
  const text = search.value.trim().toLowerCase();
  if (!text) return posts.value;
  return posts.value.filter(
    (post) =>
      post.title.toLowerCase().includes(text) ||
      post.category.toLowerCase().includes(text)
  );
});

const sortedPosts = computed(() => {
  const sorted = [...filteredPosts.value];
  if (sortOption.value === 'likes') {
    return sorted.sort((a, b) => b.likes - a.likes);
  } else {
    return sorted;
  }
});

function writePost() {
  store.selectPost({
    title: '',
    content: '',
    category: '',
    time: '방금 전',
    likes: 0,
    comments: 0,
    thumbnail: '',
    ments: [],
  });
}
</script>

<template>
  <v-container fluid class="pa-0">
    <div class="px-4 pt-4 pb-10">
      <!-- 검색 + 글쓰기 -->
      <v-row align="center" no-gutters class="mb-3">
        <v-col cols="9">
          <v-text-field
            v-model="search"
            placeholder="검색어를 입력해 주세요"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded
          />
        </v-col>
        <v-col cols="3" class="text-right ps-2">
          <v-btn color="primary" rounded height="40" @click="writePost">
            글쓰기
          </v-btn>
        </v-col>
      </v-row>

      <!-- 정렬 버튼 -->
      <v-btn-toggle
        v-model="sortOption"
        color="primary"
        rounded
        group
        class="mb-4"
      >
        <v-btn value="latest">최신순</v-btn>
        <v-btn value="likes">좋아요순</v-btn>
      </v-btn-toggle>

      <!-- 게시글 목록 -->
      <v-card
        v-for="(post, index) in sortedPosts"
        :key="index"
        class="mb-3 px-3 py-4 hover-effect"
        elevation="0"
        rounded="xl"
        style="border: 1px solid #e0e0e0"
        @click="store.selectPost(post)"
      >
        <v-row justify="space-between" no-gutters>
          <v-row align="start" no-gutters class="flex-grow-1">
            <!-- 아바타 -->
            <v-avatar size="40" class="me-3" color="grey-lighten-2">
              <v-icon icon="mdi-account" />
            </v-avatar>

            <!-- 텍스트 정보 -->
            <div>
              <div class="text-caption text-grey-darken-1">
                {{ post.category }} · {{ post.time }}
              </div>
              <div class="text-body-1 font-weight-medium">{{ post.title }}</div>
              <div class="text-caption text-grey mt-1">
                ❤️ {{ post.likes }} · 💬 {{ post.comments }}
              </div>
            </div>
          </v-row>

          <!-- 썸네일 -->
          <v-img
            :src="post.thumbnail || ''"
            width="60"
            height="60"
            cover
            rounded
            class="ms-3"
            :class="{ 'bg-grey-lighten-3': !post.thumbnail }"
          />
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.text-caption {
  font-size: 13px;
}
.text-body-1 {
  font-size: 15px;
}

.hover-effect {
  transition: background-color 0.2s ease;
  cursor: pointer;
}

@media (hover: hover) {
  .hover-effect:hover {
    background-color: rgba(100, 100, 100, 0.06) !important;
  }
}
</style>
