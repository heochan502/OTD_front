import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';
import { useAccountStore } from '@/stores/counter';

export function useMemoDetail(props, emit) {
  const accountStore = useAccountStore();
  const router = useRouter();
  const route = useRoute();

  const memo = ref({
    id: null,
    memoName: '',
    memoContent: '',
    imageFileName: null,
    createdAt: null,
  });

  const fileInputRef = ref(null);
  const previewImages = ref([]);
  const mode = ref('view');

  const isCreateMode = computed(() => mode.value === 'create');
  const isEditMode = computed(() => mode.value === 'edit');
  const isViewMode = computed(() => mode.value === 'view');

  const isTitleValid = computed(() => memo.value.memoName.trim().length >= 10);
  const isContentValid = computed(() => memo.value.memoContent.length >= 10);

  const setMode = (value) => {
    mode.value = value;
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      previewImages.value = [reader.result];
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    previewImages.value.splice(index, 1);
    if (fileInputRef.value) {
      fileInputRef.value.value = null;
    }
  };

  const clearPreviewImages = () => {
    previewImages.value = [];
    if (fileInputRef.value) {
      fileInputRef.value.value = null;
    }
  };

  const createMemo = async () => {
    try {
      const formData = new FormData();
      const memoData = new Blob(
        [JSON.stringify(memo.value)],
        { type: 'application/json' }
      );

      formData.append('memoData', memoData);
      if (fileInputRef.value?.files[0]) {
        formData.append('memoImageFiles', fileInputRef.value.files[0]);
      }

      await MemoHttpService.create(formData);
      emit('created');
      clearPreviewImages();
    } catch (err) {
      console.error('메모 등록 실패', err);
    }
  };

  const updateMemo = async () => {
    try {
      const formData = new FormData();
      const memoData = new Blob(
        [JSON.stringify(memo.value)],
        { type: 'application/json' }
      );

      formData.append('memoData', memoData);
      if (fileInputRef.value?.files[0]) {
        formData.append('memoImageFiles', fileInputRef.value.files[0]);
      }

      await MemoHttpService.modify(formData);
      emit('updated');
      setMode('view');
      clearPreviewImages();
    } catch (err) {
      console.error('메모 수정 실패', err);
    }
  };

  const deleteMemo = async () => {
    try {
      if (confirm('정말 삭제하시겠습니까?')) {
        await MemoHttpService.deleteById(memo.value.id);
        emit('deleted');
      }
    } catch (err) {
      console.error('메모 삭제 실패', err);
    }
  };

  const cancelEdit = () => {
    emit('cancel');
  };

  const fetchCurrentMemo = async (id) => {
    try {
      const data = await MemoHttpService.findById(id);
      memo.value = data;
      clearPreviewImages();
    } catch (err) {
      console.error('메모 조회 실패', err);
    }
  };
watch(
  () => props.memoProp,
  (newMemo) => {
    if (newMemo) {
      memo.value = { ...newMemo };
      setMode('view'); // 선택 시 항상 view 모드로 진입
      clearPreviewImages();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (!accountStore.state.loggedIn) {
    alert('로그인 후 이용해주세요.');
    return router.push('/account/login');
  }

  if (route.path.includes('/add')) {
    setMode('create');
    return;
  }

  const id = route.params.id;
  if (id) {
    fetchCurrentMemo(id);   
    mode.value = 'view';
  } else {
    mode.value = 'create';
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
    isEditMode,
    isViewMode,
    isTitleValid,
    isContentValid,
    setMode,
    handleImageChange,
    removeImage,
    createMemo,
    updateMemo,
    deleteMemo,
    cancelEdit,
    clearPreviewImages,
  };
}