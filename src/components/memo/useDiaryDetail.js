import { ref, computed } from 'vue';
import DiaryService from '@/services/memo/DiaryHttpService.js';

export function useDiaryDetail() {
  const diary = ref({
    id: null,
    title: '',
    content: '',
    mood: '',
    date: '',
    images: [],
  });

  const previewImages = ref([]);
  const fileInputRef = ref(null);

  const mode = ref('view'); // 'create' | 'view' | 'edit'

  const isCreateMode = computed(() => mode.value === 'create');
  const isViewMode = computed(() => mode.value === 'view');
  const isEditMode = computed(() => mode.value === 'edit');

  const setMode = (newMode) => {
    mode.value = newMode;
  };

  const clearForm = () => {
    diary.value = { id: null, title: '', content: '', mood: '', date: '', images: [] };
    previewImages.value.forEach(url => url.startsWith('blob:') && URL.revokeObjectURL(url));
    previewImages.value = [];
    if (fileInputRef.value) fileInputRef.value.value = '';
  };

  const fetchDiary = async (id) => {
    const { resultData } = await DiaryService.findById(id);
    diary.value = { ...resultData, images: [] };
    if (resultData.imageFileNames) {
      previewImages.value = resultData.imageFileNames.map(name => `/pic/${name}`);
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024;
    const extAllowed = ['jpg', 'jpeg', 'png', 'gif'];

    const previewUrls = new Set(previewImages.value);
    const uploadedFileKeys = new Set(previewImages.value.map(url => url.split('/').pop()));

    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (previewImages.value.length >= 5) return alert('이미지는 최대 5장까지 업로드할 수 있습니다.');
      if (!extAllowed.includes(ext)) return alert(`${file.name}: 허용되지 않는 형식입니다.`);
      if (file.size > maxSize) return alert(`${file.name}: 5MB를 초과합니다.`);

      const fileKey = file.name + '_' + file.lastModified;
      if (uploadedFileKeys.has(fileKey)) return alert(`${file.name}: 중복된 파일입니다.`);

      const previewUrl = URL.createObjectURL(file);
      if (previewUrls.has(previewUrl)) return alert(`${file.name}: 동일한 파일이 이미 업로드됨`);

      previewImages.value.push(previewUrl);
      uploadedFileKeys.add(fileKey);
      previewUrls.add(previewUrl);
    });
  };

  const removeImage = (index) => {
    const url = previewImages.value[index];
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    previewImages.value.splice(index, 1);
  };

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