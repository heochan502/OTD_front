<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProfile } from '@/services/accountService';

const route = useRoute();

const state = reactive({
  form: {
    memberNoLogin: 0,
    memberId: '',
    email: '',
    name: '',
    birthDate: '',
    memberNick: '',
  },
});

onMounted(async () => {
  const memid = route.params.memberNoLogin;
  const res = await getProfile(memid);
  if (res === undefined || res.status !== 200) {
    alert('오류 발생');
    return;
  }
  Object.assign(state.form, res.data);
});
</script>

<template>
  <div>
    <h2 class="title">회원정보</h2>
    <table class="table">
      <tbody>
        <tr>
          <th>프로필 사진</th>
          <td>
            <img
              :src="state.form.profileImage || '/default-avatar.png'"
              alt="프로필"
              width="80"
            />
          </td>
        </tr>
        <tr>
          <th>아이디</th>
          <td>{{ state.form.memberId }}</td>
        </tr>
        <tr>
          <th>이메일</th>
          <td>{{ state.form.email }}</td>
        </tr>
        <tr>
          <th>이름</th>
          <td>{{ state.form.name }}</td>
        </tr>
        <tr>
          <th>생년월일</th>
          <td>{{ state.form.birthDate }}</td>
        </tr>
        <tr>
          <th>닉네임</th>
          <td>
            {{ state.form.memberNick }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
