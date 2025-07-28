import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/counter.js';
import MemoHttpService from '@/services/memo/MemoHttpService';

export function useMemoDetail() {
  const accountStore = useAccountStore();
  const router = useRouter();
  const route = useRoute();

  // 📌 메모 객체 초기값
  const memo = ref({
    id: null,
    memoName: '',
    memoContent: '',
    createdAt: null,
    imageFileName: null,
  });

  const fileInputRef = ref(null);
  const mode = ref('view');
  const previewImages = ref([]); // ✅ 반드시 ref([])

  // 📌 모드 관련 computed
  const isCreateMode = computed(() => mode.value === 'create');
  const isEditMode = computed(() => mode.value === 'edit');
  const isViewMode = computed(() => mode.value === 'view');

  // ✅ imageCount: 항상 숫자를 반환하도록 안전 처리
  const imageCount = computed(() => previewImages.value?.length ?? 0);

  // ✅ hasNoImages: 이미지 없을 때 조건
  const hasNoImages = computed(() =>
    isViewMode.value && imageCount.value === 0
  );

  const setMode = (newMode) => {
    mode.value = newMode;
  };

  // 📌 입력 필드 초기화
  const clearForm = () => {
    memo.value = {
      id: null,
      memoName: '',
      memoContent: '',
      createdAt: null,
      imageFileName: null,
    };
    previewImages.value.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
  };

  // 📌 메모 조회
const fetchMemo = async (id) => {
  try {
    console.log('[fetchMemo] 요청 ID:', id);
    const { resultData } = await MemoHttpService.findById(id);
    console.log('[fetchMemo] resultData:', resultData);

    if (!resultData) {
      console.warn('[fetchMemo] 조회된 메모 없음 또는 null');
      alert('해당 메모를 불러올 수 없습니다.');
      return router.push('/memo');
    }

    memo.value = resultData;

    // imageFileName이 null이어도 안전하게 처리
    previewImages.value = resultData.imageFileName
      ? [`/pic/${resultData.imageFileName}`]
      : [];

  } catch (e) {
    console.error('[fetchMemo] 메모 조회 실패:', e);
    alert('메모를 불러오는 도중 오류가 발생했습니다.');
    router.push('/memo');
  }
};

  // 📌 이미지 업로드 처리
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const file = files[0];
    if (!file) return;

    const extAllowed = ['jpg', 'jpeg', 'png', 'gif'];
    const maxSize = 5 * 1024 * 1024;
    const ext = file.name.split('.').pop().toLowerCase();

    if (!extAllowed.includes(ext)) {
      alert('허용되지 않는 파일 형식입니다.');
      return;
    }
    if (file.size > maxSize) {
      alert('파일 크기가 5MB를 초과합니다.');
      return;
    }

    previewImages.value.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    previewImages.value = [URL.createObjectURL(file)];
  };

  // 📌 이미지 제거
  const removeImage = () => {
    if (previewImages.value[0]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImages.value[0]);
    }
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
  };

  // 📌 로그인 체크 및 초기 데이터 로딩
  onMounted(async () => {
    if (!accountStore.state.loggedIn) {
      alert('로그인 후 이용해주세요.');
      return router.push('/account/login');
    }

    const id = route.params.id;
    if (id && id !== 'create') {
      setMode('view');
      await fetchMemo(id);
    } else {
      setMode('create');
    }
  });

  return {
    memo,
    previewImages,
    fileInputRef,
    mode,
    isCreateMode,
    isViewMode,
    isEditMode,
    setMode,
    clearForm,
    fetchMemo,
    handleImageChange,
    removeImage,
    hasNoImages,
    imageCount,
  };
}