<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';
import {
  updatePost,
  fetchPostById,
  fetchPostImages,      // 기존 이미지 목록 조회
  addPostImages,        // [NEW] 새 이미지 추가 업로드
  deletePostImage,      // [NEW] 단일 이미지 삭제
} from '@/services/community/communityService';
import ImageLightbox from '@/components/community/ImageLightbox.vue';

const store = usecommunityStore();
const post = computed(() => store.selectedPost || {});

// 제목/내용
const editedTitle = ref(post.value.title || '');
const editedContent = ref(post.value.content || '');

// ── 기존 등록 이미지 목록 ───────────────────────────────────────────
const imageList = ref([]);   // [{fileId, filePath, fileName, ...}]
const loadingImages = ref(false);

const hasImages = computed(() => (imageList.value?.length || 0) > 0);

// 라이트박스
const lightbox = ref(false);
const current = ref(0);
const openLightboxAt = (i) => { current.value = i; lightbox.value = true; };

// 기존 이미지 불러오기
async function loadImages() {
  if (!post.value?.postId) return;
  loadingImages.value = true;
  try {
    const { data } = await fetchPostImages(post.value.postId);
    // 기대 응답: [{fileId, filePath, fileName, ...}]
    imageList.value = Array.isArray(data) ? data : [];
    // 첨부가 하나도 없으면 대표 이미지라도 보여주기
    if (imageList.value.length === 0 && post.value.filePath) {
      imageList.value = [{ fileId: null, filePath: post.value.filePath, fileName: '' }];
    }
    current.value = 0;
  } catch (e) {
    console.error('이미지 목록 조회 실패', e);
    imageList.value = post.value?.filePath ? [{ fileId: null, filePath: post.value.filePath, fileName: '' }] : [];
  } finally {
    loadingImages.value = false;
  }
}

// 기존 이미지 삭제(바로 서버 반영)
const deleting = ref(false);
async function onDeleteExisting(img) {
  if (!img) return;
  if (img.fileId == null) {
    // 대표 이미지(첨부테이블 미보유)만 있는 경우엔 삭제 불가 처리(서버에 삭제대상 식별자 없음)
    alert('대표 이미지(첨부기록 없음)는 여기서 삭제할 수 없습니다.');
    return;
  }
  if (!confirm('이 이미지를 삭제하시겠어요?')) return;
  try {
    deleting.value = true;
    await deletePostImage(img.fileId); // DELETE /community/file/{fileId}
    await loadImages();                // 목록 갱신
  } catch (e) {
    console.error('이미지 삭제 실패', e);
    alert('이미지 삭제에 실패했습니다.');
  } finally {
    deleting.value = false;
  }
}

// ── 새로 추가할 이미지(업로드 전 로컬 미리보기) ─────────────────────
const newFiles = ref([]);        // File[]
const newPreviews = ref([]);     // [{url, name, size}]
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 30 * 1024 * 1024;
const errMsg = ref('');

// 미리보기 URL 정리
function clearNewPreviews() {
  newPreviews.value.forEach(p => URL.revokeObjectURL(p.url));
  newPreviews.value = [];
}
onBeforeUnmount(clearNewPreviews);

function onNewFilesSelected(files) {
  const arr = Array.isArray(files) ? files : Array.from(files || []);
  let total = newFiles.value.reduce((s, f) => s + f.size, 0); // 기존에 선택된 것 포함 총합
  const add = [];
  for (const f of arr) {
    if (!f.type?.startsWith('image/')) continue;
    if (f.size > MAX_FILE_SIZE) {
      errMsg.value = `파일당 최대 10MB까지 업로드할 수 있습니다: ${f.name}`;
      return;
    }
    total += f.size;
    if (total > MAX_TOTAL_SIZE) {
      errMsg.value = '총 업로드 용량은 30MB를 초과할 수 없습니다.';
      return;
    }
    add.push(f);
  }
  errMsg.value = '';
  newFiles.value = [...newFiles.value, ...add];
  newPreviews.value = [
    ...newPreviews.value,
    ...add.map(f => ({ url: URL.createObjectURL(f), name: f.name, size: f.size }))
  ];
}

function onDropNew(e) {
  e.preventDefault();
  onNewFilesSelected(e.dataTransfer?.files);
}

function removeNewFile(i) {
  if (newPreviews.value[i]) URL.revokeObjectURL(newPreviews.value[i].url);
  newPreviews.value.splice(i, 1);
  newFiles.value.splice(i, 1);
}

// 새 이미지 업로드(제목/내용 저장과 분리해서 버튼 따로 제공)
const uploading = ref(false);
async function uploadNewImages() {
  if (!post.value?.postId) return;
  if (newFiles.value.length === 0) {
    alert('추가할 이미지가 없습니다.');
    return;
  }
  try {
    uploading.value = true;
    const fd = new FormData();
    newFiles.value.forEach(f => fd.append('files', f)); // 키 이름 'files' (백엔드 DTO: MultipartFile[] files)
    await addPostImages(post.value.postId, fd);         // POST /community/files/{postId}
    // 정리 + 목록 갱신
    clearNewPreviews();
    newFiles.value = [];
    await loadImages();
    alert('이미지가 추가되었습니다.');
  } catch (e) {
    console.error('이미지 업로드 실패', e);
    alert('이미지 업로드에 실패했습니다.');
  } finally {
    uploading.value = false;
  }
}

