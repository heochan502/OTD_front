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
  const accountStore = useAccountStore();
  const router = useRouter();
  const route = useRoute();

  const diary = ref({
    diaryId: null,
    diaryName: '',
    diaryContent: '',
    diaryImage: '',
    createdAt: null,
    mood: '',
  });


  const previewImages = ref([]);
  const fileInputRef = ref(null);
  const mode = ref('view');

  const IMAGE_BASE = '/api/OTD/memoAndDiary/diary/image/';
  const imageUrl = computed(() => diary.value.diaryImage ? `${IMAGE_BASE}${diary.value.diaryImage}` : '');

  const isCreateMode = computed(() => mode.value === 'create');
  const isEditMode = computed(() => mode.value === 'edit');
  const isViewMode = computed(() => mode.value === 'view');
  
  const isTitleValid = computed(() => diary.value.diaryName?.trim().length >= 5);
  const isContentValid = computed(() => diary.value.diaryContent?.trim().length >= 10);
  const isMoodValid = computed(() => !!diary.value.mood);

  const setMode = (value) => { mode.value = value; };

  const clearPreviewImages = () => {
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = null;
  };
  

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
    diary.value.diaryImage = null;
  };

  const buildFormData = (jsonKey, jsonObj, fileKey, inputEl) => {
    const fd = new FormData();
    fd.append(jsonKey, new Blob([JSON.stringify(jsonObj)], { type: 'application/json' }));
    const file = inputEl?.files?.[0];
    if (file) fd.append(fileKey, file);
    return fd;
  };

  const createDiary = async () => {
    try {
    if (!isTitleValid.value || !isContentValid.value || !isMoodValid.value) return;
    const payload = { ...diary.value, memberNoLogin: accountStore.state.memberNoLogin };
    const formData = buildFormData('diaryData', payload, 'diaryImage', fileInputRef.value);
    await DiaryHttpService.create(formData);
    emit('created');
    clearPreviewImages();
    } catch (e) {
      console.error('다이어리 등록 실패', e);
    }
  };
  
  const updateDiary = async (e) => {
    try {
    if (!isTitleValid.value || !isContentValid.value || !isMoodValid.value) return;
    const payload = { ...diary.value, memberNoLogin: accountStore.state.memberNoLogin };
    const formData = buildFormData('diaryData', payload, 'diaryImage', fileInputRef.value);
    await DiaryHttpService.modify(formData);
    emit('updated');
    setMode('view');
    clearPreviewImages();
    } catch (e) {
      console.error('다이어리 수정 실패', e);
    }
  };

  const deleteDiary = async () => {
    try {
    if (confirm('정말 삭제하시겠습니까?')) {
      await DiaryHttpService.deleteById(diary.value.diaryId);
      emit('deleted');
    }
  } catch (e) {
    console.error('다이어리 삭제 실패', e);
  }
  };

  const cancelEdit = () => { emit('cancel'); };

  const fetchCurrentDiary = async (id) => {
    try {
      const data = await DiaryHttpService.findById(id);
      diary.value = {
        diaryId: data.diaryId ?? null,
        diaryName: data.diaryName ?? '',
        diaryContent: data.diaryContent ?? '',
        diaryImage: data.diaryImage ?? null,
        createdAt: data.createdAt ?? null,
        mood: data.mood ?? '',
      };
      previewImages.value = diary.value.diaryImage ? [`${IMAGE_BASE}${diary.value.diaryImage}`] : [];
    } catch (e) {
      console.error('📔 다이어리 조회 실패:', e);
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
        diary.value = { diaryId: null, diaryName: '', diaryContent: '', diaryImage: '', createdAt: null, mood: '' };
        previewImages.value = [];
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
    if (route.name === 'DiaryAdd') {
      setMode('create');
      return;
    } else if (id) {
      await fetchCurrentDiary(id);
      setMode('view');
    }
  });

  onBeforeUnmount(() => { clearPreviewImages(); });

  return {
    diary,
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
    createDiary,
    updateDiary,
    deleteDiary,
    cancelEdit,
    clearPreviewImages,
  };
}