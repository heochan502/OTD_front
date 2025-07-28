import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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

  const previewImages = ref([]);
  const fileInputRef = ref(null);
  const mode = ref('view');

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
        alert('해당 메모를 찾을 수 없습니다.');
        return;
      }

      memo.value = resultData;

      previewImages.value = resultData.imageFileName
        ? [`/pic/${resultData.imageFileName}`]
        : [];
    } catch (e) {
      console.error('메모 조회 실패:', e);
      alert('메모 조회 중 오류 발생');
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const file = files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'gif'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowed.includes(ext)) {
      alert('이미지 파일(jpg, png, gif)만 업로드 가능합니다.');
      return;
    }
    if (file.size > maxSize) {
      alert('5MB 이하 파일만 업로드 가능합니다.');
      return;
    }

    previewImages.value.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    previewImages.value = [URL.createObjectURL(file)];
  };

  const removeImage = () => {
    if (previewImages.value[0]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImages.value[0]);
    }
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
  };

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