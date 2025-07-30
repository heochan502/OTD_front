import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
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

export function useDiaryDetail(props, emit) {
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
    diary.value.imageFileName = null;
  };

  const createDiary = async () => {
    try {
      const formData = new FormData();
      formData.append('diaryData', new Blob([JSON.stringify(diary.value)], { type: 'application/json' }));
      const file = fileInputRef.value?.files?.[0];
      if (file) {
        formData.append('diaryImageFiles', file);
      }

      await DiaryHttpService.create(formData);
      alert('다이어리가 등록되었습니다.');
      emit('created');
      diary.value = {
        id: null,
        diaryName: '',
        diaryContent: '',
        createdAt: null,
        imageFileName: null,
        mood: '',
      };
      clearPreviewImages();
    } catch (e) {
      alert('등록 실패');
      console.error('등록 오류:', e);
    }
  };

  const updateDiary = async () => {
    try {
      const file = fileInputRef.value?.files?.[0];
      const formData = new FormData();

      const diaryData = {
        id: diary.value.id,
        diaryName: diary.value.diaryName,
        diaryContent: diary.value.diaryContent,
        mood: diary.value.mood,
        imageFileName: diary.value.imageFileName,
      };

      formData.append('diaryData', new Blob([JSON.stringify(diaryData)], { type: 'application/json' }));
      if (file) formData.append('diaryImageFiles', file);

      await DiaryHttpService.modify(formData);
      alert('수정 완료');
      setMode('view');
      await fetchDiary(diary.value.id);
      emit('updated');
    } catch (err) {
      alert('수정 실패');
    }
  };

  const deleteDiary = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await DiaryHttpService.deleteById(diary.value.id);
      alert('삭제 완료');
      emit('deleted');
      router.push('/memoAndDiary/diary/list');
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const cancelEdit = async () => {
    if (diary.value.id) {
      setMode('view');
      await fetchDiary(diary.value.id);
    } else {
      emit('cancel');
      router.push('/memoAndDiary/diary/list');
    }
  };

  const fetchDiary = async (id) => {
    try {
      const result = await DiaryHttpService.findById(id);
      if (!result) {
        return router.push('/memoAndDiary/diary/list');
      }
      diary.value = result;
      previewImages.value = result.imageFileName ? [`/pic/${result.imageFileName}`] : [];
    } catch (err) {
      alert('일기 조회 실패');
      router.push('/memoAndDiary/diary/list');
    }
  };

  watch(
    () => props?.diaryProp,
    (newVal) => {
      if (newVal) {
        diary.value = { ...newVal };
        previewImages.value = newVal.imageFileName ? [`/pic/${newVal.imageFileName}`] : [];
        setMode('view');
      }
    },
    { immediate: true }
  );

  onMounted(async () => {
    const id = route.params.id;
    if (!props?.diaryProp && id && id !== 'create') {
      setMode('view');
      await fetchDiary(id);
    } else if (!props?.diaryProp) {
      setMode('create');
    }
  });

  onBeforeUnmount(() => {
    clearPreviewImages();
  });

  return {
    diary,
    previewImages,
    fileInputRef,
    isCreateMode,
    isViewMode,
    isEditMode,
    hasNoImages,
    MOOD_OPTIONS,
    setMode,
    handleImageChange,
    removeImage,
    createDiary,
    updateDiary,
    deleteDiary,
    cancelEdit,
  };
}