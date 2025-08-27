<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import { usecommunityStore } from '@/stores/community/communityStore';
import { useDialogStore } from '@/stores/community/dialogStore';
import {
  updatePost,
  fetchPostById,
  fetchPostImages,
  addPostImages,
  deletePostImage,
} from '@/services/community/communityService';
import ImageLightbox from '@/components/community/ImageLightbox.vue';

const dialog = useDialogStore();
const store = usecommunityStore();
const post = computed(() => store.selectedPost || {});

const editedTitle = ref(post.value.title || '');
const editedContent = ref(post.value.content || '');

const imageList = ref([]);
const loadingImages = ref(false);
const hasImages = computed(() => (imageList.value?.length || 0) > 0);

const lightbox = ref(false);
const current = ref(0);
const openLightboxAt = (i) => {
  current.value = i;
  lightbox.value = true;
};

/**
 * 서버 응답을 [{ fileId, filePath, fileName }]로 통일
 * - 후보 키를 넓게(숫자PK/문자PK/중첩키/스네이크) 커버
 * - 문자열 '0' → 0, 'null'/'undefined'/'' → null
 */
function normalizeImages(arr = []) {
  const deep = (o, ks) =>
    ks.reduce((a, k) => (a != null ? a[k] : undefined), o);

  const pickId = (it) => {
    const candidates = [
      // 일반/자주쓰는 케이스
      'fileId',
      'postFileId',
      'communityFileId',
      'fileNo',
      'fileSeq',
      'postFileNo',
      'attachmentNo',
      'imageId',
      'attachmentId',
      'attachId',
      'id',
      'uuid',
      'uid',
      'key',
      'pk',
      // 스네이크/다른 케이스
      'file_id',
      'image_id',
      'attach_id',
      'attachment_id',
      'file_uuid',
      'image_uuid',
      'attachment_uuid',
      'file_key',
      'image_key',
      'attachment_key',
      // 중첩 구조 가능성
      ['file', 'id'],
      ['image', 'id'],
      ['attachment', 'id'],
      ['meta', 'fileId'],
      ['meta', 'id'],
      ['file', 'uuid'],
      ['image', 'uuid'],
      ['attachment', 'uuid'],
    ];
    for (const k of candidates) {
      const v = Array.isArray(k) ? deep(it, k) : it[k];
      if (v != null) return v;
    }
    // 패턴 스캔 (postId 같은 건 제외)
    for (const k of Object.keys(it)) {
      const lower = k.toLowerCase();
      if (lower === 'postid') continue;
      if (
        /(^|_)(file|image|attach|attachment)?(id|no|seq|uuid|key|pk)(_|$)/.test(
          lower
        )
      ) {
        if (it[k] != null) return it[k];
      }
    }
    return null;
  };

  const pickPath = (it) =>
    it.filePath ??
    it.url ??
    it.path ??
    it.imageUrl ??
    it.image_url ??
    it.file_path ??
    '';

  const pickName = (it) =>
    it.fileName ??
    it.name ??
    it.originalName ??
    it.original_name ??
    it.filename ??
    '';

  return arr.map((it) => {
    let fileId = pickId(it);
    if (typeof fileId === 'string') {
      const t = fileId.trim().toLowerCase();
      if (t === '' || t === 'null' || t === 'undefined') fileId = null;
      else if (!Number.isNaN(Number(t))) fileId = Number(t);
      // 숫자가 아니면 그대로 문자열 ID 유지(예: UUID)
    }
    return {
      fileId,
      filePath: pickPath(it),
      fileName: pickName(it),
      _raw: it, // 디버그용(확인 후 제거 가능)
    };
  });
}

async function loadImages() {
  if (!post.value?.postId) return;
  loadingImages.value = true;
  try {
    const { data } = await fetchPostImages(post.value.postId);
    // 디버그: 응답 구조 확인
    console.log('[fetchPostImages] postId =', post.value.postId, 'raw =', data);
    if (Array.isArray(data) && data.length) {
      console.log(
        '[fetchPostImages] keys(first) =',
        Object.keys(data[0]).join(', ')
      );
      console.table(data);
    }

    const list = Array.isArray(data) ? data : [];
    const normalized = normalizeImages(list);

    // 디버그: 정규화 결과 확인
    console.table(
      normalized.map((x, idx) => ({
        idx,
        fileId: x.fileId,
        filePath: x.filePath,
        fileName: x.fileName,
      }))
    );

    if (normalized.length === 0 && post.value.filePath) {
      imageList.value = [
        { fileId: null, filePath: post.value.filePath, fileName: '' },
      ];
    } else {
      imageList.value = normalized;
    }
    current.value = 0;
  } catch (e) {
    console.error('이미지 목록 조회 실패', e);
    imageList.value = post.value?.filePath
      ? [{ fileId: null, filePath: post.value.filePath, fileName: '' }]
      : [];
  } finally {
    loadingImages.value = false;
  }
}

const deleting = ref(false);
async function onDeleteExisting(img) {
  if (!img) return;
  console.log('[delete click] img =', img);
  if (img.fileId === null || img.fileId === undefined) {
    await dialog.alert({
      title: '안내',
      message: '대표 이미지는 여기서 삭제할 수 없습니다.',
    });
    return;
  }
  const ok = await dialog.confirm({
    title: '이미지 삭제',
    message: '이 이미지를 삭제하시겠어요?',
    confirmText: '삭제',
    cancelText: '취소',
  });
  if (!ok) return;
  try {
    deleting.value = true;
    await deletePostImage(img.fileId);
    await loadImages();
  } catch (e) {
    console.error('이미지 삭제 실패', e);
    await dialog.alert({
      title: '오류',
      message: '이미지 삭제에 실패했습니다.',
    });
  } finally {
    deleting.value = false;
  }
}

