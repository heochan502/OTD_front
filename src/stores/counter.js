import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';


export const useAccountStore = defineStore('counter', () => {
  const state = reactive({
    checked: false,
    loggedIn: false,
  });

  // 커뮤니티에서 필요한 로그인된 유저 아이디
  const loggedInId = ref(null);

  const setChecked = (val) => (state.checked = val);

  const setLoggedIn = (val) => (state.loggedIn = val);

  //커뮤니티 게시글 유저 번호 받아오기
  const setLoggedInId = (val) => (loggedInId.value = val);

  return { state, loggedInId, setChecked, setLoggedIn, setLoggedInId };
},{    persist: true,
});
