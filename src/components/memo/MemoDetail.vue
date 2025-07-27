<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "../../../stores/account";
import MemoHttpService from "../../../services/MemoHttpService";
import { formatDateTime } from "../../../utils/formatDate";
import useModal from "../../../composables/useModal";
import './memoDetail.css';

const accountStore = useAccountStore();
const router = useRouter();
const route = useRoute();

const showMemos = ref([]);
const state = ref({
  memo: {
    id: null,
    memoName: "",
    memoContent: "",
  },
});

const mode = ref("view"); // view | create | edit
const isEditMode = computed(() => mode.value === "edit");

const currentPage = ref(1);
const pageSize = ref(5);
const totalMemos = ref(0);

const { showModal, confirmModal } = useModal();
const showImages = ref([]);
const selectedImageFiles = ref([]);

const totalPages = computed(() => {
  return Math.ceil(totalMemos.value / pageSize.value) || 1;
});

const fetchMemoList = async () => {
  try {
    const res = await MemoHttpService.findAll({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    });
    const resultData = res?.resultData;
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

const fetchCurrentMemo = async (id) => {
  try {
    const { resultData } = await MemoHttpService.findById(id);
    state.value.memo = resultData;
    showImages.value = [];

    if (Array.isArray(resultData.imageFileNames)) {
      showImages.value = resultData.imageFileNames.map(file => `/pic/${file}`);
    } else if (resultData.imageFileName) {
      showImages.value = [`/pic/${resultData.imageFileName}`];
    }
  } catch (err) {
    console.error("메모 불러오기 실패:", err);
    alert("메모 정보를 불러올 수 없습니다.");
  }
};

const createMemo = async () => {
  try {
    if (!accountStore.isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    const memoData = {
      memoName: state.value.memo.memoName,
      memoContent: state.value.memo.memoContent,
    };

    formData.append("memoData", new Blob([JSON.stringify(memoData)], { type: "application/json" }));
    selectedImageFiles.value.forEach(file => {
      formData.append("memoImageFiles", file);
    });

    await MemoHttpService.create(accountStore.memberId, formData);
    alert("메모가 등록되었습니다.");
    router.replace({ path: "/memo" });
    mode.value = "view";
    await fetchMemoList();
  } catch (err) {
    console.error("메모 등록 실패:", err);
    alert("메모 등록 중 오류 발생");
  }
};

const updateMemo = async () => {
  try {
    await MemoHttpService.modify(state.value.memo.id, {
      memoName: state.value.memo.memoName,
      memoContent: state.value.memo.memoContent,
    });
    alert("메모가 수정되었습니다.");
    mode.value = "view";
    await fetchMemoList();
  } catch (err) {
    console.error("메모 수정 실패:", err);
    alert("메모 수정 중 오류 발생");
  }
};

const deleteMemo = async (id) => {
  const confirmed = await confirmModal("정말 삭제하시겠습니까?");
  if (!confirmed) return;

  try {
    await MemoHttpService.deleteById(id);
    alert("메모가 삭제되었습니다.");
    await fetchMemoList();
  } catch (err) {
    console.error("메모 삭제 실패:", err);
    alert("메모 삭제 중 오류 발생");
  }
};

const handleImageUpload = (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  for (const file of files) {
    if (selectedImageFiles.value.find(f => f.name === file.name)) {
      alert(`이미 선택된 파일: ${file.name}`);
      continue;
    }

    if (!file.type.startsWith("image/")) {
      alert(`이미지 파일이 아닙니다: ${file.name}`);
      continue;
    }

    selectedImageFiles.value.push(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      showImages.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  event.target.value = "";
};

const removeImage = (index) => {
  showImages.value.splice(index, 1);
  selectedImageFiles.value.splice(index, 1);
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchMemoList();
  }
};

const resetForm = () => {
  state.value.memo = {
    id: null,
    memoName: "",
    memoContent: "",
  };
  selectedImageFiles.value = [];
  showImages.value = [];
};

onMounted(async () => {
  if (!accountStore.isLoggedIn) {
    await showModal("로그인이 필요합니다.");
    router.push("/account/login");
    return;
  }

  const id = route.params.id;
  if (id === "new") {
    mode.value = "create";
    resetForm();
  } else if (id) {
    await fetchCurrentMemo(id);
    mode.value = "view";
  }

  await fetchMemoList();
});
</script>

<template>
  <div class="memo-detail">
    <div v-if="mode === 'create' || isEditMode">
      <h2>{{ mode === 'create' ? '새 메모 작성' : '메모 수정' }}</h2>
      <input v-model="state.memo.memoName" placeholder="제목" />
      <textarea v-model="state.memo.memoContent" placeholder="내용" />
      <input type="file" accept="image/*" multiple @change="handleImageUpload" />
      <div class="image-preview">
        <div v-for="(src, index) in showImages" :key="index">
          <img :src="src" alt="업로드된 이미지" />
          <button @click="removeImage(index)">삭제</button>
        </div>
      </div>
      <button @click="mode === 'create' ? createMemo() : updateMemo()">
        {{ mode === 'create' ? '등록' : '수정' }}
      </button>
    </div>

    <div v-else>
      <h2>{{ state.memo.memoName }}</h2>
      <p>{{ state.memo.memoContent }}</p>
      <div class="image-preview">
        <img v-for="(src, index) in showImages" :key="index" :src="src" />
      </div>
      <p>{{ formatDateTime(state.memo.createdAt, true) }}</p>
      <button @click="mode = 'edit'">수정</button>
    </div>

    <div class="memo-list">
      <h3>메모 목록</h3>
      <ul>
        <li v-for="memo in showMemos" :key="memo.id">
          <router-link :to="`/memo/${memo.id}`">{{ memo.memoName }}</router-link>
          <button @click="deleteMemo(memo.id)">삭제</button>
        </li>
      </ul>
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>
  </div>
</template>