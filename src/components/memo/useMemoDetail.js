import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';

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
  const router = useRouter();
  const mode = ref('view');

  const isCreateMode = computed(() => mode.value === 'create');
  const isViewMode = computed(() => mode.value === 'view');
  const isEditMode = computed(() => mode.value === 'edit');

  const setMode = (newMode) => {
    mode.value = newMode;
  };

  const clearForm = () => {
    memo.value = {
      id: null,
      memoName: '',
      memoContent: '',
      createdAt: null,
      imageFileName: null,
    };
    previewImages.value.forEach((url) => url.startsWith('blob:') && URL.revokeObjectURL(url));
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
  };

  const fetchMemo = async (id) => {
    try {
      const { resultData } = await MemoHttpService.findById(id);
      if (!resultData) {
        console.warn('조회된 메모 없음');
        return router.push('/memo');
      }

      memo.value = resultData;
      if (resultData.imageFileName) {
        previewImages.value = [`/pic/${resultData.imageFileName}`];
      } else {
        previewImages.value = [];
      }
    } catch (e) {
      console.error('메모 조회 실패', e);
      router.push('/memo');
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const file = files[0];
    if (!file) return;

    const extAllowed = ['jpg', 'jpeg', 'png', 'gif'];
    const maxSize = 5 * 1024 * 1024;
    const ext = file.name.split('.').pop().toLowerCase();

    if (!extAllowed.includes(ext)) return alert('허용되지 않는 파일 형식입니다.');
    if (file.size > maxSize) return alert('파일 크기가 5MB를 초과합니다.');

    previewImages.value.forEach(url => url.startsWith('blob:') && URL.revokeObjectURL(url));
    const previewUrl = URL.createObjectURL(file);
    previewImages.value = [previewUrl];
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
  };
}