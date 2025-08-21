<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';
import { createPost } from '@/services/community/communityService';
import ImageLightbox from '@/components/community/ImageLightbox.vue';

const store = usecommunityStore();

// 상태
const title = ref('');
const content = ref('');        // ← 내용 textarea 유지
const files = ref([]);          // File[]
const previews = ref([]);       // [{ url, name, size }]
const selectedIndex = ref(0);   // 대표(커버) 인덱스(미리보기용)
const lightboxOpen = ref(false);
const loading = ref(false);
const errMsg = ref('');
const fileInput = ref(null);

// 제한
const TITLE_MAX = 200;
const CONTENT_MAX = 3000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;   // 10MB
const MAX_TOTAL_SIZE = 30 * 1024 * 1024;  // 30MB

const titleRules = [
  v => !!v || '제목을 입력하세요.',
  v => (v?.length || 0) <= TITLE_MAX || `최대 ${TITLE_MAX}자까지 가능합니다.`
];
const contentRules = [
  v => !!v || '내용을 입력하세요.',
  v => (v?.length || 0) <= CONTENT_MAX || `최대 ${CONTENT_MAX}자까지 가능합니다.`
];

// 대표 미리보기
const mainPreview = computed(() => previews.value[selectedIndex.value]);

// 유틸
const toArray = (x) => (Array.isArray(x) ? x : Array.from(x || []));
const humanSize = (n) => {
  if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  if (n >= 1024) return (n / 1024).toFixed(0) + ' KB';
  return n + ' B';
};
const revokeAll = () => {
  previews.value.forEach(p => URL.revokeObjectURL(p.url));
  previews.value = [];
  selectedIndex.value = 0;
};

function acceptFiles(listOrArray) {
  const incoming = toArray(listOrArray);
  let total = files.value.reduce((s, f) => s + f.size, 0);
  const accepted = [];

  for (const f of incoming) {
    if (!f?.type?.startsWith?.('image/')) {
      errMsg.value = '이미지 파일만 업로드할 수 있습니다.';
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      errMsg.value = `파일당 최대 10MB까지 가능합니다: ${f.name}`;
      return;
    }
    total += f.size;
    if (total > MAX_TOTAL_SIZE) {
      errMsg.value = '총 업로드 용량은 30MB를 초과할 수 없습니다.';
      return;
    }
    const dup = files.value.find(ff => ff.name === f.name && ff.size === f.size && ff.lastModified === f.lastModified);
    if (!dup) accepted.push(f);
  }

  for (const f of accepted) {
    files.value.push(f);
    previews.value.push({ url: URL.createObjectURL(f), name: f.name, size: f.size });
  }
  if (previews.value.length && selectedIndex.value >= previews.value.length) {
    selectedIndex.value = previews.value.length - 1;
  }
  errMsg.value = '';
}

function onNativePicked(e) {
  acceptFiles(e.target?.files);
  if (e.target) e.target.value = ''; // 같은 파일 재선택 허용
}
function onDrop(e) {
  e.preventDefault();
  acceptFiles(e.dataTransfer?.files);
}
function openPicker() {
  fileInput.value?.click();
}

// 썸네일 동작
function setAsCover(i) {
  if (i === 0) { selectedIndex.value = 0; return; }
  // i번째를 맨 앞으로 이동(대표로) → 백엔드에서 첫 파일을 대표 이미지로 사용
  const f = files.value.splice(i, 1)[0];
  const p = previews.value.splice(i, 1)[0];
  files.value.unshift(f);
  previews.value.unshift(p);
  selectedIndex.value = 0;
}
function removeAt(i) {
  if (previews.value[i]) URL.revokeObjectURL(previews.value[i].url);
  files.value.splice(i, 1);
  previews.value.splice(i, 1);
  if (selectedIndex.value >= previews.value.length) {
    selectedIndex.value = Math.max(0, previews.value.length - 1);
  }
}
function clearAll() {
  revokeAll();
  files.value = [];
  errMsg.value = '';
}

