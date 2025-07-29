import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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
  const mode = ref('view');
  const route = useRoute();
  const router = useRouter();
  const accountStore = useAccountStore();

  const isCreateMode = computed(() => mode.value === 'create');
  const isViewMode = computed(() => mode.value === 'view');
  const isEditMode = computed(() => mode.value === 'edit');
  const hasNoImages = computed(() => isViewMode.value && previewImages.value.length === 0);

  const setMode = (newMode) => (mode.value = newMode);

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
    const maxSize = 5 * 1024 * 1024;
    const ext = file.name.split('.').pop().toLowerCase();

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
    if (!diary.value.diaryName || !diary.value.diaryContent) {
      alert('제목과 내용을 모두 입력해주세요!');
      return;
    }

    try {
      const file = fileInputRef.value?.files?.[0];
      const formData = new FormData();

      formData.append(
        'diaryData',
        new Blob(
          [JSON.stringify({
            diaryName: diary.value.diaryName,
            diaryContent: diary.value.diaryContent,
            mood: diary.value.mood,
          })],
          { type: 'application/json' }
        )
      );

      if (file) formData.append('diaryImageFiles', file);

      const result = await DiaryHttpService.create(formData);
      alert('일기가 등록되었습니다.');
      clearPreviewImages();
      router.push('/memoAndDiary/diarylist');
    } catch (err) {
      alert('등록 실패');
      console.error(err);
    }
  };

  const updateDiary = async () => {
    try {
      const file = fileInputRef.value?.files?.[0];
      const formData = new FormData();

      formData.append(
        'diaryData',
        new Blob(
          [JSON.stringify({
            id: diary.value.id,
            diaryName: diary.value.diaryName,
            diaryContent: diary.value.diaryContent,
            mood: diary.value.mood,
            imageFileName: diary.value.imageFileName,
          })],
          { type: 'application/json' }
        )
      );

      if (file) formData.append('diaryImageFiles', file);

      await DiaryHttpService.modify(formData);
      alert('수정 완료');
      setMode('view');
      await fetchDiary(diary.value.id);
    } catch (err) {
      alert('수정 실패');
      console.error(err);
    }
  };

  const deleteDiary = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await DiaryHttpService.deleteById(diary.value.id);
      alert('삭제 완료');
      router.push('/memoAndDiary/diarylist');
    } catch (err) {
      alert('삭제 실패');
      console.error(err);
    }
  };

  const cancelEdit = async () => {
    if (diary.value.id) {
      setMode('view');
      await fetchDiary(diary.value.id);
    } else {
      router.push('/memoAndDiary/diarylist');
    }
  };

  const fetchDiary = async (id) => {
    try {
      const result = await DiaryHttpService.findById(id); // ✅ 수정된 부분
      if (!result) {
        alert('해당 일기를 불러올 수 없습니다.');
        return router.push('/memoAndDiary/diary');
      }
      diary.value = result;
      previewImages.value = result.imageFileName
        ? [`/pic/${result.imageFileName}`]
        : [];
    } catch (err) {
      alert('일기 조회 중 오류 발생');
      console.error(err);
      router.push('/memoAndDiary/diary');
    }
  };

  onMounted(async () => {
    const id = route.params.id;
    if (id && id !== 'create') {
      setMode('view');
      await fetchDiary(id);
    } else {
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