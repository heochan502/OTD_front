<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService.js';
import { check } from '@/services/accountService';
import { useAccountStore } from '@/stores/counter';
import { useMemoDetail } from '@/components/memo/useMemoDetail.js';
import './MemoDetail.css';

const route = useRoute();
const router = useRouter();
const routeId = computed(() => route.params.id);
const accountStore = useAccountStore();
const fileInputRef = ref(null);

const { memo, showImages, fetch: fetchMemoRaw } = useMemoDetail(routeId.value);
const fetchMemo = async () => {
  try {
    await fetchMemoRaw();
  } catch (e) {
    showAlert("메모를 불러오지 못했습니다.");
    router.push('/memo');
  }
};

const memoList = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const showMemos = ref([]);
const totalMemos = ref(0);
const userId = ref(null);
const mode = ref('view'); // 'create' | 'view' | 'edit'

const currentTime = ref(new Date());
let intervalId = null;

const alertModal = ref({ show: false, message: '' });
const confirmModal = ref({ show: false, message: '', resolve: null });

const isCreateMode = computed(() => mode.value === 'create');
const isViewMode = computed(() => mode.value === 'view');
const isUpdateMode = computed(() => mode.value === 'edit');
const formattedCurrentCreatedAt = computed(() => formatDateTime(memo.value.createdAt));
const currentTimeFormatted = computed(() => formatDateTime(currentTime.value));

const formatDateTime = (date) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true, timeZone: 'Asia/Seoul'
  }).format(d);
};

const showAlert = (message) => {
  alertModal.value = { show: true, message };
};

const showConfirm = (message) => {
  confirmModal.value = { show: true, message, resolve: null };
  return new Promise(resolve => confirmModal.value.resolve = resolve);
};

const clearImages = () => {
  showImages.value.forEach(url => url.startsWith('blob:') && URL.revokeObjectURL(url));
  showImages.value = [];
};

const clearForm = () => {
  memo.value = { id: null, title: '', content: '', createdAt: null };
  clearImages();
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const fetchMemoList = async () => {
  try {
    const res = await MemoHttpService.findAll({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    });

    const resultData = res.data;

    if (!resultData || !Array.isArray(resultData.memoList)) {
      throw new Error("서버 응답이 올바르지 않습니다. (memoList 누락)");
    }

    showMemos.value = resultData.memoList;
    totalMemos.value = resultData.totalCount || 0;

  } catch (err) {
    console.error("fetchMemoList 에러:", err);
    alert(`메모 목록 로딩 실패: ${err.message}`);
  }
};

const saveMemo = async () => {
  if (memo.value.title.trim().length < 10) return showAlert('제목은 10자 이상 입력해주세요.');
  if (memo.value.content.trim().length < 10 || memo.value.content.length > 500) return showAlert('내용은 10자 이상 500자 이하 입력해주세요.');
  // if (!userId.value) return showAlert('로그인 정보가 없습니다.');

  const reqPayload = { ...memo.value, memberNoLogin: userId.value };

  try {
    const result = mode.value === 'edit'
      ? await MemoHttpService.modify(memo.value.id, reqPayload)
      : await (() => {
        const formData = new FormData();
        formData.append('memoData', new Blob([JSON.stringify(reqPayload)], { type: 'application/json' }));
        const files = Array.from(fileInputRef.value?.files || []);
        if (files.length === 0) throw new Error('이미지 파일이 없습니다.');
        files.forEach(file => formData.append('memoImageFiles', file));
        return MemoHttpService.create(formData);
      })();

    showAlert(mode.value === 'edit' ? '수정 완료' : '등록 완료');
    router.push('/memo');
    await fetchMemoList();
    clearForm();
    if (mode.value === 'create') currentPage.value = 1;
  } catch (e) {
    showAlert('저장 실패: ' + getErrorMessage(e));
  }
};

const deleteMemo = async () => {
  if (!await showConfirm('정말 삭제하시겠습니까?')) return;

  try {
    const res = await MemoHttpService.deleteById(memo.value.id);
    res.resultData === 1 ? router.push('/memo') || showAlert('삭제 성공') : showAlert('삭제 실패');
  } catch (e) {
    showAlert('삭제 실패: ' + getErrorMessage(e));
  }
};

const getErrorMessage = (err) => err.response?.data?.message || err.message;

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  const maxSize = 5 * 1024 * 1024;
  const extAllowed = ['jpg', 'jpeg', 'png', 'gif'];

  const previewUrls = new Set(showImages.value);
  const uploadedFileKeys = new Set(showImages.value.map(url => url.split('/').pop()));

  files.forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (showImages.value.length >= 5) return showAlert('이미지는 최대 5장까지 업로드할 수 있습니다.');
    if (!extAllowed.includes(ext)) return showAlert(`${file.name}: 허용되지 않는 형식`);
    if (file.size > maxSize) return showAlert(`${file.name}: 5MB 초과`);
    const fileKey = file.name + '_' + file.lastModified;
    if (uploadedFileKeys.has(fileKey)) return showAlert(`${file.name}: 중복 업로드됨`);

    const previewUrl = URL.createObjectURL(file);
    if (previewUrls.has(previewUrl)) return showAlert(`${file.name}: 동일한 파일이 이미 업로드됨`);

    showImages.value.push(previewUrl);
    uploadedFileKeys.add(fileKey);
    previewUrls.add(previewUrl);
  });
};

const removeImage = (index) => {
  const url = showImages.value[index];
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
  showImages.value.splice(index, 1);
};

const enableUpdateMode = () => mode.value = 'edit';
const goToMemoDetail = (id) => {
  if (route.params.id !== id) router.push(`/memo/${id}`);
};

