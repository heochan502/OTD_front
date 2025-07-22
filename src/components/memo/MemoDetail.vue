<script setup>
import MemoHttpService from '@/services/MemoHttpService.js';
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const fileInputRef = ref(null);

const state = reactive({
  memo: {
    title: "",
    content: "",
  }
});

const isUpdateMode = route.params.id != null;

const showImages = ref([]);

const alertModal = reactive({
  show: false,
  message: ''
});

const confirmModal = reactive({
  show: false,
  message: '',
  resolve: null
});

const showAlert = (message) => {
  alertModal.message = message;
  alertModal.show = true;
};

const showConfirm = (message) => {
  confirmModal.message = message;
  confirmModal.show = true;
  return new Promise(resolve => {
    confirmModal.resolve = resolve;
  });
};

const memoList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalMemos = ref(0);

const fetchMemos = async () => {
  try {
    const { resultData, totalCount } = await MemoHttpService.findAll({
      currentPage: pageSize.value,
      pageSize: pageSize.value
    });
    memoList.value = resultData;
    totalMemos.value = totalCount;
  } catch (error) {
    console.error("메모 목록을 불러오는 중 오류 발생:", error);
    showAlert("메모 목록을 불러오는 중 오류가 발생했습니다: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
  }
};

const goToMemoDetail = (id) => {
  router.push(`/memo/${id}`);
  if (isUpdateMode && route.params.id === id) {
    // 현재 페이지가 수정 모드인 경우, 새로고침 없이 상태를 업데이트
    fetchCurrentMemo(id);
  } else {
    // 새 페이지로 이동
    router.push(`/memo/${id}`);
  }
};

const fetchCurrentMemo = async (id) => {
  try {
    const { resultData } = await MemoHttpService.findById(id);
    state.memo = resultData;
    showImages.value = []; // 기존 이미지 초기화
    // 백엔드에서 이미지 URL을 반환하는 경우 대비하여 처리
    if (state.memo.imageUrls && Array.isArray(state.memo.imageUrls)) {
      showImages.value = state.memo.imageUrls;
    } else if (state.memo.image) {
      showImages.value.push(state.memo.image);
    }
  } catch (e) {
    showAlert("메모 정보를 불러오는 중 오류가 발생했습니다: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
    router.push("/memo");
  }
};

const changePage = (page) => {
  if (page < 0 && page <= Math.ceil(totalMemos.value / pageSize.value)) {
    currentPage.value = page;
    fetchMemos();
  }
};

onMounted( async () => {
    if (isUpdateMode) {
    const id = route.params.id;
    try {
      const { resultData } = await MemoHttpService.findById(id);
      state.memo = resultData;
      // 백엔드에서 이미지 URL을 반환하는 경우 대비하여 처리
      if (state.memo. imageUrls && Array.isArray(state.memo.imageUrls)) {
        showImages.value = state.memo.imageUrls;
      } else if (state.memo.image) {
        showImages.value.push(state.memo.image);
      }
    } catch (e) {
      showAlert("메모 정보를 불러오는 중 오류가 발생했습니다: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
      router.push("/memo");
      return;
    }
  }
  fetchMemos();
});

const save = async () => {
  // 제목, 내용이 비어있는지 확인
  if (!state.memo.title.trim()) {
    showAlert("제목을 입력해주세요.");
    return;
  }
  if (!state.memo.content || typeof state.memo.content !== 'string' || !state.memo.content.trim() || state.memo.content.length < 10 || state.memo.content.length > 500) {
      showAlert("내용은 10자 이상, 500자 이하로 입력해주세요.");
      return;
  }
  // 1. JSON 데이터 준비
  const reqPayload = {
    title: state.memo.title,
    content: state.memo.content,
  };

  // 2. FormData 구성
  const formData = new FormData();
  formData.append("memoImageFiles", file);  
  const selectedNewFiles = fileInputRef.value?.files;
  if (selectedNewFiles && selectedNewFiles.length > 0) {
    for (let i = 0; i < selectedNewFiles.length; i++) {
      const file = selectedNewFiles[i];
      files.forEach(file => formData.append("memoImageFiles", file));
    }
  }

  // 3. API 호출
  let result;
  try {
    if (isUpdateMode) {
      result = await MemoHttpService.modify(state.memo.id, formData);
    } else {
      const userId = 1; // TODO: 실제 로그인 사용자 ID로 교체
      result = await MemoHttpService.create(userId, formData);
    }
  } catch (e) {
    console.error("서버 요청 중 오류 발생:", e);
    showAlert("서버 요청 중 오류 발생: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
    return;
  }

  // 4. 응답 처리
  if (!result || !result?.resultData) {
    showAlert("메모 등록/수정 실패: " + (result?.message || "알 수 없는 오류"));
    return;
}

  // 5. 성공 처리
  showAlert(isUpdateMode ? "메모가 수정되었습니다." : "메모가 등록되었습니다.");
  const id = result.resultData.id;
  if (id) {
    router.push(`/memo/${id}`);
    fetchMemos();
    fetchCurrentMemo(id);
  } else {
    router.push("/memo");
    fetchMemos();
  }
};

const remove = async () => {
    if(!await showConfirm("삭제하시겠습니까?")) return;
    try {
    const result = await MemoHttpService.deleteById(state.memo.id);
    if(result.resultData === 1) {
        showAlert("메모가 삭제되었습니다.");
        router.push("/memo");
        fetchMemos();
    } else {
    showAlert("메모 삭제에 실패하였습니다: ", + (result.message || "알 수 없는 오류가 발생하였습니다."));
    }  
  } catch (e) {
    console.error("메모 삭제 중 오류 발생:", e);
    showAlert("메모 삭제 중 오류 발생: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
  }
};

const handleImageChange = (e) => {
  const selectedFiles = e.target.files;
  if(!selectedFiles || selectedFiles.length === 0) {
    if (fileInputRef.value) {
      fileInputRef.value.value = ''; // 파일 입력 초기화
    }
    return;
  }
  const validFilesToAdd = [];
  const currentTotalImages = showImages.value.length;
  const maxImages = 5;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];

  // 최대 이미지 수 체크
  if (currentTotalImages + validFilesToAdd.length >= maxImages) {
    showAlert(`최대 ${maxImages}장의 이미지만 업로드할 수 있습니다.`);
    break;
    }

  // 파일 형식 체크
  if (!fileTypeCheck(file.name)) {
    continue;
  }

  // 파일 크기 체크
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxSizeInBytes) {
      showAlert(`파일 "${file.name}"의 크기(${formatBytes(file.size)})가 5MB를 초과하여 업로드할 수 없습니다.`);
      continue;
    }
  // 유효성 검사를 통과한 파일만 추가 대상 포함  
    validFilesToAdd.push(file);
  }
  // 유효한 파일드를 미리보기 항목 추가
  validFilesToAdd.forEach(file => {
    const currentImageUrl = URL.createObjectURL(file);
    showImages.value.push(currentImageUrl);
  });
  // 파일 입력 필드 초기화, 동일 파일을 다시 선택해도 change 이벤트 발생
    if (fileInputRef.value) {
      fileInputRef.value.value = ''; // 파일 입력 초기화
    }
  };

// removeImage 함수 재정의, 메모리 해제
const removeImage = (index) => {
const imageUrlToRemove = showImages.value[index];
if (imageUrlToRemove && imageUrlToRemove.startsWith('blob:')) {
    URL.revokeObjectURL(imageUrlToRemove);
  }
  showImages.value.splice(index, 1);
};

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const fileTypeCheck = (fileName) => {
  const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
  const allowed = ['jpg', 'jpeg', 'png', 'gif'];
  if(!allowed.includes(fileExtension)) {
    showAlert('jpg, jpeg, png, gif 형식의 파일만 등록 가능합니다.');
    // if (fileInputRef.value) {
    //   fileInputRef.value.value = ''; // 파일 입력 초기화
    // }
    return false;
  }
  return true;
};

</script>

<template>
    <div class="memo-detail-container">
      <h2 class="page-title">{{ isUpdateMode ? "메모 수정" : "새 메모 작성" }}</h2>

      <div class="input-section">
      <label for="memoTitle">제목</label>
        <input type="text" id="memoTitle" class="form-control" v-model="state.memo.title" required/>
      </div>

      <div class="input-section">
      <label for="memoContent">내용</label>
      <textarea id="memoContent" class="form-control" rows="8" v-model="state.memo.content" required></textarea>
      </div>

      <div class="input-section">
        <label for ="memoImageUpload">이미지 업로드 (최대 5장)</label>
        <input type="file" id="memoImageUpload" name="imageUpload"
               accept=".jpg, .png, .jpeg, .gif"
               class="form-control" @change="handleImageChange" multiple
               ref="fileInputRef" />
        <div class="preview-list">
      <div v-for="(img, index) in showImages" :key="index" class="preview-item">
        <img :src="img" alt="미리보기 이미지" />
        <button class="remove-btn" @click="removeImage(index)">X</button>
      </div>
    </div>
  </div>

    <div class="info-section" v-if="state.memo.createdAt">
      <strong>등록일시:</strong> {{ state.memo.createdAt }}
    </div>

    <div class="button-group">
      <button class="btn btn-primary" @click="save">
        {{ isUpdateMode ? "수정 완료" : "등록" }}
      </button>

      <button v-if="isUpdateMode" class="btn btn-danger" @click="remove">
        삭제
      </button>
      <button class="btn btn-secondary" @click="router.push('/memo')">
        목록
      </button>
    </div>

    <hr style="margin: 40px 0; border-top: 1px solid #eee;">
    <h3 style="text-align: center; color: #666; margin-bottom: 20px;">메모 목록</h3>

    <div class="memo-list-section">
      <div v-if="memoList.length === 0" class="no-memos">
        <p>등록된 메모가 없습니다. 새로운 메모를 작성해보세요!</p>
      </div>
      <ul v-else class="memo_items">
        <li v-for="memo in memoList" :key="memo.id" class="memo-item" @click="goToMemoDetail(memo.id)">
          <div class="memo-title">{{ memo.title }}</div>
          <div class="memo-content">{{ memo.content.length > 100 ? memo.content.substring(0, 100) + '...' : memo.content }}</div>
          <div class="memo-date">{{ memo.createdAt }}</div>
        </li>
      </ul>

      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">이전</button>
        <span>페이지 {{ currentPage }} / {{ Math.ceil(totalMemos / pageSize) || 1 }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= Math.ceil(totalMemos / pageSize)">다음</button>
      </div>
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
  </template>

  <style scoped src="./MemoDetail.css"></style>