import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';
import { useAccountStore } from '@/stores/counter';

export function useMemoDetail(props, emit) {
  const accountStore = useAccountStore();
  const router = useRouter();
  const route = useRoute();

  const memo = ref({
    memoId: null,
    memoName: '',
    memoContent: '',
    memoImage: '',
    createdAt: null,
  });

  const fileInputRef = ref(null);
  const previewImages = ref([]);
  const mode = ref('view');

  const IMAGE_BASE = '/api/OTD/memoAndDiary/memo/image/';

  const isCreateMode = computed(() => mode.value === 'create');
  const isEditMode   = computed(() => mode.value === 'edit');
  const isViewMode   = computed(() => mode.value === 'view');

  const isTitleValid   = computed(() => memo.value.memoName.trim().length >= 5);
  const isContentValid = computed(() => memo.value.memoContent.trim().length >= 10);

  const setMode = (value) => { mode.value = value; };

  const clearPreviewImages = () => {
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = null;
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    previewImages.value = [];

    if (files && files.length > 0) {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImages.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index) => {
    previewImages.value.splice(index, 1);
    if (fileInputRef.value) fileInputRef.value.value = null;
  };

  const buildFormData = (dataKey, memoObj, fileKey, inputEl) => {
    const fd = new FormData();
    const { memoImage, createdAt, ...rest } = memoObj;
    fd.append(dataKey, new Blob([JSON.stringify(rest)], { type: 'application/json' }));
    const file = inputEl?.files?.[0];
    if (file) fd.append(fileKey, file);
    return fd;
  };

  const createMemo = async () => {
    try {
      const payload = { ...memo.value, memberNoLogin: accountStore.state.memberNoLogin };
      const formData = buildFormData('memoData', payload, 'memoImage', fileInputRef.value);
      await MemoHttpService.create(formData);
      emit('created');
      clearPreviewImages();
    } catch (err) {
      console.error('메모 등록 실패', err);
    }
  };

  const updateMemo = async () => {
    try {
      const payload = { ...memo.value, memberNoLogin: accountStore.state.memberNoLogin };
      const formData = buildFormData('memoData', payload, 'memoImage', fileInputRef.value);
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
        await MemoHttpService.deleteById(memo.value.memoId);
        emit('deleted');
      }
    } catch (err) {
      console.error('메모 삭제 실패', err);
    }
  };

  const cancelEdit = () => { emit('cancel'); };

  const fetchCurrentMemo = async (id) => {
    try {
      const data = await MemoHttpService.findById(id);
      memo.value = {
        memoId: data.memoId ?? null,
        memoName: data.memoName ?? '',
        memoContent: data.memoContent ?? '',
        memoImage: data.memoImage ?? null,
        createdAt: data.createdAt ?? null,
      };
      previewImages.value = memo.value.memoImage ? [`${IMAGE_BASE}${memo.value.memoImage}`] : [];
    } catch (err) {
      console.error('메모 조회 실패', err);
    }
  };

  watch(
    () => props.memoProp,
    (newMemo) => {
      if (newMemo) {
        memo.value = {
          memoId: newMemo.memoId ?? null,
          memoName: newMemo.memoName ?? '',
          memoContent: newMemo.memoContent ?? '',
          memoImage: newMemo.memoImage ?? null,
          createdAt: newMemo.createdAt ?? null,
        };
        setMode('view');
        previewImages.value = memo.value.memoImage ? [`${IMAGE_BASE}${memo.value.memoImage}`] : [];
      } else {
        memo.value = { memoId: null, memoName: '', memoContent: '', memoImage: '', createdAt: null };
        clearPreviewImages();
        setMode('create');
      }
    },
    { immediate: true }
  );

  onMounted(async () => {
    if (!accountStore.state.loggedIn) {
      alert('로그인 후 이용해주세요.');
      return router.push('/account/login');
    }

    const id = route.params.id;
    if (route.name === 'MemoAdd') {
      setMode('create');
      return;
    } else if (id) {
      await fetchCurrentMemo(id);
      setMode('view');
    }
  });

  onBeforeUnmount(() => { clearPreviewImages(); });

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