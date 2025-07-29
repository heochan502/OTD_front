import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';  // useRoute를 추가
import MemoHttpService from '@/services/memo/MemoHttpService';
import { useAccountStore } from '@/stores/counter.js';

export function useMemoDetail() {
  const memo = ref({
    id: null,
    memoName: '',
    memoContent: '',
    createdAt: null,
    imageFileName: null,
  });
  const accountStore = useAccountStore();
  const previewImages = ref([]);
  const fileInputRef = ref(null);
  const mode = ref('view');
  const route = useRoute();  // useRoute를 추가하여 route 정의
  const router = useRouter();

  const isCreateMode = computed(() => mode.value === 'create');
  const isViewMode = computed(() => mode.value === 'view');
  const isEditMode = computed(() => mode.value === 'edit');
  const imageCount = computed(() => previewImages.value.length ?? 0);
  const hasNoImages = computed(() => isViewMode.value && imageCount.value === 0);

  const setMode = (m) => (mode.value = m);

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

  const fetchMemo = async (id) => {
    try {
      const { resultData } = await MemoHttpService.findById(id);
      if (!resultData) {
        console.error('해당 메모를 찾을 수 없습니다.');
        alert('해당 메모를 찾을 수 없습니다.');
        return router.push('/memoAndDiary/memo'); // 메모 목록으로 이동
      }
      memo.value = resultData;
      previewImages.value = resultData.imageFileName
        ? [`/pic/${resultData.imageFileName}`]
        : [];
    } catch (e) {
      console.error('메모 조회 실패:', e);
      alert('메모 조회 중 오류 발생');
      router.push('/memoAndDiary/memo');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
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

    const formData = new FormData();
    formData.append('memoImageFiles', file);
  };

  const removeImage = () => {
    if (previewImages.value[0]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImages.value[0]);
    }
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
    memo.value.imageFileName = null;
  };

  const createMemo = async () => {
    try {
      const formData = new FormData();
      formData.append(
        'memoData',
        new Blob([JSON.stringify(memo.value)], { type: 'application/json' })
      );

      const file = fileInputRef.value?.files?.[0];
      if (file) formData.append('memoImageFiles', file);

      const result = await MemoHttpService.create(formData);
      alert('메모가 등록되었습니다.');
      router.push(`/memoAndDiary/memo/${result.id}`);
    } catch (e) {
      alert('메모 등록 실패');
      console.error(e);
    }
  };

  const updateMemo = async () => {
    try {
      const formData = new FormData();
      formData.append(
        'memoData',
        new Blob([JSON.stringify(memo.value)], { type: 'application/json' })
      );

      const file = fileInputRef.value?.files?.[0];
      if (file) formData.append('memoImageFiles', file);

      await MemoHttpService.modify(formData);
      alert('수정 완료');
      setMode('view');
      await fetchMemo(memo.value.id);
    } catch (e) {
      alert('수정 실패');
      console.error(e);
    }
  };

  const deleteMemo = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await MemoHttpService.deleteById(memo.value.id);
      alert('삭제 완료');
      router.push('/memoAndDiary/memo');
    } catch (e) {
      alert('삭제 실패');
      console.error(e);
    }
  };

  const cancelEdit = async () => {
    if (memo.value.id) {
      setMode('view');
      await fetchMemo(memo.value.id);
    } else {
      router.push('/memoAndDiary/memo');
    }
  };

  onMounted(async () => {
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
    createMemo,
    updateMemo,
    deleteMemo,
    cancelEdit,
    hasNoImages,
    imageCount,
  };
}