const newFiles = ref([]);
const newPreviews = ref([]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 30 * 1024 * 1024;
const errMsg = ref('');

function clearNewPreviews() {
  newPreviews.value.forEach((p) => URL.revokeObjectURL(p.url));
  newPreviews.value = [];
}
onBeforeUnmount(clearNewPreviews);

function onNewFilesSelected(files) {
  const arr = Array.isArray(files) ? files : Array.from(files || []);
  let total = newFiles.value.reduce((s, f) => s + f.size, 0);
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
    ...add.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    })),
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

const uploading = ref(false);
async function uploadNewImages() {
  if (!post.value?.postId) return;
  if (newFiles.value.length === 0) {
    await dialog.alert({ title: '안내', message: '추가할 이미지가 없습니다.' });
    return;
  }
  try {
    uploading.value = true;
    const fd = new FormData();
    newFiles.value.forEach((f) => fd.append('files', f));
    await addPostImages(post.value.postId, fd);
    clearNewPreviews();
    newFiles.value = [];
    await loadImages();
    await dialog.alert({ title: '완료', message: '이미지가 추가되었습니다.' });
  } catch (e) {
    console.error('이미지 업로드 실패', e);
    await dialog.alert({
      title: '오류',
      message: '이미지 업로드에 실패했습니다.',
    });
  } finally {
    uploading.value = false;
  }
}

async function saveChanges() {
  if (!post.value?.postId) return;
  try {
    const formData = new FormData();
    formData.append('title', editedTitle.value);
    formData.append('content', editedContent.value);

    await updatePost(post.value.postId, formData);

    const res = await fetchPostById(post.value.postId);
    store.selectPost(res.data);

    if (typeof store.goDetail === 'function') {
      store.goDetail(res.data);
    } else {
      store.viewMode = 'detail';
    }
    await nextTick();

    await dialog.alert({ title: '완료', message: '수정이 완료되었습니다.' });
  } catch (err) {
    console.error('수정 실패:', err);
    await dialog.alert({
      title: '오류',
      message: '수정 중 오류가 발생했습니다.',
    });
  }
}

function cancelEdit() {
  if (typeof store.goDetail === 'function') {
    store.goDetail(post.value);
  } else {
    store.viewMode = 'detail';
  }
}

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
  <template v-if="store.viewMode === 'edit'">
    <v-container class="py-6" fluid>
      <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
        <v-card-text>
          <h2 class="mb-6 font-weight-bold text-h5">게시글 수정</h2>

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

          <div class="mt-6">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-medium"
                >등록된 이미지</span
              >
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
                  :key="img.fileId ?? img.filePath ?? i"
                  cols="6"
                  sm="4"
                  md="3"
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
                      style="cursor: pointer"
                    >
                      <!-- 로딩/에러 시에도 박스가 보이도록 -->
                      <template #placeholder>
                        <div
                          class="d-flex align-center justify-center"
                          style="height: 100%"
                        >
                          <v-progress-circular
                            indeterminate
                            size="20"
                            width="2"
                          />
                        </div>
                      </template>
                      <template #error>
                        <div
                          class="d-flex align-center justify-center"
                          style="height: 100%"
                        >
                          <v-icon size="28">mdi-image-broken-variant</v-icon>
                        </div>
                      </template>
                    </v-img>

                    <!-- 디버그 표시: 실제로 몇 장이 들어왔는지, fileId가 있는지 즉시 확인 -->
                    <div class="px-2 py-1 text-caption text-medium-emphasis">
                      <div>id: {{ img.fileId ?? 'null' }}</div>
                      <div class="text-truncate" :title="img.filePath">
                        path: {{ img.filePath }}
                      </div>
                    </div>

                    <div
                      class="d-flex justify-space-between align-center px-2 pb-1"
                    >
                      <span class="text-truncate" style="max-width: 160px">
                        {{ img.fileName || '' }}
                      </span>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        :color="(img.fileId ?? null) === null ? 'grey' : 'red'"
                        :disabled="(img.fileId ?? null) === null || deleting"
                        @click.stop="onDeleteExisting(img)"
                        :title="
                          (img.fileId ?? null) === null
                            ? '대표 이미지(삭제 불가)'
                            : '삭제'
                        "
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

          <div class="mt-8">
            <div class="text-subtitle-2 font-weight-medium mb-2">
              이미지 추가
            </div>

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
              style="border: 2px dashed var(--v-theme-outline-variant)"
              @dragover.prevent
              @drop="onDropNew"
            >
              여기로 이미지를 드래그해서 추가하세요 (최대 10MB/개, 총 30MB)
            </v-sheet>

            <v-row v-if="newPreviews.length" dense class="mt-3">
              <v-col
                v-for="(p, i) in newPreviews"
                :key="'np-' + i"
                cols="6"
                sm="4"
                md="3"
              >
                <v-card class="overflow-hidden rounded-lg" elevation="1">
                  <v-img :src="p.url" :alt="p.name" cover aspect-ratio="1" />
                  <div
                    class="d-flex justify-space-between align-center px-2 py-1"
                  >
                    <span class="text-truncate" style="max-width: 160px">
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

          <div class="d-flex justify-end mt-8">
            <v-btn
              color="primary"
              variant="flat"
              class="mr-2"
              @click="saveChanges"
            >
              저장
            </v-btn>
            <v-btn color="grey" variant="outlined" @click="cancelEdit">
              취소
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>

    <ImageLightbox
      v-model="lightbox"
      :images="imageList"
      :start-index="current"
    />
  </template>
</template>

<style scoped>
.position-relative {
  position: relative;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
