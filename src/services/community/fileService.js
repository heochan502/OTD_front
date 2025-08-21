// 역할:
// - 이미지/용량 간단 검증
// - FormData 생성 (키 이름 'files' 유지: 백엔드 DTO MultipartFile[] files 와 매핑)
// - communityService.createPost(FormData) 호출

import { createPost } from './communityService';

const BYTES_MB = 1024 * 1024;

/**
 * 파일 검증
 * - 이미지 파일만 허용
 * - 파일당 최대 perFileMB MB
 * - 전체 합계 최대 totalMB MB
 */
export function validateFiles(files, perFileMB = 10, totalMB = 30) {
  const perLimit = perFileMB * BYTES_MB;
  const totalLimit = totalMB * BYTES_MB;

  let sum = 0;
  for (const f of files) {
    if (!f.type?.startsWith('image/')) {
      return { ok: false, msg: '이미지 파일만 업로드할 수 있습니다.' };
    }
    if (f.size > perLimit) {
      return { ok: false, msg: `파일당 최대 ${perFileMB}MB까지 가능합니다: ${f.name}` };
    }
    sum += f.size;
    if (sum > totalLimit) {
      return { ok: false, msg: `총 업로드 용량은 ${totalMB}MB를 초과할 수 없습니다.` };
    }
  }
  return { ok: true, msg: '' };
}

/** 게시글 작성용 FormData 생성 */
export function buildPostForm({ title, content, files = [] }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('content', content);
  // ⚠️ 키 이름은 반드시 'files' (백엔드 DTO: MultipartFile[] files)
  for (const f of files) fd.append('files', f);
  return fd;
}

/**
 * 업로드 호출 (필요 최소만)
 * - 진행률은 최소 수정 원칙 때문에 넣지 않음
 */
export function uploadPost({ title, content, files = [] }) {
  const { ok, msg } = validateFiles(files);
  if (!ok) return Promise.reject(new Error(msg));

  const formData = buildPostForm({ title, content, files });
  return createPost(formData);
}