const totalPages = computed(() => Math.max(1, Math.ceil(totalMemos.value / pageSize.value)));
const changePage = (num) => {
  if (num >= 1 && num <= totalPages.value) {
    currentPage.value = num;
    fetchMemoList();
  }
};

onMounted(async () => {
  const res = await check();
  if (res?.status === 200) {
    userId.value = res.data?.id;
    accountStore.setLoggedIn(true);
    accountStore.setLoggedInId(userId.value);
  } else {
    accountStore.setLoggedIn(false);
    accountStore.setLoggedInId(null);
    return router.push({ name: 'login' });
    fetchMemoList();
  }

  intervalId = setInterval(() => (currentTime.value = new Date()), 1000);

  if (routeId.value) {
    mode.value = 'view';
    await fetchMemo();
  } else {
    mode.value = 'create';
    clearForm();
  }

  fetchMemoList();
});

onBeforeUnmount(() => clearInterval(intervalId));

watch(routeId, async (id, prev) => {
  if (!id) {
    mode.value = 'create';
    clearForm();
  } else {
    mode.value = 'view';
    await fetchMemo();
  }
  if (!prev && id) currentPage.value = 1;
  fetchMemoList();
}, { immediate: true });
</script>

<template>
  <div class="memo-detail-container">
    <h2 class="page-title">
      <span v-if="isCreateMode">새 메모 작성</span>
      <span v-else-if="isUpdateMode">메모 수정</span>
      <span v-else-if="isViewMode">메모 상세</span>
      <span v-else>메모</span>
    </h2>

    <div class="input-section">
      <label for="memoTitle">제목</label>
      <input
        type="text"
        id="memoTitle"
        class="form-control"
        v-model="memo.title"
        :readonly="isViewMode"
        required
      />
    </div>

    <div class="input-section">
      <label for="memoContent">내용</label>
      <textarea
        id="memoContent"
        class="form-control"
        rows="8"
        v-model="memo.content"
        :readonly="isViewMode"
        required
      ></textarea>
    </div>

    <div class="input-section">
      <label v-if="!isViewMode" for="memoImageUpload">이미지 업로드 (최대 5장)</label>
      <input
        v-if="!isViewMode"
        type="file"
        id="memoImageUpload"
        name="imageUpload"
        accept=".jpg, .png, .jpeg, .gif"
        class="form-control"
        @change="handleImageChange"
        multiple
        ref="fileInputRef"
      />
      <div class="preview-list">
        <div v-for="(img, index) in showImages" :key="index" class="preview-item">
          <img :src="img" alt="미리보기 이미지" />
          <button v-if="!isViewMode" class="remove-btn" @click="removeImage(index)">X</button>
        </div>
        <p v-if="isViewMode && showImages.length === 0" class="no-images-text">등록된 이미지가 없습니다.</p>
      </div>
    </div>

    <div class="info-section" v-if="isCreateMode">
      <strong>현재 시각:</strong> {{ currentTimeFormatted }}
    </div>
    <div class="info-section" v-else-if="isViewMode || isUpdateMode">
      <strong>등록 일시:</strong> {{ formattedCurrentCreatedAt }}
    </div>

    <div class="button-group">
      <button v-if="isCreateMode" class="btn btn-primary" @click="saveMemo">등록</button>
      <button v-if="isUpdateMode" class="btn btn-primary" @click="saveMemo">수정 완료</button>
      <button v-if="isViewMode" class="btn btn-secondary" @click="enableUpdateMode">수정</button>
      <button v-if="isViewMode" class="btn btn-danger" @click="deleteMemo">삭제</button>
      <button class="btn btn-secondary" @click="router.push('/home')">홈</button>
    </div>

    <hr style="margin: 40px 0; border-top: 1px solid #eee;" />
    <h3 style="text-align: center; color: #666; margin-bottom: 20px;">메모 목록</h3>

    <div class="memo-list-section">
  <div v-if="showMemos.length === 0" class="empty-message">
    작성된 메모가 없습니다. 새로운 메모를 작성해보세요!
  </div>

  <ul v-else class="memo-items">
    <li
      v-for="memo in memoList"
      :key="memo.id"
      class="memo-item"
      @click="goToMemoDetail(memo.id)"
    >
      <div v-if="memo.imageFileName" class="memo-image-preview">
        <img
          :src="`/pic/${memo.imageFileName}`"
          alt="대표 이미지"
          style="max-width: 50px; max-height: 50px;"
        />
      </div>

      <div class="memo-title">{{ memo.title }}</div>
      <div class="memo-content">
        {{ memo.content.length > 100 ? memo.content.slice(0, 100) + '...' : memo.content }}
      </div>

      <div class="memo-date">{{ formatDate(memo.createdAt) }}</div>
    </li>
  </ul>

  <div class="pagination">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">이전</button>
    <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">다음</button>
  </div>
</div>

    <div v-if="alertModal.show" class="modal-overlay">
      <div class="modal-content">
        <p>{{ alertModal.message }}</p>
        <button @click="alertModal.show = false" class="modal-btn">확인</button>
      </div>
    </div>

    <div v-if="confirmModal && confirmModal.show" class="modal-overlay">
      <div class="modal-content">
        <p>{{ confirmModal.message }}</p>
        <div class="modal-actions">
          <button @click="confirmModal.resolve(true); confirmModal.show = false;" class="modal-btn confirm-yes">예</button>
          <button @click="confirmModal.resolve(false); confirmModal.show = false;" class="modal-btn confirm-no">아니오</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>