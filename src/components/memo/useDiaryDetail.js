import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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

export function useDiaryDetail(emit) {
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

  const mode = ref('create');
  const setMode = (value) => {
    mode.value = value;
  };
  const isCreateMode = computed(() => mode.value === 'create');
  const isEditMode = computed(() => mode.value === 'edit');

  const previewImages = ref([]);
  const fileInputRef = ref(null);

  const isTitleValid = computed(() => diary.value.diaryName?.trim().length > 0);
  const isContentValid = computed(() => diary.value.diaryContent?.trim().length > 0);

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

  const createDiary = async (e) => {
    e.preventDefault();
    if (!isTitleValid.value || !isContentValid.value) return;

    const formData = new FormData();
    const diaryData = { ...diary.value, memberNoLogin: accountStore.state.memberNoLogin };
    formData.append('diaryData', new Blob([JSON.stringify(diaryData)], { type: 'application/json' }));
    
    const files = fileInputRef.value?.files;
    if (files?.length) {
      formData.append('diaryImage', files[0]);
    }
    await DiaryHttpService.create(formData);
    emit('created');
  };

  const updateDiary = async (e) => {
    e.preventDefault();
    if (!isTitleValid.value || !isContentValid.value) return;

    const formData = new FormData();
    const diaryData = { ...diary.value, memberNoLogin: accountStore.state.memberNoLogin };
    formData.append('diaryData', new Blob([JSON.stringify(diaryData)], { type: 'application/json' }));
    const files = fileInputRef.value?.files;
    if (files?.length) formData.append('diaryImage', files[0]);

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

  const setDiaryProp = (incomingDiary) => {
    if (incomingDiary) {
      diary.value = { ...incomingDiary };
      previewImages.value = incomingDiary.diaryImage ? [`/pic/${incomingDiary.diaryImage}`] : [];
    }
  };

  const fetchDiary = async (id) => {
    try {
      const data = await DiaryHttpService.findById(id);
      diary.value = data;
      previewImages.value = data.diaryImage ? [`/pic/${data.diaryImage}`] : [];
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
    // diary.value.diaryImage = files[0].name;
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
    isTitleValid,
    isContentValid,
    previewImages,
    fileInputRef,
    createDiary,
    updateDiary,
    deleteDiary,
    cancelEdit,
    removeImage,
    clearForm,
    setDiaryProp,
    fetchDiary,
    handleImageChange,
    removeImage,
  };
}