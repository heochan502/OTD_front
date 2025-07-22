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
  formData.append("req", new Blob([JSON.stringify(reqPayload)], { type: "application/json" }));
  
  const selectedNewFiles = fileInputRef.value?.files;
  if (selectedNewFiles && selectedNewFiles.length > 0) {
    for (let i = 0; i < selectedNewFiles.length; i++) {
      const file = selectedNewFiles[i];
      formData.append("memoImageFiles", file);
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
  } else {
    router.push("/memo");
  }
};

const remove = async () => {
    if(!await showConfirm("삭제하시겠습니까?")) return;
    try {
    const result = await MemoHttpService.deleteById(state.memo.id);
    if(result.resultData === 1) {
        showAlert("메모가 삭제되었습니다.");
        router.push("/memo");
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
  
  <style scoped>
  
  .memo-detail-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .page-title {
    font-size: 2.2rem;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 700;
}
  .input-section {
  margin-bottom: 25px;
}
  .input-section label {
  display: block;
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 8px;
  font-weight: 600;
}
  .form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease;
}

  .form-control:focus {
  border-color: skyblue;
  outline: none;
  box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.3);
}

  textarea.form-control {
  resize: vertical;
  min-height: 120px;
}
  .preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}

  .preview-item {
    position: relative;
    width: 120px;
    height: 120px;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e9e9e9;
}

  .preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(255, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    font-weight: bold;
    width: 25px;
    height: 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
}

  .remove-btn:hover {
    background: red;
}

  .info-section {
    font-size: 1rem;
    color: #666;
    margin-top: 25px;
    padding-top: 15px;
    border-top: 1px dashed #e0e0e0;
}

  .button-group {
    display: flex;
    gap: 15px;
    margin-top: 30px;
    justify-content: center;
}

  .btn {
    padding: 12px 25px;  
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

  .btn-primary {
    background-color: skyblue;
    color: black;
    border: none;
}

  .btn-primary:hover {
    background-color: #87ceeb;
    transform: translateY(-2px);
}

  .btn-danger {
    background-color: #dc3545;
    color: white;
    border: none;
}

  .btn-danger:hover {
    background-color: #c82333;
    transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 300px;
  max-width: 90%;
  color: black;
  font-size: 1.2rem;
  font-weight: 500;
}

.modal-content p {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #333;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.modal-btn:hover {
  opacity: 0.9;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.modal-btn.confirm-yes {
  background-color: skyblue;
  color: black;
}

.modal-btn.confirm-no {
  background-color: #ccc;
  color: #333;
}
</style>