<script setup>
import MemoHttpService from '@/services/memo/MemoHttpService.js';
import { reactive, onMounted, ref, computed, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import './MemoDetail.css';

const route = useRoute();
const router = useRouter();

const fileInputRef = ref(null);

const state = reactive({
  memo: {
    id: null, // 백엔드에서 설정, 초기화 null
    title: "",
    content: "",
    createdAt: null // 백엔드에서 설정, 초기화 null
  }
});

const isCreateMode = ref(false); // 새 메모 작성 모드 (ID가 없는 경우)
const isUpdateMode = ref(false); // 메모 수정 모드 (ID가 있고 수정 중인 경우)
const isViewMode = ref(false);   // 메모 상세 보기 모드 (ID가 있고 보기 중인 경우)

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

const clearForm = () => {
  state.memo = {
    id: null, // 초기화
    title: "",
    content: "",
    createdAt: null // 초기화
  };
  showImages.value = [];
  if (fileInputRef.value) {
    fileInputRef.value.value = ""; // 파일 입력 초기화
  }
};

const memoList = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const totalMemos = ref(0);

// const currentTime = ref(new Date().toLocaleString('ko-KR')); ref 저장
const currentTime = ref(new Date());
let intervalId = null; // setInterval Id

// 날짜 형식 변환 함수
const formatDateTime = (isoString) => {
  if(!isoString || typeof isoString !== 'string') {
    console.error("formatDateTime: 유효하지 않은 입력, 문자열이 아니거나 비어있습니다: ", isoString);
    return '';
  }
  const date = new Date(isoString.replace(/-/g, '/').replace('T', ' ')); // ISO 문자열을 Date 객체로 변환
  
  if(isNaN(date.getTime())) {
    console.error("유효하지 않은 날짜 형식 (파싱 실패): ", isoString);
    return ''; // 유효하지 않은 날짜 형식 처리
  }
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short', // 'short'는 '수' (수요일)
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // 오전/오후 사용
    timeZone: 'Asia/Seoul' // 서울 시간대 명시
  });
  // part 배열 생성, 재조합하는 부분 없이 직접 format() 사용
  return formatter.format(date);
};

// 현재 시간을 포맷팅하는 computed 속성
const currentTimeFormatted = computed(() => {
  return formatDateTime(currentTime.value.toISOString());
});

// 1. 현재 메모의 생성일시를 포맷팅
const formattedCurrentCreatedAt = computed(() => {
  if (!state.memo.createdAt) return '';
  return formatDateTime(state.memo.createdAt);
});

const setupComponentMode = async () => {
  const memoId = route.params.id;

  // 모든 모드 상태 초기화
  isCreateMode.value = false;
  isUpdateMode.value = false;
  isViewMode.value = false;

  if (memoId) {
    isViewMode.value = true;
    await fetchCurrentMemo(memoId);
  } else {
    isCreateMode.value = true;
    state.memo = {
      id: null,
      title: "",
      content: "",
      createdAt: null
    };
    showImages.value = [];
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }
  fetchMemos();
};

const enableUpdateMode = () => {
  isViewMode.value = false;
  isUpdateMode.value = true;
};

const fetchMemos = async () => {
  try {
    const apiResponse = await MemoHttpService.findAll({
      currentPage: currentPage.value,
      pageSize: pageSize.value
    });
    // API 응답이 성공적으로 왔으나 데이터가 비어있거나 예상과 다른 경우
    if (!apiResponse || !apiResponse.data) {
      console.warn("fetchMemos: 백엔드 응답이 비어있거나 유효한 데이터 객체가 없습니다. (메모가 없을 수 있음)", apiResponse);
      showAlert("메모 목록을 불러오는 중 오류가 발생했습니다. 서버 응답이 비어있습니다.");
      return;
    }
    const actualMemoListRes = apiResponse.data;

    if (actualMemoListRes && Array.isArray(actualMemoListRes.resultData)) {
      memoList.value = actualMemoListRes.resultData.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        createdAt: formatDateTime(memo.createdAt),
        representativeImage: memo.imageUrls && memo.imageUrls.length > 0 ? memo.imageUrls.at(0) : (memo.image ? memo.image : null)
      }));
      totalMemos.value = actualMemoListRes.totalCount;
  } else {
    console.error("fetchMemos: 백엔드 응답 데이터 구조가 예상과 다릅니다. (메모가 없을 수 있음)", actualMemoListRes);
    showAlert("메모 목록을 불러오는 중 오류가 발생했습니다. 데이터 형식이 올바르지 않습니다.");
  }
  } catch (error) {
    console.error("메모 목록을 불러오는 중 오류 발생:", error);
    showAlert("메모 목록을 불러오는 중 오류가 발생했습니다: " + (error.response?.data?.message || error.message || "알 수 없는 오류"));
    
    // 2. 네트워크 오류 또는 404 오류 처리
    // error.response가 undifined인 경우
    const statusCode = error.response ? error.response.status : null;
    if (statusCode === 404) {
      console.warn("API 엔드포인트를 찾을 수 없습니다. (메모가 없을 수 있거나, 경로 문제)");
      showAlert("메모 목록을 찾을 수 없습니다. 서버 구성을 확인해주세요."); // 개발자를 메시지
      // 사용자에게는 더 부드러운 메시지 또는 아무 메시지 없이 넘어갈 수 있음
      memoList.value = []; // 메모 리스트를 비움
      totalMemos.value = 0; // 총 메모 수를 0으로 설정
    } else if (error.code === 'ERR_NETWORK') {
      showAlert("네트워크 연결에 문제가 발생했습니다. 인터넷 연결을 확인해주세요.");
      memoList.value = [];
      totalMemos.value = 0;
    } else {
      // 그 외 알 수 없는 오류
      showAlert("메모 목록을 불러오는 중 오류가 발생했습니다: " + (error.response?.data?.message || error.message || "알 수 없는 오류"));
      memoList.value = [];
      totalMemos.value = 0;
    }
  }
};

