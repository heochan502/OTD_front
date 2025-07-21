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

const isUpdateMode = route.params.id !== undefined;
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
    const { resultData } = await MemoHttpService.findById(id);
    state.memo = resultData;
    if(state.memo.image) {
      showImages.value.push(state.memo.image);
    }
  }
});

const save = async () => {
  // 1. JSON 데이터 준비
  const reqPayload = {
    title: state.memo.title,
    content: state.memo.content,
  };

  // 2. FormData 구성
  const formData = new FormData();
  formData.append(
    'req',
    new Blob([JSON.stringify(reqPayload)], { type: 'application/json' }),
    'memoData.json'
  );

  // 3. 이미지가 있으면 추가
  if (fileInputRef.value && fileInputRef.value.files.length > 0) {
   formData.append('memoImageFile', fileInputRef.value.files[0]);
  }

  // 4. API 호출
  let result;
  try {
    if (isUpdateMode) {
      result = await MemoHttpService.modify(state.memo.id, formData);
    } else {
      const userId = 1; // TODO: 실제 로그인 사용자 ID로 교체
      result = await MemoHttpService.create(userId, formData);
    }
  } catch (e) {
    showAlert("서버 요청 중 오류 발생: " + e.message);
    return;
  }

  // 5. 응답 처리
  if (!result || result.status !== 200 || !result.resultData) {
    showAlert("메모 등록/수정 실패: " + (result?.message || "알 수 없는 오류"));
    return;
  }

  // 6. 성공 처리
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
    const result = await MemoHttpService.deleteById(state.memo.id);
    if(result.resultData === 1) {
        showAlert("삭제되었습니다.");
        router.push("/otd/memo");
    } else {
    showAlert("메모 삭제 실패: ", + (result.message || "알 수 없는 오류가 발생하였습니다."));
    }
};

const handleImageChange = async (e) => {
  const files = e.target.files;
  if(!files || files.length === 0) return;

  // 유효성 검사 (파일 형식)
  if (!fileTypeCheck(e.target)) {
    showAlert("이미지 파일 형식이 올바르지 않습니다.");
    return;
  }

  const validFiles = [];
  for(let i=0; i<files.length; i++) {
    const file = files[i];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxSizeInBytes) {
      showAlert(`파일 "${file.name}"의 크기(${formatBytes(file.size)})가 5MB를 초과하여 업로드할 수 없습니다.`);
      continue;
    }
    validFiles.push(file);
  }

  let newImageUrlLists = [...showImages.value];

  for(let i=0; i<validFiles.length; i++) {
    const file = validFiles[i];
    const currentImageUrl = URL.createObjectURL(file);
    newImageUrlLists.push(currentImageUrl);
  }
  if(newImageUrlLists.length > 5) {
    newImageUrlLists = newImageUrlLists.slice(0, 5);
    showAlert("최대 5장의 이미지만 업로드할 수 있습니다.");
  }
  showImages.value = newImageUrlLists;
  e.target.value = '';
};

const removeImage = (index) => {
  URL.revokeObjectURL(showImages.value[index]);
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

const fileTypeCheck = (obj) => {
  const fileName = obj.value;
  const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
  const allowed = ['jpg', 'jpeg', 'png', 'gif'];
  if(!allowed.includes(fileExtension)) {
    showAlert('jpg, jpeg, png, gif 형식의 파일만 등록 가능합니다.');
    obj.value = '';
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