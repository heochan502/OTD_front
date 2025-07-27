import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';

export function useMemoDetail(id) {
  const memo = ref({
    id: null,
    memoName: '',
    memoContent: '',
    createdAt: null,
    imageFileName: null,
  });

  const showImages = ref([]);
  const router = useRouter();

  const fetch = async () => {
    try {
      const res = await MemoHttpService.findById(id);
      const resultData = res?.resultData;

      if (!resultData) {
        console.warn('조회된 메모 없음');
        return router.push('/memo');
      }

      memo.value = resultData;

      // 단일 이미지 처리
      if (resultData.imageFileName) {
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