// ── 게시글 텍스트(제목/내용) 저장 ────────────────────────────────────
async function saveChanges() {
  if (!post.value?.postId) return;

  try {
    const formData = new FormData();
    formData.append('title', editedTitle.value);
    formData.append('content', editedContent.value);

    await updatePost(post.value.postId, formData);

    // 저장 후 최신 상세 다시 로드
    const res = await fetchPostById(post.value.postId);
    store.selectPost(res.data);
    store.goDetail(res.data);

    alert('수정이 완료되었습니다.');
  } catch (err) {
    console.error('수정 실패:', err);
    alert('수정 중 오류가 발생했습니다.');
  }
}

function cancelEdit() {
  store.goDetail(post.value);
}

// 초기 로딩
onMounted(async () => {
  editedTitle.value = post.value.title || '';
  editedContent.value = post.value.content || '';
  await loadImages();
});

watch(post, async (p) => {
  editedTitle.value = p?.title || '';
  editedContent.value = p?.content || '';
  await loadImages();
});
</script>

<template>
  <v-container class="py-6" fluid>
    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <v-card-text>
        <h2 class="mb-6 font-weight-bold text-h5">게시글 수정</h2>

        <!-- 제목/내용 -->
        <v-text-field
          v-model="editedTitle"
          label="제목"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          clearable
        />
        <v-textarea
          v-model="editedContent"
          label="내용"
          variant="outlined"
          auto-grow
          rows="6"
          clearable
        />

        <!-- 등록된 이미지(기존) -->
        <div class="mt-6">
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 font-weight-medium">등록된 이미지</span>
            <v-spacer />
            <v-progress-circular
              v-if="loadingImages || deleting"
              indeterminate
              size="20"
              width="2"
            />
          </div>

          <template v-if="hasImages">
            <v-row dense>
              <v-col
                v-for="(img, i) in imageList"
                :key="i"
                cols="6" sm="4" md="3"
              >
                <v-card
                  class="overflow-hidden rounded-lg position-relative"
                  elevation="1"
                >
                  <v-img
                    :src="img.filePath || img.url"
                    :alt="img.fileName || ''"
                    cover
                    aspect-ratio="1"
                    @click="openLightboxAt(i)"
                    style="cursor:pointer;"
                  />
                  <div class="d-flex justify-space-between align-center px-2 py-1">
                    <span class="text-truncate" style="max-width: 160px;">
                      {{ img.fileName || '' }}
                    </span>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="red"
                      @click.stop="onDeleteExisting(img)"
                    />
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </template>

          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            density="comfortable"
          >
            등록된 이미지가 없습니다.
          </v-alert>
        </div>

        <!-- 새 이미지 추가(미리보기 + 업로드) -->
        <div class="mt-8">
          <div class="text-subtitle-2 font-weight-medium mb-2">이미지 추가</div>

          <v-file-input
            label="이미지 선택"
            prepend-icon="mdi-image-plus"
            variant="outlined"
            accept="image/*"
            multiple
            show-size
            chips
            counter
            @update:modelValue="onNewFilesSelected"
          />

          <v-sheet
            class="mt-3 d-flex align-center justify-center rounded-lg text-medium-emphasis"
            height="120"
            color="surface"
            style="border: 2px dashed var(--v-theme-outline-variant);"
            @dragover.prevent
            @drop="onDropNew"
          >
            여기로 이미지를 드래그해서 추가하세요 (최대 10MB/개, 총 30MB)
          </v-sheet>

          <v-row v-if="newPreviews.length" dense class="mt-3">
            <v-col
              v-for="(p, i) in newPreviews"
              :key="'np-'+i"
              cols="6" sm="4" md="3"
            >
              <v-card class="overflow-hidden rounded-lg" elevation="1">
                <v-img :src="p.url" :alt="p.name" cover aspect-ratio="1" />
                <div class="d-flex justify-space-between align-center px-2 py-1">
                  <span class="text-truncate" style="max-width: 160px;">
                    {{ p.name }}
                  </span>
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    variant="text"
                    @click.stop="removeNewFile(i)"
                  />
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-alert
            v-if="errMsg"
            type="error"
            variant="tonal"
            class="mt-3"
            density="comfortable"
          >
            {{ errMsg }}
          </v-alert>

          <div class="d-flex justify-end mt-3">
            <v-btn
              color="primary"
              variant="elevated"
              :loading="uploading"
              :disabled="uploading"
              @click="uploadNewImages"
            >
              이미지 추가 업로드
            </v-btn>
          </div>
        </div>

        <!-- 하단 액션 -->
        <div class="d-flex justify-end mt-8">
          <v-btn color="primary" variant="flat" class="mr-2" @click="saveChanges">
            저장
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="cancelEdit">
            취소
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 라이트박스 -->
    <ImageLightbox
      v-model="lightbox"
      :images="imageList"
      :start-index="current"
    />
  </v-container>
</template>

<style scoped>
.position-relative { position: relative; }
.text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
