import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
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
  const router = useRouter();
  const accountStore = useAccountStore();

  const diary = ref({
    diaryId: null,
    diaryName: '',
    diaryContent: '',
    createdAt: null,
    diaryImage: null,
    mood: '',
  });

  const mode = ref('view');
  const setMode = (value) => {
    mode.value = value;
  };
  const isCreateMode = computed(() => mode.value === 'create');
  const isEditMode = computed(() => mode.value === 'edit');
  const isViewMode = computed(() => mode.value === 'view');

  const previewImages = ref([]);
  const fileInputRef = ref(null);

  const isTitleValid = computed(() => diary.value.diaryName?.trim().length >= 5);
  const isContentValid = computed(() => diary.value.diaryContent?.trim().length >= 10);

  const clearForm = () => {
    diary.value = {
      diaryId: null,
      diaryName: '',
      diaryContent: '',
      createdAt: null,
      diaryImage: null,
      mood: '',
    };
    previewImages.value = [];
    fileInputRef.value && (fileInputRef.value.value = null);
  };

  const buildFormData = (dataKey, obj, fileKey, inputEl) => {
    const fd = new FormData();
    const { diaryImage, createdAt, ...rest } = obj;
    fd.append(dataKey, new Blob([JSON.stringify(rest)], { type: 'application/json' }));
    const file = inputEl?.files?.[0];
    if (file) fd.append(fileKey, file);
    return fd;
  };

  const createDiary = async (e) => {
    e?.preventDefault?.();
    if (!isTitleValid.value || !isContentValid.value) return;
    const payload = { ...diary.value, memberNoLogin: accountStore.state.memberNoLogin };
    const formData = buildFormData('diaryData', payload, 'diaryImage', fileInputRef.value);
    await DiaryHttpService.create(formData);
    emit('created');
  };
  
  const updateDiary = async (e) => {
    e?.preventDefault?.();
    if (!isTitleValid.value || !isContentValid.value) return;
    const payload = { ...diary.value, memberNoLogin: accountStore.state.memberNoLogin };
    const formData = buildFormData('diaryData', payload, 'diaryImage', fileInputRef.value);
    await DiaryHttpService.modify(formData);
    emit('updated');
  };

  const deleteDiary = async () => {
    if (diary.value.diaryId) {
      await DiaryHttpService.deleteById(diary.value.diaryId);
      emit('deleted');
    }
  };

  const cancelEdit = () => {
    emit('cancel');
  };

  const removeImage = (index) => {
    previewImages.value.splice(index, 1);
    diary.value.diaryImage = null;
    if (fileInputRef.value) {
      fileInputRef.value.value = null;
    }
  };

  const IMAGE_BASE = '/api/OTD/memoAndDiary/diary/image/';

  const setDiaryProp = (incomingDiary) => {
    if (incomingDiary) {
      diary.value = { ...incomingDiary };
      previewImages.value = incomingDiary.diaryImage ? [`${IMAGE_BASE}${incomingDiary.diaryImage}`] : [];
    }
  };
  
  watch(
    () => props.diaryProp,
    (incoming) => {
      if (incoming) {
        diary.value = {
          diaryId: incoming.diaryId ?? null,
          diaryName: incoming.diaryName ?? '',
          diaryContent: incoming.diaryContent ?? '',
          diaryImage: incoming.diaryImage ?? null,
          createdAt: incoming.createdAt ?? null,
          mood: incoming.mood ?? '',
        };
        setMode('view');
        previewImages.value = diary.value.diaryImage ? [`${IMAGE_BASE}${diary.value.diaryImage}`] : [];
      } else {
        diary.value = { diaryId: null, diaryName: '', diaryContent: '', diaryImage: '', createdAt: null };
        previewImages.value = [];
        setMode('create');
      }
    },
    { immediate: true }
  );

  const fetchDiary = async (id) => {
    try {
      const data = await DiaryHttpService.findById(id);
      diary.value = data;
      previewImages.value = diary.value.diaryImage ? [`${IMAGE_BASE}${diary.value.diaryImage}`] : [];
    } catch (error) {
      console.error('📔 다이어리 조회 실패:', error);
    }
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    previewImages.value = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImages.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  onMounted(() => {
    if (!accountStore.state.loggedIn) {
      alert('로그인 후 이용해주세요.');
      router.push('/account/login');
    }

    if (mode.value === 'edit' && diary.value.diaryId) {
      fetchDiary(diary.value.diaryId);
    }
  });

  onBeforeUnmount(() => {
    clearForm();
  });

  

  return {
    diary,
    mode,
    setMode,
    isCreateMode,
    isEditMode,
    isViewMode,
    isTitleValid,
    isContentValid,
    previewImages,
    fileInputRef,
    createDiary,
    updateDiary,
    deleteDiary,
    cancelEdit,
    clearForm,
    setDiaryProp,
    fetchDiary,
    handleImageChange,
    removeImage,
  };
}