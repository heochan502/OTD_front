import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/counter.js';
import DiaryHttpService from '@/services/memo/DiaryHttpService';

export const MOOD_OPTIONS = [
  { value: '', label: '선택' },
  { value: 'happy', label: '😊 행복' },
  { value: 'sad', label: '😢 슬픔' },
  { value: 'angry', label: '😠 화남' },
  { value: 'neutral', label: '😐 보통' },
];

export function useDiaryDetail() {
  const diary = ref({
    id: null,
    diaryName: '',
    diaryContent: '',
    createdAt: null,
    imageFileName: null,
    mood: '',
  });

  const fileInputRef = ref(null);
  const previewImages = ref([]);
  const mode = ref('view');

  const isCreateMode = computed(() => mode.value === 'create');
  const isEditMode = computed(() => mode.value === 'edit');
  const isViewMode = computed(() => mode.value === 'view');
  const imageCount = computed(() => previewImages.value.length);
  const hasNoImages = computed(() => isViewMode.value && imageCount.value === 0);

  const router = useRouter();
  const route = useRoute();
  const accountStore = useAccountStore();

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
    previewImages.value.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
  };

  const fetchDiary = async (id) => {
    try {
      const { resultData } = await DiaryHttpService.findById(id);
      if (!resultData) {
        alert('해당 일기를 불러올 수 없습니다.');
        return router.push('/memoAndDiary/diary');
      }
      diary.value = resultData;
      previewImages.value = resultData.imageFileName
        ? [`/pic/${resultData.imageFileName}`]
        : [];
    } catch (e) {
      alert('일기 조회 중 오류 발생');
      console.error(e);
      router.push('/memoAndDiary/diary');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extAllowed = ['jpg', 'jpeg', 'png', 'gif'];
    const maxSize = 5 * 1024 * 1024;
    const ext = file.name.split('.').pop().toLowerCase();

    if (!extAllowed.includes(ext)) {
      alert('허용되지 않는 파일 형식입니다.');
      return;
    }
    if (file.size > maxSize) {
      alert('파일 크기가 5MB를 초과합니다.');
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
    diary.value.imageFileName = null;
  };

  const createDiary = async () => {
    try {
      const formData = new FormData();
      formData.append(
        'diaryData',
        new Blob([JSON.stringify(diary.value)], { type: 'application/json' })
      );

      const file = fileInputRef.value?.files?.[0];
      if (file) formData.append('diaryImageFiles', file);

      const result = await DiaryHttpService.create(formData);
      alert('일기가 등록되었습니다.');
      router.push(`/memoAndDiary/diary/${result.id}`);
    } catch (e) {
      alert('일기 등록 실패');
      console.error(e);
    }
  };

  const updateDiary = async () => {
    try {
      const formData = new FormData();
      formData.append(
        'diaryData',
        new Blob([JSON.stringify(diary.value)], { type: 'application/json' })
      );

      const file = fileInputRef.value?.files?.[0];
      if (file) formData.append('diaryImageFiles', file);

      await DiaryHttpService.modify(formData);
      alert('수정 완료');
      setMode('view');
      await fetchDiary(diary.value.id);
    } catch (e) {
      alert('수정 실패');
      console.error(e);
    }
  };

  const deleteDiary = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await DiaryHttpService.deleteById(diary.value.id);
      alert('삭제 완료');
      router.push('/memoAndDiary/diary');
    } catch (e) {
      alert('삭제 실패');
      console.error(e);
    }
  };

  const cancelEdit = async () => {
    if (diary.value.id) {
      setMode('view');
      await fetchDiary(diary.value.id);
    } else {
      router.push('/memoAndDiary/diary');
    }
  };

  onMounted(async () => {
    if (!accountStore.state.loggedIn) {
      alert('로그인 후 이용해주세요.');
      return router.push('/account/login');
    }

    const id = route.params.id;
    if (id && id !== 'create') {
      setMode('view');
      await fetchDiary(id);
    } else {
      setMode('create');
    }
  });

  return {
    diary,
    previewImages,
    fileInputRef,
    mode,
    isCreateMode,
    isEditMode,
    isViewMode,
    setMode,
    clearForm,
    fetchDiary,
    handleImageChange,
    removeImage,
    hasNoImages,
    imageCount,
    createDiary,
    updateDiary,
    deleteDiary,
    cancelEdit,
    MOOD_OPTIONS,
  };
}