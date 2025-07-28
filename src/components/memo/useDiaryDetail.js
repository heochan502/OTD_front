import { ref, computed } from 'vue';
import DiaryHttpService from '@/services/memo/DiaryHttpService';

export function useDiaryDetail() {
  const diary = ref({
    id: null,
    diaryName: '',
    diaryContent: '',
    createdAt: null,
    imageFileName: null,
    mood: '',
  });

  const previewImages = ref([]);
  const fileInputRef = ref(null);
  const mode = ref('view'); // 'create', 'view', 'edit'

  const isCreateMode = computed(() => mode.value === 'create');
  const isViewMode = computed(() => mode.value === 'view');
  const isEditMode = computed(() => mode.value === 'edit');

  const setMode = (newMode) => (mode.value = newMode);

  const clearForm = () => {
    diary.value = {
      id: null,
      diaryName: '',
      diaryContent: '',
      createdAt: null,
      imageFileName: null,
      mood: '',
    };
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = null;
  };

  const fetchDiary = async (id) => {
    const result = await DiaryHttpService.findById(id);
    diary.value = result;

    previewImages.value = [];
    if (result.imageFileName) {
      previewImages.value.push(`/pic/${result.imageFileName}`);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      fileInputRef.value.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      previewImages.value = [event.target.result];
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = null;
    diary.value.imageFileName = null;
  };

  const hasNoImages = computed(() => previewImages.value.length === 0);
  const imageCount = computed(() => previewImages.value.length);

  return {
    diary,
    previewImages,
    fileInputRef,
    mode,
    isCreateMode,
    isViewMode,
    isEditMode,
    setMode,
    clearForm,
    fetchDiary,
    handleImageChange,
    removeImage,
    hasNoImages,
    imageCount,
  };
}