<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';

/**
 * Props
 * - modelValue: 다이얼로그 열림/닫힘 (v-model)
 * - images: [{ url, name }] 또는 [{ filePath, fileName }] 배열 (null 섞여도 안전)
 * - startIndex: 처음 보여줄 인덱스
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  images: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 },
});
const emit = defineEmits(['update:modelValue']);

const open = ref(props.modelValue);
watch(
  () => props.modelValue,
  (v) => (open.value = v)
);
watch(open, (v) => emit('update:modelValue', v));

const index = ref(props.startIndex);
watch(
  () => props.startIndex,
  (v) => (index.value = v)
);

/* ---------- 에러 방지: null/undefined 안전 처리 ---------- */
const normalized = computed(() => {
  const arr = Array.isArray(props.images) ? props.images : [];
  return arr
    .filter(Boolean) // null / undefined 제거
    .map((it) => ({
      url: it?.url ?? it?.filePath ?? '',
      name: it?.name ?? it?.fileName ?? '',
    }))
    .filter((img) => !!img.url); // url 없는 항목 제거
});

const total = computed(() => normalized.value.length);
const hasImages = computed(() => total.value > 0);

/* ---------- 반응형 높이: ≤480px ⇒ 350px 고정 ---------- */
const vw = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
const vh = ref(typeof window !== 'undefined' ? window.innerHeight : 768);

const onResize = () => {
  vw.value = window.innerWidth;
  vh.value = window.innerHeight;
};

onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('orientationchange', onResize);
});

const toolbarH = computed(() =>
  vw.value <= 480 ? 46 : vw.value <= 990 ? 56 : 64
);
const carouselHeight = computed(() => {
  if (vw.value <= 480) return 350; // 모바일 고정
  // 그 외: 뷰포트에서 툴바 높이를 뺀 값(최대 820 제한)
  const h = Math.max(240, Math.min(820, vh.value - toolbarH.value));
  return Math.round(h);
});

/* ---------- 좌/우 이동 ---------- */
const prev = () => {
  if (!hasImages.value) return;
  index.value = (index.value - 1 + total.value) % total.value;
};
const next = () => {
  if (!hasImages.value) return;
  index.value = (index.value + 1) % total.value;
};
</script>

<template>
  <v-dialog v-model="open" fullscreen class="lightbox-root">
    <v-card class="d-flex flex-column" elevation="0">
      <v-toolbar color="black" dark class="lightbox-toolbar">
        <v-toolbar-title class="text-subtitle-1"
          >이미지 미리보기</v-toolbar-title
        >
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="open = false" />
      </v-toolbar>

      <v-card-text class="pa-0 lightbox-body">
        <div v-if="hasImages" class="lightbox-inner">
          <!-- 페이지 배지 -->
          <v-chip
            v-if="total > 1"
            class="position-absolute page-chip"
            size="small"
            color="grey-darken-3"
            text-color="white"
          >
            {{ index + 1 }} / {{ total }}
          </v-chip>

          <!-- 좌/우 네비(모바일에선 숨김) -->
          <v-btn
            v-if="total > 1 && vw > 480"
            class="position-absolute nav-btn nav-left"
            icon="mdi-chevron-left"
            variant="tonal"
            color="white"
            @click="prev"
          />
          <v-btn
            v-if="total > 1 && vw > 480"
            class="position-absolute nav-btn nav-right"
            icon="mdi-chevron-right"
            variant="tonal"
            color="white"
            @click="next"
          />

          <!-- 캐러셀 -->
          <v-carousel
            v-model="index"
            class="lightbox-carousel"
            :height="350"
            :style="'height:350px !important'"
            :hide-delimiters="vw <= 480 || total <= 1"
            hide-delimiter-background
            show-arrows="hover"
          >
            <v-carousel-item v-for="(img, i) in normalized" :key="`lb-${i}`">
              <v-img
                :src="img.url"
                :alt="img.name"
                contain
                height="100%"
                width="100%"
              />
            </v-carousel-item>
          </v-carousel>
        </div>

        <div v-else class="empty">표시할 이미지가 없습니다.</div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.position-absolute {
  position: absolute;
}

.lightbox-body {
  background: black;
  position: relative;
}
.lightbox-inner {
  position: relative;
}

.page-chip {
  right: 8px;
  top: 8px;
  z-index: 3;
}

.nav-btn {
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
}
.nav-left {
  left: 10px;
}
.nav-right {
  right: 10px;
}

.empty {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 툴바 제외하고 적당한 높이 */
  min-height: 300px;
}

/* 하단 점 컨트롤 배경 제거 + 패딩 최소화 */
.lightbox-carousel :deep(.v-carousel__controls) {
  background: transparent !important;
  box-shadow: none !important;
  padding-block: 0 !important;
}
@media (max-width: 480px) {
  /* 모바일: 점/컨트롤 영역 자체 숨김 (밑 공백 제거) */
  .lightbox-carousel :deep(.v-carousel__controls) {
    display: none !important;
  }
  .lightbox-toolbar {
    min-height: 46px;
  }
}
@media (max-width: 990px) and (min-width: 481px) {
  .lightbox-toolbar {
    min-height: 56px;
  }
}
</style>
