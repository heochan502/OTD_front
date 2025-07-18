<script setup>
import MemoHttpService from '@/service/MemoHttpService';
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const state = reactive({
  memo: {
    id: "0",
    title: "",
    content: "",
    createdAt: "",
    image: ""
  }
});

const isUpdateMode = route.params.id !== undefined;
const showImages = ref([]);

onMounted( async () => {
    if (isUpdateMode) {
    const id = route.params.id;
    const { resultData } = await MemoHttpService.findById(id);
    state.memo = resultData;
    if(state.memo.image) {
      showImages.value.push(state.memo.image);
    }
  }
});

const save = async() => {
    const savePayload = {
        title: state.memo.title,
        content: state.memo.content,
        image: state.memo.image,
    };

    let result;

    if (isUpdateMode) {
        result = await MemoHttpService.modify(state.memo.id, savePayload);
    } else {
        result = await MemoHttpService.create(savePayload);
    }

    if(result.resultData === 1) {
        alert(isUpdateMode ? "메모가 수정되었습니다." : "메모가 등록되었습니다.");
        router.push("/otd/memo");
    }
};

const remove = async () => {
    if(!confirm("삭제하시겠습니까?")) return;
    const result = await MemoHttpService.deleteById(state.memo.id);
    if(result.resultData === 1) {
        alert("삭제되었습니다.");
        router.push("/otd/memo");
    }
};

const handleImageChange = async (e) => {
  const files = e.target.files;
  if(!files || files.length === 0) return;

  let maximageUrlLists = 5 * 2048 * 2048; // 5MB 제한

  const validFiles = [];
  for(let i=0; i<files.length; i++) {
    const file = files[i];
    const maxSizeInBytes = 5 * 2048 * 2048; // 5MB
    if (file && file.size > maxSizeInBytes) {
      alert(`파일 "${file.name}"의 크기(${formatBytes(file.size)})가 5MB를 초과하여 업로드할 수 없습니다.`);
      continue;
    }
    validFiles.push(file);
  }

  let newImageUrlLists = [...showImages.value];

  for(let i=0; i<validFiles.length; i++) {
    const file = validFiles[i];
    const currentImageUrl = URL.createObjectURL(file);
    newImageUrlLists.push(currentImageUrl);

    const formData = new FormData();
    formData.append('image', file);

    try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if(i === 0 && data.imageUrl) {
      state.memo.image = data.imageUrl;
    }
    console.log("이미지 데이터 성공", data.imageUrl);
  } catch (error) {
    console.log("이미지 업로드 실패", error);
  }
}
  if (newImageUrlLists.length > 5) {
  newImageUrlLists = newImageUrlLists.slice(0, 5);
  }
  showImages.value = newImageUrlLists;
  e.target.value = '';
};

const removeImage = (index) => {
  showImages.value.splice(index, 1);
if (state.memo.image === showImages.value[index]) {
  state.memo.image = '';
}
};

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const fileTypeCheck = (obj) => {
  const fileName = obj.value;
  const fileExtension = fileName.substring(fineName.lastIndexOf('.') + 1).toLowerCase();
  const allowed = ['jpg', 'jpeg', 'png', 'gif'];
  if(!allowed.includes(fileExtension)) {
    allowed('jpg, jpeg, png, gif 형식의 파일만 등록 가능합니다.');
    obj.value = '';
    return false;
  }
  return true;
};

</script>

<template>
    <div class="memo-detail-container">
      <h2 class="page-title">{{ isUpdateMode ? "메모 수정" : "새 메모 작성" }}</h2>

      <div class="input-section">
      <label for="memoTitle">제목</label>
        <input type="text" id="memoTitle" class="form-control" v-model="state.memo.title" />
      </div>

      <div class="input-section">
      <label for="memoContent">내용</label>
      <textarea id="memoContent" class="form-control" rows="8" v-model="state.memo.content"></textarea>
      </div>

      <div class="input-section">
        <label for ="memoImageUpload">이미지 업로드 (최대 5장)</label>
        <input type="file" id="memoImageUpload" name="imageUpload"
               accept=".jpg, .png, .jpeg, .gif"
               class="form-control" @change="handleImageChange" multiple />
        <div class="preview-list">
      <div v-for="(img, index) in showImages" :key="index" class="preview-item">
        <img :src="img" alt="미리보기 이미지" />
        <button class="remove-btn" @click="removeImage(index)">X</button>
      </div>
    </div>
  </div>

      <div class="info-section" v-if="state.memo.createdAt">
        <strong>등록일시:</strong> {{ state.memo.createdAt }}</div>
      <button class="btn btn-primary" @click="save">
        {{ isUpdateMode ? "수정 완료" : "등록" }}</button>
  
      <button v-if="isUpdateMode" class="btn btn-danger"
        @click="remove">삭제</button>
    </div>
  </template>
  
  <style scoped>
  
  .memo-detail-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .page-title {
    font-size: 2.2rem;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    text-wrap: 700;
}

  .btn {
    background-color: skyblue;
    color: black;
    text-align: center;
    font-weight: 600;
  }
  .btn:hover {
    background-color: #a3cfd4;
    color: black;
  }
  .upload-box {
  margin: 20px 0;
}
.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.preview {
  position: relative;
}
.preview img {
  width: 100px;
  height: auto;
  border-radius: 4px;
  display: block;
}
.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  font-weight: bold;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
  </style>