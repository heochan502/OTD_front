<script setup>
import { usecommunityStore } from '@/stores/communityStore';
import { useAccountStore } from '@/stores/counter';
import { ref, computed } from 'vue';

const store = usecommunityStore();
const account = useAccountStore();

// post는 store에서 가져오기
const post = computed(() => store.selectedPost);

// 현재 로그인한 사용자와 글 작성자 비교
const isOwner = computed(() => {
  console.log('post.memberNoLogin:', post.value?.memberNoLogin);
  console.log('loggedInId:', account.loggedInId);
  return Number(post.value?.memberNoLogin) === Number(account.loggedInId);
});

// 더미 댓글
const dummyMents = ref([
  { nickname: '대구 티타늄', time: '3분 전', text: '굶으세요' },
  { nickname: '수빈잉', time: '15분 전', text: '맛있는 거 먹자!' },
]);
</script>

<template>
  <v-container class="pa-6" fluid>
    <v-btn @click="store.goList()" variant="text" color="primary" class="mb-4">
      ← 목록으로
    </v-btn>

    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <v-card-text>
        <h2 class="mt-2 mb-4 font-weight-bold text-h5">{{ post.title }}</h2>

        <div class="d-flex align-center mb-4 text-grey text-body-2">
          <span class="mr-4">{{ post.nickname }}</span>
          <span class="mr-4">1시간 전</span>
          <span>조회수 130회</span>
        </div>

        <div class="text-body-1 mb-6" style="white-space: pre-line">
          {{ post.content }}
        </div>

        <!-- 본인 글일 때만 노출 -->
        <div class="d-flex justify-end mb-4" v-if="isOwner">
          <v-btn variant="text" color="blue" @click="store.goEdit()"
            >수정하기</v-btn
          >
          <v-btn variant="text" color="red">삭제하기</v-btn>
        </div>

        <!-- 구분선 -->
        <v-divider class="my-6" />

        <!-- 댓글 섹션 -->
        <div class="comment-section">
          <div class="text-subtitle-2 font-weight-medium mb-3">
            댓글 {{ dummyMents.length }}개
          </div>

          <v-list class="mb-4">
            <v-list-item v-for="(ment, idx) in dummyMents" :key="idx">
              <div
                class="d-flex align-center justify-space-between"
                style="width: 100%"
              >
                <div class="d-flex align-center">
                  <v-avatar size="36" class="mr-2">
                    <v-icon>mdi-account-circle</v-icon>
                  </v-avatar>
                  <span class="text-subtitle-2 font-weight-medium">
                    {{ ment.nickname }}
                  </span>
                </div>
                <span class="text-caption text-grey">{{ ment.time }}</span>
              </div>

              <!-- 댓글 내용 -->
              <div class="text-body-2 mt-1 pl-10">{{ ment.text }}</div>
            </v-list-item>
          </v-list>

          <!-- 댓글 입력창 -->
          <v-text-field
            placeholder="댓글을 입력하세요"
            variant="outlined"
            density="comfortable"
            rounded
            append-inner-icon="mdi-send"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-list-item {
  align-items: flex-start;
  padding-top: 12px;
  padding-bottom: 12px;
}

.comment-section {
  padding-left: 2rem;
}
</style>