const goToMemoDetail = (id) => {
    // 새 페이지로 이동
    router.push(`/memo/${id}`);
  };

const fetchCurrentMemo = async (id) => {
  try {
    const { resultData } = await MemoHttpService.findById(id);
    state.memo = resultData;
    showImages.value = []; // 기존 이미지 초기화
    // 백엔드에서 이미지 URL을 반환하는 경우 대비하여 처리
    
    if (state.memo.imageUrls && Array.isArray(resultData.imageUrls)) {
      showImages.value = resultData.imageUrls;
    } else if (resultData.image) {
      showImages.value.push(resultData.image);
    }
  } catch (e) {
    showAlert("메모 정보를 불러오는 중 오류가 발생했습니다: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
    router.push("/memo");
  }
};

    const changePage = (pageNumber) => {
      const Maxpage = Math.ceil(totalMemos.value / pageSize.value) || 1;
      if (pageNumber >= 1 && pageNumber <= Maxpage) {
          currentPage.value = pageNumber;
          fetchMemos();
      }
    };


onMounted( async () => {
    await setupComponentMode();
  // 1. 현재 시간을 1초마다 업데이트
  intervalId = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

// 라우트 경로 변경 감지 (주로 /memo -> /memo/:id, 또는 /memo/:id -> /memo 로 변경될 때)
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    setupComponentMode(); // 라우트 ID가 변경되면 모드 재설정
  }
}, { immediate: true }); // 컴포넌트가 처음 마운트될 때도 즉시 실행

// 컴포넌트 언마운트 시 interval 해제
onBeforeUnmount(() => {
    clearInterval(intervalId);
  });

