<template>
  <div class="w-full max-w-3xl mx-auto px-4 py-6">
    <!-- 검색창 & 글쓰기 -->
    <div class="flex items-center gap-2 mb-4">
      <div class="flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1">
        <i class="i-lucide-search text-gray-400 mr-2"></i>
        <input
          type="text"
          placeholder="검색어를 입력해 주세요"
          class="bg-transparent outline-none w-full text-sm"
        />
      </div>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
        글쓰기
      </button>
    </div>

    <!-- 정렬기준 -->
    <div class="flex justify-between items-center text-sm text-gray-500 mb-2">
      <span>정렬 기준</span>
      <i class="i-lucide-chevron-down"></i>
    </div>

    <!-- 게시글 리스트 -->
    <div class="space-y-3">
      <div
        v-for="(post, idx) in posts"
        :key="idx"
        class="flex items-center justify-between border rounded-xl px-4 py-3"
      >
        <!-- 왼쪽: 프로필 + 내용 -->
        <div class="flex items-start gap-3 flex-1">
          <img alt="프로필" class="w-10 h-10 rounded-full bg-gray-200" />
          <div class="text-sm">
            <div class="text-gray-500 mb-0.5">
              {{ post.category }} · {{ post.time }}
            </div>
            <div class="font-medium">{{ post.text }}</div>
            <div class="text-gray-400 text-xs mt-1 flex gap-3">
              <span>♡ {{ post.likes }}</span>
              <span>💬 {{ post.comments }}</span>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 썸네일 -->
        <div class="w-16 h-16 rounded-lg bg-gray-200 shrink-0"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const posts = [
  {
    category: '교통 불편지역',
    time: '1시간 전',
    text: '오늘 졸매추 가상하신분',
    likes: 0,
    comments: 3,
  },
  {
    category: '사나이 울레는',
    time: '2시간 전',
    text: '오늘밤 주인공은 나야나',
    likes: 0,
    comments: 3,
  },
  {
    category: '샐러드 맛있어',
    time: '5시간 전',
    text: '오늘 간식은 요야정임',
    likes: 0,
    comments: 3,
  },
];
</script>
