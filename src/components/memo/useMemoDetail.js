import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';

export function useMemoDetail(props, emit) {
  const memo = ref({
    id: null,
    memoName: '',
    memoContent: '',
    createdAt: null,
    imageFileName: null,
  });

  const previewImages = ref([]);
  const fileInputRef = ref(null);
  const mode = ref('view');
  const route = useRoute();
  const router = useRouter();
  const accountStore = useAccountStore();

  const isCreateMode = computed(() => mode.value === 'create');
  const isViewMode = computed(() => mode.value === 'view');
  const isEditMode = computed(() => mode.value === 'edit');
  const hasNoImages = computed(() => isViewMode.value && previewImages.value.length === 0);

  const setMode = (newMode) => {
    mode.value = newMode;
  };

  const clearPreviewImages = () => {
    previewImages.value.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
    const ext = file.name.split('.').pop().toLowerCase();
    const maxSize = 5 * 1024 * 1024;

    if (!allowedExts.includes(ext)) {
      alert('허용되지 않는 파일 형식입니다.');
      return;
    }
    if (file.size > maxSize) {
      alert('파일 크기가 5MB를 초과합니다.');
      return;
    }

    clearPreviewImages();
    previewImages.value = [URL.createObjectURL(file)];
  };

  const removeImage = () => {
    clearPreviewImages();
    memo.value.imageFileName = null;
  };

  const createMemo = async () => {
    try {
      const formData = new FormData();
      formData.append('memoData', new Blob([JSON.stringify(memo.value)], { type: 'application/json' }));
      const file = fileInputRef.value?.files?.[0];
      if (file) {
        formData.append('memoImageFiles', file);
      }

      await MemoHttpService.create(formData);
      alert('메모가 등록되었습니다.');
      emit('created');
      memo.value = { id: null, memoName: '', memoContent: '', createdAt: null, imageFileName: null };
      clearPreviewImages();
    } catch (e) {
      alert('등록 실패');
      console.error('등록 오류:', e);
    }
  };

  const updateMemo = async () => {
    try {
      const file = fileInputRef.value?.files?.[0];
      const formData = new FormData();

      const memoData = {
        id: memo.value.id,
        memoName: memo.value.memoName,
        memoContent: memo.value.memoContent,
        imageFileName: memo.value.imageFileName,
      };

      formData.append('memoData', new Blob([JSON.stringify(memoData)], { type: 'application/json' }));
      if (file) formData.append('memoImageFiles', file);

      await MemoHttpService.modify(formData);
      alert('수정 완료');
      setMode('view');
      await fetchMemo(memo.value.id);
      emit('updated');
    } catch (err) {
      alert('수정 실패');
    }
  };

  const deleteMemo = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await MemoHttpService.deleteById(memo.value.id);
      alert('삭제 완료');
      emit('deleted');
      router.push('/memoAndDiary/memo/list');
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const cancelEdit = async () => {
    if (memo.value.id) {
      setMode('view');
      await fetchMemo(memo.value.id);
    } else {
      emit('cancel');
      router.push('/memoAndDiary/memo/list');
    }
  };

  const fetchMemo = async (id) => {
    try {
      const result = await MemoHttpService.findById(id);
      if (!result) {
        return router.push('/memoAndDiary/memo/list');
      }
      memo.value = result;
      previewImages.value = result.imageFileName ? [`/pic/${result.imageFileName}`] : [];
    } catch (err) {
      alert('메모 조회 실패');
      router.push('/memoAndDiary/memo/list');
    }
  };

  watch(
    () => props?.memoProp,
    (newVal) => {
      if (newVal) {
        memo.value = { ...newVal };
        previewImages.value = newVal.imageFileName ? [`/pic/${newVal.imageFileName}`] : [];
        setMode('view');
      }
    },
    { immediate: true }
  );

  onMounted(async () => {
    const id = route.params.id;
    if (!props?.memoProp && id && id !== 'create') {
      setMode('view');
      await fetchMemo(id);
    } else if (!props?.memoProp) {
      setMode('create');
    }
  });

  onBeforeUnmount(() => {
    clearPreviewImages();
  });

  return {
    memo,
    previewImages,
    fileInputRef,
    isCreateMode,
    isViewMode,
    isEditMode,
    hasNoImages,
    setMode,
    handleImageChange,
    removeImage,
    createMemo,
    updateMemo,
    deleteMemo,
    cancelEdit,
  };
}