const save = async () => {
  console.log("프론트엔드 save 함수 실행: state.memo.title=", state.memo.title);
  console.log("프론트엔드 save 함수 실행: state.memo.content=", state.memo.content);
  // 제목, 내용이 비어있는지 확인
  if (!state.memo.title.trim()) {
    showAlert("제목을 입력해주세요.");
    return;
  }
    if (state.memo.title.length < 10) { // 제목 10자 미만 조건 추가
    showAlert("제목은 10자 이상으로 입력해주세요.");
    return;
  }

  // 내용 유효성 검사: 비어있거나 유효하지 않은 타입인 경우
  if (!state.memo.content || typeof state.memo.content !== 'string' || !state.memo.content.trim()) {
    showAlert("내용을 입력해주세요.");
    return;
  }

  // 내용 길이 유효성 검사
  if (state.memo.content.length < 10 || state.memo.content.length > 500) {
    showAlert("내용은 10자 이상, 500자 이하로 입력해주세요.");
    return;
  }

  const userId = 1; // TODO: 실제 로그인 사용자 ID로 교체

  // 1. JSON 데이터 준비
  const reqPayload = {
    id: state.memo.id || null,
    memberNoLogin: userId,
    title: state.memo.title,
    content: state.memo.content,
  };

  // 3. API 호출
  let result;
  try {
    if (isUpdateMode.value) {
      // 수정 모드인 경우, JSON 데이터만 전송
      result = await MemoHttpService.modify(state.memo.id, reqPayload);
    } else if (isCreateMode.value) {
      // 등록 모드인 경우, FormData 사용, JSON과 파일을 함꼐 전송
    const formData = new FormData();
    formData.append("memoData", new Blob([JSON.stringify(reqPayload)], { type: "application/json" }));

  const selectedNewFiles = fileInputRef.value?.files;
    if (selectedNewFiles && selectedNewFiles.length > 0) {
      for (let i = 0; i < selectedNewFiles.length; i++) {
        const file = selectedNewFiles[i];
        formData.append("memoImageFiles", file);
      }
    }
    result = await MemoHttpService.create(userId, formData);
    }
  } catch (e) {
    console.error("서버 요청 중 오류 발생:", e);
    showAlert("서버 요청 중 오류 발생: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
    return;
  }

  // 4. 응답 처리
  if (result && result?.resultData) {
    showAlert(isUpdateMode.value ? "메모가 수정되었습니다." : "메모가 등록되었습니다.");
    state.memo = {
      id: null,
      title: "",
      content: "",
      createdAt: null
    };
    showImages.value = []; // 이미지 초기화
    if (fileInputRef.value) {
      fileInputRef.value.value = ''; // 파일 입력 초기화
    }
    const id = result.resultData.id;
    if (isCreateMode.value) {
      router.push("/memo");
    } else if (isUpdateMode.value) {
      router.push(`/memo/${id}`);
    } else {
      router.push("/memo");
    }
  } else if (result && result.message) {
    showAlert(result.message);
    clearForm(); // 폼 초기화
  } else {
    showAlert("메모 등록/수정 실패: " + (result?.message || "알 수 없는 오류"));
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
    showAlert("메모 삭제에 실패하였습니다: " + (result.message || "알 수 없는 오류가 발생하였습니다."));
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
      <h2 class="page-title">
        <span v-if="isCreateMode">새 메모 작성</span>
        <span v-else-if="isUpdateMode">메모 수정</span>
        <span v-else-if="isViewMode">메모 상세</span>
        <span v-else>메모</span>
      </h2>

      <div class="input-section">
      <label for="memoTitle">제목</label>
        <input type="text" id="memoTitle" class="form-control"
               v-model="state.memo.title" :readonly="isViewMode" required/>
      </div>

      <div class="input-section">
      <label for="memoContent" >내용</label>
      <textarea id="memoContent" class="form-control" rows="8"
                v-model="state.memo.content" :readonly="isViewMode" required></textarea>
      </div>

      <div class="input-section">
        <label v-if="!isViewMode" for ="memoImageUpload">이미지 업로드 (최대 5장)</label>
        <input v-if="!isViewMode" type="file" id="memoImageUpload" name="imageUpload"
               accept=".jpg, .png, .jpeg, .gif"
               class="form-control" @change="handleImageChange" multiple
               ref="fileInputRef" />
        <div class="preview-list">
      <div v-for="(img, index) in showImages" :key="index" class="preview-item">
        <img :src="img" alt="미리보기 이미지" />
        <button v-if="!isViewMode" class="remove-btn" @click="removeImage(index)">X</button>
      </div>
      <p v-if="isViewMode && showImages.length === 0" class="no-images-text">등록된 이미지가 없습니다.</p>
    </div>
  </div>

    <div class="info-section" v-if="isCreateMode">
      <strong>현재 시각:</strong> {{ currentTimeFormatted }} </div>
    <div class="info-section" v-else-if="isViewMode || isUpdateMode">
      <strong>등록 일시:</strong> {{ formattedCurrentCreatedAt }} </div>

    <div class="button-group">
      <button v-if="isCreateMode" class="btn btn-primary" @click="save">등록</button>
      <button v-if="isUpdateMode" class="btn btn-primary" @click="save">수정 완료</button>
      <button v-if="isViewMode" class="btn btn-secondary" @click="enableUpdateMode">수정</button>
      <button v-if="isViewMode" class="btn btn-danger" @click="remove">삭제</button>
      <button class="btn btn-secondary" @click="router.push('/home')">홈</button>
    </div>

    <hr style="margin: 40px 0; border-top: 1px solid #eee;">
    <h3 style="text-align: center; color: #666; margin-bottom: 20px;">메모 목록</h3>

    <div class="memo-list-section">
      <div v-if="memoList.length === 0" class="no-memos">
        <p>등록된 메모가 없습니다. 새로운 메모를 작성해보세요!</p>
      </div>
        <ul v-else class="memo-items">
        <li v-for="memo in memoList" :key="memo.id" class="memo-item" @click="goToMemoDetail(memo.id)">
          <div v-if="memo.representativeImage" class="memo-image-preview">
            <img :src="memo.representativeImage" alt="대표 이미지" style="max-width: 50px; max-height: 50px;">
            </div>
          <div class="memo-title">{{ memo.title }}</div>
          <div class="memo-content">{{ memo.content.length > 100 ? memo.content.substring(0, 100) + '...' : memo.content }}</div>
          <div class="memo-date">{{ memo.createdAt  }}</div>
        </li>
      </ul>

      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">이전</button>
        <span>페이지 {{ currentPage }} / {{ Math.ceil(totalMemos / pageSize) || 1 }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= Math.ceil(totalMemos / pageSize)">다음</button>
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
