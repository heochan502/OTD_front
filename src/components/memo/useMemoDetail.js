import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';

export function useMemoDetail(id) {
  const memo = ref({
    id: null,
    title: '',
    content: '',
    createdAt: null,
    imageFileName: null,
    imageFileNames: [],
  });

  const showImages = ref([]);
  const router = useRouter();

  const fetch = async () => {
    try {
      const res = await MemoHttpService.findById(id);
      const resultData = res?.resultData;
      
      if (!resultData) {
        console.warn('조회된 메모 데이터 없음');
        return router.push('/memo');
      }

      memo.value = resultData;

      if (Array.isArray(resultData.imageFileNames)) {
        showImages.value = resultData.imageFileNames.map(f => `/pic/${f}`);
      } else if (resultData.imageFileName) {
        showImages.value = [`/pic/${resultData.imageFileName}`];
      } else {
        showImages.value = [];
      }

    } catch (e) {
      console.error('메모 조회 실패', e);
      router.push('/memo');
    }
  };

  return { memo, showImages, fetch };
}