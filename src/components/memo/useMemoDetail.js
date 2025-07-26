import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';

export function useMemoDetail(id) {
  const memo = ref({});
  const showImages = ref([]);
  const router = useRouter();

  const fetch = async () => {
    try {
      const { resultData } = await MemoHttpService.findById(id);
      memo.value = resultData;
      showImages.value = Array.isArray(resultData.imageFileNames)
        ? resultData.imageFileNames.map(f => `/pic/${f}`)
        : resultData.imageFileName
        ? [`/pic/${resultData.imageFileName}`]
        : [];
    } catch (e) {
      console.error('메모 조회 실패', e);
      router.push('/memo');
    }
  };

  return { memo, showImages, fetch };
}
