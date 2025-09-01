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

const imageList = ref([]); // [{ fileId, filePath, fileName, deletable }]
const loadingImages = ref(false);
const hasImages = computed(() => (imageList.value?.length || 0) > 0);

const lightbox = ref(false);
const current = ref(0);
const openLightboxAt = (i) => {
  current.value = i;
  lightbox.value = true;
};

/** 유틸: 응답에서 배열을 "안전하게" 뽑기 */
function extractArrayLike(payload) {
  if (Array.isArray(payload)) return payload;

  // 흔한 래핑 키들을 순서대로 검사
  const candidates = [
    'data',
    'list',
    'images',
    'result',
    'rows',
    'content',
    'items',
  ];

  for (const k of candidates) {
    const v = payload?.[k];
    if (Array.isArray(v)) return v;
  }

  // 객체 안에 첫 배열 프로퍼티가 있으면 그것도 허용
  if (payload && typeof payload === 'object') {
    for (const [k, v] of Object.entries(payload)) {
      if (Array.isArray(v)) return v;
    }
  }

  return [];
}

/**
 * 서버 응답을 [{ fileId, filePath, fileName, deletable }]로 통일
 * - 가능한 많은 id 후보 탐색
 * - url/path 후보도 넓게 탐색
 * - fileId 없으면 deletable=false (대표이미지 등)
 */
function normalizeImages(arr = [], fallbackCover = '') {
  // 객체 깊은 조회
  const deepGet = (o, path) =>
    path.reduce((a, k) => (a != null ? a[k] : undefined), o);

  const pickId = (it) => {
    // 명시적 후보(앞/뒤 단어가 있어도 id/no/uuid/key/seq 패턴이면 허용)
    const explicit = [
      'fileId',
      'postFileId',
      'postImageId',
      'communityFileId',
      'fileNo',
      'fileSeq',
      'imageId',
      'attachmentId',
      'attachId',
      'id',
      'uuid',
      'uid',
      'key',
      'pk',
      'file_id',
      'post_file_id',
      'post_image_id',
      'community_file_id',
      'file_no',
      'file_seq',
      'image_id',
      'attachment_id',
      'attach_id',
      // 중첩
      ['file', 'id'],
      ['image', 'id'],
      ['attachment', 'id'],
      ['meta', 'id'],
      ['file', 'uuid'],
      ['image', 'uuid'],
      ['attachment', 'uuid'],
    ];

    for (const cand of explicit) {
      const v = Array.isArray(cand) ? deepGet(it, cand) : it[cand];
      if (v != null && v !== '') return v;
    }

    // 정규 패턴 스캔: postId/boardId 등 게시글 ID로 보이는 건 제외
    for (const [k, v] of Object.entries(it)) {
      const lower = k.toLowerCase();
      // 게시글 id/번호는 제외
      if (/(^|_)(post|board|article)(id|no|seq)(_|$)/.test(lower)) continue;
      // 파일/이미지/첨부 + id/no/seq/uuid/key/pk 패턴
      if (
        /(^|_)(file|image|img|attach|attachment)?(.*?)(id|no|seq|uuid|key|pk)(_|$)/.test(
          lower
        )
      ) {
        if (v != null && v !== '') return v;
      }
      // 뒤에 file 붙거나 image 붙은 key도 허용
      if (/(^|_)(id|no|seq|uuid|key|pk)(.*?)(file|image)(_|$)/.test(lower)) {
        if (v != null && v !== '') return v;
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
    it.file_url ??
    it.file_path ??
    '';

  const pickName = (it) =>
    it.fileName ??
    it.name ??
    it.originalName ??
    it.original_name ??
    it.filename ??
    '';

  // 문자열만 오는 케이스도 허용 (그 자체가 url)
  return (
    arr
      .map((raw) => {
        if (raw == null) {
          return {
            fileId: null,
            filePath: '',
            fileName: '',
            deletable: false,
            _raw: raw,
          };
        }
        if (typeof raw === 'string') {
          const url = raw.trim();
          return {
            fileId: null,
            filePath: url,
            fileName: '',
            deletable: false,
            _raw: raw,
          };
        }

        let fileId = pickId(raw);
        if (typeof fileId === 'string') {
          const t = fileId.trim().toLowerCase();
          if (t === '' || t === 'null' || t === 'undefined') fileId = null;
          else if (!Number.isNaN(Number(t))) fileId = Number(t); // 숫자 문자열이면 숫자로
          // uuid 등 문자열 id는 그대로 둠
        }

        const filePath = pickPath(raw) || '';
        const fileName = pickName(raw) || '';

        // 서버 id가 있어야 개별 삭제 가능
        const deletable =
          fileId !== null && fileId !== undefined && fileId !== '';

        return { fileId, filePath, fileName, deletable, _raw: raw };
      })
      // 표시 가능한 항목만 유지 (url/path가 아예 없으면 제외)
      .filter((x) => !!x.filePath || x.deletable)
      // 아무것도 없는데 대표 이미지(fallbackCover)가 있으면 한 장만 표시(삭제불가)
      .concat(
        arr.length === 0 && fallbackCover
          ? [
              {
                fileId: null,
                filePath: fallbackCover,
                fileName: '',
                deletable: false,
              },
            ]
          : []
      )
  );
}

/** 이미지 로드 */
async function loadImages() {
  if (!post.value?.postId) return;
  loadingImages.value = true;
  try {
    const resp = await fetchPostImages(post.value.postId);
    // fetchPostImages가 { data } 또는 바로 배열일 수 있음
    const payload = resp?.data ?? resp;
    const list = extractArrayLike(payload);
    const normalized = normalizeImages(list, post.value.filePath);

    // 디버그 로그 (필요 없으면 삭제 가능)
    // console.table(normalized.map((x,i)=>({i, id:x.fileId, del:x.deletable, path:x.filePath})));

    imageList.value = normalized;
    current.value = 0;
  } catch (e) {
    console.error('이미지 목록 조회 실패', e);
    imageList.value = normalizeImages([], post.value.filePath);
  } finally {
    loadingImages.value = false;
  }
}

const deleting = ref(false);
async function onDeleteExisting(img) {
  if (!img) return;
  if (!img.deletable) {
    await dialog.alert({
      title: '안내',
      message:
        '대표 이미지 또는 서버 ID가 없는 이미지는 여기서 삭제할 수 없습니다.',
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
    await deletePostImage(img.fileId); // 서버가 요구하는 정확한 식별자
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

/* 새 이미지 추가 */
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

          <!-- 등록된 이미지 -->
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
                      :src="img.filePath"
                      :alt="img.fileName || ''"
                      cover
                      aspect-ratio="1"
                      @click="openLightboxAt(i)"
                      style="cursor: pointer"
                    >
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
                        :color="img.deletable ? 'red' : 'grey'"
                        :disabled="!img.deletable || deleting"
                        @click.stop="onDeleteExisting(img)"
                        :title="
                          img.deletable ? '삭제' : '대표/식별자 없음(삭제 불가)'
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

          <!-- 이미지 추가 -->
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
                    <span class="text-truncate" style="max-width: 160px">{{
                      p.name
                    }}</span>
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
              >저장</v-btn
            >
            <v-btn color="grey" variant="outlined" @click="cancelEdit"
              >취소</v-btn
            >
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
