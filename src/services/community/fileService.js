import axios from 'axios';

// 파일 업로드 (formData로 사용해야 함)
export const uploadFile = (formData) => {
  return axios.post('/community/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 파일 다운로드 (filePath는 저장된 상대 경로 또는 파일명)
export const downloadFile = (filePath) => {
  return axios
    .get('/community/file/download', {
      params: { path: filePath },
      responseType: 'blob', // binary 파일로 받기
    })
    .then((response) => {
      // 브라우저에서 다운로드 처리
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = decodeURIComponent(filePath.split('/').pop()); // 파일명 추출
      link.click();
      window.URL.revokeObjectURL(url);
    });
};
