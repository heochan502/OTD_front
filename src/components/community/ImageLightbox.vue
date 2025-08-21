<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // v-model로 열림/닫힘
  images: { type: Array, default: () => [] },    // [{ url, name }] 또는 [{ filePath, fileName }]
  startIndex: { type: Number, default: 0 },      // 처음 보여줄 인덱스
});
const emit = defineEmits(['update:modelValue']);

const open = ref(props.modelValue);
watch(() => props.modelValue, v => (open.value = v));
watch(open, v => emit('update:modelValue', v));

const index = ref(props.startIndex);
watch(() => props.startIndex, v => (index.value = v));

const normalized = computed(() =>
  (props.images || []).map((it) => ({
    url: it.url ?? it.filePath ?? '',
    name: it.name ?? it.fileName ?? '',
  }))
);

const hasImages = computed(() => normalized.value.length > 0);
const total = computed(() => normalized.value.length);

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
  <v-dialog v-model="open" fullscreen>
    <v-card class="d-flex flex-column" elevation="0">
      <v-toolbar color="black" dark>
        <v-toolbar-title class="text-subtitle-1">이미지 미리보기</v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="open = false" />
      </v-toolbar>

      <v-card-text class="pa-0" style="background:black; position: relative;">
        <div v-if="hasImages">
          <!-- 상단 페이지 배지 -->
          <v-chip
            v-if="total > 1"
            class="position-absolute ma-3"
            style="right: 0; z-index: 3;"
            size="small"
            color="grey-darken-3"
            text-color="white"
          >
            {{ index + 1 }} / {{ total }}
          </v-chip>

          <!-- 좌/우 오버레이 화살표 -->
          <v-btn
            v-if="total > 1"
            class="position-absolute"
            style="left: 8px; top: 50%; transform: translateY(-50%); z-index: 3;"
            icon="mdi-chevron-left"
            variant="tonal"
            color="white"
            @click="prev"
          />
          <v-btn
            v-if="total > 1"
            class="position-absolute"
            style="right: 8px; top: 50%; transform: translateY(-50%); z-index: 3;"
            icon="mdi-chevron-right"
            variant="tonal"
            color="white"
            @click="next"
          />

          <!-- 캐러셀 (하단 점 포함) -->
          <v-carousel
            v-model="index"
            height="calc(100vh - 64px)"
            show-arrows="hover"
            :hide-delimiters="total <= 1"
            cycle
          >
            <v-carousel-item v-for="(img, i) in normalized" :key="i">
              <v-img :src="img.url" :alt="img.name" contain height="100%" />
            </v-carousel-item>
          </v-carousel>
        </div>

        <div
          v-else
          class="d-flex align-center justify-center"
          style="height: calc(100vh - 64px); color: white;"
        >
          표시할 이미지가 없습니다.
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.position-absolute { position: absolute; }
</style>