// 제출/취소
async function submitPost() {
  errMsg.value = '';
  if (!title.value.trim() || !content.value.trim()) {
    errMsg.value = '제목과 내용을 모두 입력하세요.';
    return;
  }
  const fd = new FormData();
  fd.append('title', title.value.trim());
  fd.append('content', content.value.trim()); // ← textarea 내용 사용
  for (const f of files.value) fd.append('files', f); // 첫 파일이 대표로 저장됨

  try {
    loading.value = true;
    await createPost(fd);
    title.value = '';
    content.value = '';
    clearAll();
    store.goList();
  } catch (e) {
    console.error(e);
    errMsg.value = '글 등록에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

function cancelWrite() {
  clearAll();
  title.value = '';
  content.value = '';
  store.goList();
}

onBeforeUnmount(revokeAll);
</script>

<template>
  <v-container class="py-8" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="7">
        <v-card elevation="2" rounded="xl">
          <v-toolbar flat color="transparent" density="comfortable">
            <v-toolbar-title class="text-h6 font-weight-bold">게시글 작성</v-toolbar-title>
          </v-toolbar>
          <v-divider />

          <v-card-text class="pt-6">
            <!-- 제목 -->
            <v-text-field
              v-model="title"
              label="제목"
              variant="outlined"
              density="comfortable"
              :rules="titleRules"
              :counter="TITLE_MAX"
              clearable
              class="mb-4"
            />

            <!-- 내용(유지) -->
            <v-textarea
              v-model="content"
              label="내용"
              variant="outlined"
              auto-grow
              :rules="contentRules"
              :counter="CONTENT_MAX"
              rows="6"
              clearable
              class="mb-2"
            />

            <!-- 드롭존 + 버튼 -->
            <div class="d-flex align-center gap-2">
              <v-sheet
                class="dropzone rounded-lg text-medium-emphasis flex-grow-1"
                color="surface"
                @dragover.prevent
                @drop="onDrop"
                @click="openPicker"
                height="120"
              >
                <div class="text-center">
                  <div class="mb-1">
                    <v-icon icon="mdi-image-plus" size="28" />
                  </div>
                  <div class="text-body-2">
                    이미지를 드래그하거나 클릭하여 선택하세요
                  </div>
                  <div class="text-caption mt-1">
                    파일당 최대 10MB, 총 30MB
                  </div>
                </div>
              </v-sheet>

              <v-btn variant="outlined" color="primary" @click="openPicker">
                파일 선택
              </v-btn>
              <input
                ref="fileInput"
                type="file"
                class="d-none"
                accept="image/*"
                multiple
                @change="onNativePicked"
              />
            </div>

            <!-- 대표 미리보기(전체폭) -->
            <v-expand-transition>
              <div v-if="mainPreview" class="mt-4">
                <v-card variant="tonal" rounded="lg" class="overflow-hidden">
                  <v-img
                    :src="mainPreview.url"
                    aspect-ratio="16/9"
                    cover
                    min-height="260"
                    class="cursor-pointer"
                    @click="lightboxOpen = true"
                  >
                    <template #placeholder>
                      <v-skeleton-loader type="image"></v-skeleton-loader>
                    </template>
                  </v-img>
                  <v-card-text class="py-2 text-caption text-medium-emphasis">
                    위 이미지가 대표사진으로 표시됩니다. 아래 미리보기에서 <strong>대표사진</strong>을 눌러 변경하세요.
                  </v-card-text>
                </v-card>
              </div>
            </v-expand-transition>

            <!-- 썸네일 그리드 -->
            <v-row v-if="previews.length" dense class="mt-3">
              <v-col
                v-for="(p, i) in previews"
                :key="i"
                cols="6" sm="4" md="3"
              >
                <v-card
                  :elevation="selectedIndex === i ? 3 : 1"
                  :class="['overflow-hidden', 'rounded-lg', 'thumb-card', selectedIndex === i ? 'is-cover' : '']"
                >
                  <v-img :src="p.url" aspect-ratio="1" cover @click="selectedIndex = i">
                    <template #error>
                      <div class="thumb-fallback d-flex align-center justify-center">
                        <v-icon size="24" icon="mdi-image-off-outline" />
                      </div>
                    </template>
                  </v-img>
                  <div class="d-flex justify-space-between align-center px-2 py-1">
                    <span class="text-truncate text-caption" :title="p.name">{{ p.name }}</span>
                  </div>
                  <div class="d-flex justify-space-between align-center px-2 pb-2">
                    <v-btn
                      size="x-small"
                      variant="text"
                      color="primary"
                      @click.stop="setAsCover(i)"
                    >대표사진</v-btn>
                    <v-btn
                      size="x-small"
                      variant="text"
                      color="grey"
                      @click.stop="removeAt(i)"
                    >삭제</v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- 정보/에러 & 액션 -->
            <div v-if="previews.length" class="d-flex justify-space-between align-center mt-2">
              <div class="text-caption text-medium-emphasis">
                선택한 이미지 {{ files.length }}개,
                총 {{ humanSize(files.reduce((s,f)=>s+f.size,0)) }}
              </div>
              <v-btn size="small" variant="text" color="error" @click="clearAll">전부 비우기</v-btn>
            </div>

            <v-alert
              v-if="errMsg"
              type="error"
              variant="tonal"
              class="mt-4"
              density="comfortable"
            >
              {{ errMsg }}
            </v-alert>

            <div class="d-flex justify-end mt-6">
              <v-btn
                color="primary"
                variant="flat"
                class="mr-2"
                :loading="loading"
                :disabled="loading"
                @click="submitPost"
              >
                등록
              </v-btn>
              <v-btn color="grey" variant="outlined" :disabled="loading" @click="cancelWrite">
                취소
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 라이트박스 -->
    <ImageLightbox
      v-model="lightboxOpen"
      :images="previews"
      :start-index="selectedIndex"
    />
  </v-container>
</template>

<style scoped>
.dropzone {
  border: 2px dashed var(--v-theme-outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.thumb-card { border: 2px solid transparent; cursor: pointer; }
.thumb-card.is-cover { border-color: var(--v-theme-primary); }
.thumb-fallback { width: 100%; height: 100%; background: rgba(160,160,160,0.15); }
.cursor-pointer { cursor: pointer; }
.d-none { display: none; }
</style>
