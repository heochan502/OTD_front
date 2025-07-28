import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/counter.js';
import DiaryHttpService from '@/services/memo/DiaryHttpService';

export function useDiaryDetail() {
  const accountStore = useAccountStore();
  const router = useRouter();
  const route = useRoute();

  const diary = ref({
    id: null,
    diaryName: '',
    diaryContent: '',
    createdAt: null,
    diaryImage: null,
    mood: '',
    diaryDate: '',
  });

  const previewImages = ref([]);
  const fileInputRef = ref(null);
  const mode = ref('view');

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
      diaryImage: null,
      mood: '',
      diaryDate: '',
    };
    previewImages.value.forEach(url => url.startsWith('blob:') && URL.revokeObjectURL(url));
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
  };

  const fetchDiary = async (id) => {
    try {
      const { resultData } = await DiaryHttpService.findById(id);
      if (!resultData) {
        console.warn('일기 없음');
        return router.push('/diary');
      }

      diary.value = resultData;
      previewImages.value = resultData.diaryImage
        ? [`/pic/${resultData.diaryImage}`]
        : [];
    } catch (e) {
      console.error('일기 조회 실패', e);
      router.push('/diary');
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
    previewImages.value = [URL.createObjectURL(file)];
  };

  const removeImage = () => {
    if (previewImages.value[0]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImages.value[0]);
    }
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
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
    isViewMode,
    isEditMode,
    setMode,
    clearForm,
    fetchDiary,
    handleImageChange,
    removeImage,
  };
}