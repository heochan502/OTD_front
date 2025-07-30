import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DiaryHttpService from '@/services/memo/DiaryHttpService';
import { useAccountStore } from '@/stores/counter';

export const MOOD_OPTIONS = [
  { value: '', label: '선택' },
  { value: 'happy', label: '😊 행복' },
  { value: 'sad', label: '😢 슬픔' },
  { value: 'angry', label: '😠 화남' },
  { value: 'neutral', label: '😐 보통' },
];

export function useDiaryDetail(emit) {
  const router = useRouter();
  const route = useRoute();
  const accountStore = useAccountStore();

  const mode = ref('create');
  const diary = ref({
    id: null,
    diaryName: '',
    diaryContent: '',
    mood: '',
    imageFileName: null,
    createdAt: null,
  });

  const previewImages = ref([]);
  const fileInputRef = ref(null);
  const isCreateMode = computed(() => mode.value === 'create');
  const isEditMode = computed(() => mode.value === 'edit');
  const isViewMode = computed(() => mode.value === 'view');
  const isTitleValid = computed(() => diary.value.diaryName.trim().length >= 1);
  const isContentValid = computed(() => diary.value.diaryContent.trim().length >= 10);

  const setMode = (newMode) => {
    mode.value = newMode;
  };

  const clearForm = () => {
    diary.value = {
      id: null,
      diaryName: '',
      diaryContent: '',
      mood: '',
      imageFileName: null,
      createdAt: null,
    };
    clearPreviewImages();
  };

  const determineMode = () => {
    const path = route.path;
    if (path.includes('/edit')) {
      mode.value = 'edit';
    } else if (path.includes('/add')) {
      mode.value = 'create';
    } else {
      mode.value = 'view';
    }
  };

  const fetchDiary = async (id) => {
    try {
      const data = await DiaryHttpService.findById(id);
      diary.value = data;
      if (data.imageFileName) {
        previewImages.value = [`/pic/${data.imageFileName}`];
      }
    } catch (err) {
      console.error('다이어리 조회 실패:', err);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      clearPreviewImages();
      previewImages.value = Array.from(files).map((file) => URL.createObjectURL(file));
    }
  };

  const clearPreviewImages = () => {
    previewImages.value.forEach((url) => URL.revokeObjectURL(url));
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = null;
  };

  const createDiary = async () => {
    const formData = new FormData();
    formData.append('diaryName', diary.value.diaryName);
    formData.append('diaryContent', diary.value.diaryContent);
    formData.append('mood', diary.value.mood);
    formData.append('memberNoLogin', accountStore.loggedInId);
    if (fileInputRef.value?.files?.[0]) {
      formData.append('diaryImageFiles', fileInputRef.value.files[0]);
    }

    try {
      const res = await DiaryHttpService.create(formData);
      emit('created', res);
      clearPreviewImages();
      clearForm();
    } catch (err) {
      console.error('🛑 다이어리 등록 실패:', err);
    }
  };

  const updateDiary = async () => {
    const formData = new FormData();
    formData.append('id', diary.value.id);
    formData.append('diaryName', diary.value.diaryName);
    formData.append('diaryContent', diary.value.diaryContent);
    formData.append('mood', diary.value.mood);
    formData.append('memberNoLogin', accountStore.loggedInId);
    if (fileInputRef.value?.files?.[0]) {
      formData.append('diaryImageFiles', fileInputRef.value.files[0]);
    }

    try {
      const res = await DiaryHttpService.modify(formData);
      emit('updated', res);
      clearPreviewImages();
    } catch (err) {
      console.error('🛑 다이어리 수정 실패:', err);
    }
  };

  const deleteDiary = async () => {
    try {
      await DiaryHttpService.delete(diary.value.id);
      emit('deleted', diary.value.id);
    } catch (err) {
      console.error('🛑 다이어리 삭제 실패:', err);
    }
  };

  const cancelEdit = () => {
    emit('cancel');
  };

  onMounted(() => {
    determineMode();
    if (route.params.id) {
      fetchDiary(route.params.id);
    }
  });

  onBeforeUnmount(() => {
    clearPreviewImages();
  });

  return {
    mode,
    isCreateMode,
    isEditMode,
    isViewMode,
    diary,
    previewImages,
    fileInputRef,
    MOOD_OPTIONS,
    createDiary,
    updateDiary,
    deleteDiary,
    cancelEdit,
    handleFileChange,
    clearPreviewImages,
    isTitleValid,
    isContentValid,
    setMode,
    clearForm,
  };
}