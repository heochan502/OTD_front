<script setup>
import { usecommunityStore } from '@/stores/communityStore';
import { ref, computed } from 'vue';

const store = usecommunityStore();
const post = computed(() => store.selectedPost);
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
          인력거로 장사를 하는 가난한 집 청지에게 가중이라는 병으로 생사를
          넘나드는 아내와 세 살배기 가형동이가 있었다. 평소 아내를 매정하게
          대하는 집 청지였지만 오늘 따라 아픈 아내는 장사를 나서는 집 청지에게
          유독 매달리는 느낌이 들었다. 그런 아내를 애써 무시하며 집 청지는
          장사를 하러 떠났다.
        </div>

        <div class="d-flex justify-end mb-4">
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
