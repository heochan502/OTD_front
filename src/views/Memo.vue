<script setup>
import MemoHttpService from '@/service/MemoHttpService';
import { reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const Route = useRoute();
const Router = useRouter();

const state = reactive({
  memo: {
    id: "0",
    title: "",
    content: "",
    createdAt: "",
    image: ""
  }
});

onMounted ( () => {
  const passData = history.state.data;
  if(passData) {
    state.memo. JSON.parse(passData);
  }
});

const procSubmit = async () => {
  const jsonBody = {
    title: state.memo.title,
    content: state.memo.content,
  };
  let data = null;
  let path = "/";
  if(state.memo.id) {
    path = `/otd/memo/${state.memo.id}`;
    jsonBody.id = state.memo.id;
    data = await MemoHttpService.modify(jsonBody);
  } else {
    data = await MemoHttpService.save(JsonBody);
  }

  if(data.resultData === 1) {
    router.push({path});
  } else {
    alert(data.resultMessage);
  }
};
</script>

<template>
  <form class="detail" @submit.prevent="submit">
    <div class="mb-3" v-if="state.memo.createdAt">
      등록일시: {{ state.memo.createdAt }}
    </div>
    <div class="mb-3">
      <label for="title" class="form-label">제목</label>
      <input type="text" maxlength="50" id="title" class="form-control p-3"
             v-model="state.memo.title" />
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">내용</label>
      <input id="content" maxlength="300" class="form-control p-3"
             v-model="state.memo.content" />
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">이미지</label>
      <textarea id="image" class="form-control p-3"
             v-model="state.memo.image"></textarea>
    </div>
    <button type="submit" class="btn bg-black btn-primary w-20 py-3" style="border: none;">
      {{ state.memo.id > 0 ? "수정" : "저장" }}
    </button>
  </form>
</template>

<style scoped>
.mb-3 {
color: black;
font-weight: bold;
margin-left: 10px;
margin-right: 10px;
}
</style>