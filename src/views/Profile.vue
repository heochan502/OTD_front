<script setup>
import { reactive, onMounted } from 'vue';

import { useRouter } from 'vue-router';
import { getProfile } from '@/services/accountService';
import { useAccountStore } from '@/stores/counter';

const router = useRouter();
const counter = useAccountStore();


const state = reactive({
  form: {
    memberNoLogin: 0,
    memberId: '',
    email: '',
    name: '',
    birthDate: '',
    memberNick: '',
  },

  loading: true,
  error: null
});


const formatBirthDate = (birthDate) => {
  if (!birthDate || birthDate.length !== 8) return birthDate;
  return `${birthDate.slice(0, 4)}년 ${birthDate.slice(4, 6)}월 ${birthDate.substring(6, 8)}일`;
};

onMounted(async () => {
  if (!counter.state.loggedIn) {
    //alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }

  try {
    const res = await getProfile();
    
    if (res === undefined || res.status !== 200) {
      state.error = '프로필 정보를 불러오는데 실패했습니다.';
      return;
    }
    
    Object.assign(state.form, res.data);
  } catch (error) {
    state.error = '오류가 발생했습니다.';
    console.error('Profile loading error:', error);
  } finally {
    state.loading = false;
  }
});

</script>

<template>
  <div class="profile-container">
    <h2 class="title">회원정보</h2>
    
    <div v-if="state.loading" class="loading">
      로딩 중...
    </div>
    
    <div v-else-if="state.error" class="error">
      {{ state.error }}
    </div>
    
    <div v-else class="profile-content">
      <table class="profile-table">
        <tbody>
          <tr>
            <th>프로필 사진</th>
            <td>
              <div class="profile-image">
                <img
                  :src="state.form.profileImage || '/default-avatar.png'"
                  alt="프로필"
                  @error="(e) => e.target.src = '/default-avatar.png'"
                />
              </div>
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
            <td>{{ formatBirthDate(state.form.birthDate) }}</td>
          </tr>
          <tr>
            <th>닉네임</th>
            <td>{{ state.form.memberNick }}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="button-group">
         <router-link to="/detail" class="btn-edit">정보 수정</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

.profile-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Noto Sans KR', sans-serif;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error {
  color: #f44336;
}

.profile-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-table {
  width: 100%;
  border-collapse: collapse;
}

.profile-table th,
.profile-table td {
  padding: 20px 30px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.profile-table th {
  background-color: #f8f9fa;
  font-weight: 500;
  color: #666;
  width: 150px;
}

.profile-table td {
  color: #333;
  font-size: 16px;
}

.profile-table tr:last-child th,
.profile-table tr:last-child td {
  border-bottom: none;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f0f0f0;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.button-group {
  padding: 30px;
  text-align: center;
  background-color: #f8f9fa;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-edit{
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: #2a9df4;
  color: white;
}

.btn-edit:hover {
  background-color: #1c7fd1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(42, 157, 244, 0.3);
}

.btn-back {
  background-color: #e0e0e0;
  color: #666;
}

.btn-back:hover {
  background-color: #d0d0d0;
  transform: translateY(-1px);
}


@media (max-width: 600px) {
  .profile-table th,
  .profile-table td {
    padding: 15px 20px;
  }
  
  .profile-table th {
    width: 120px;
  }
  
  .button-group {
    flex-direction: column;
    padding: 20px;
  }
  
  .btn-edit, .btn-back {
    width: 100%;
  }
}
</style>