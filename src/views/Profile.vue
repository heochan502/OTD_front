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
    profileImage: ''
  },
  loading: true,
  error: null
});

const formatBirthDate = (birthDate) => {
  if (!birthDate || birthDate.length !== 8) return birthDate;
  return `${birthDate.slice(0, 4)}년 ${birthDate.slice(4, 6)}월 ${birthDate.substring(6, 8)}일`;
};

const handleImageError = (e) => {
  state.form.profileImage = '';
};

onMounted(async () => {
  if (!counter.state.loggedIn) {
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
  <div class="page-wrapper">
    <div class="container">
      <div class="header">
        <h1>회원정보</h1>
      </div>

      <div class="content-container">
        <div v-if="state.loading" class="loading-wrapper">
          <div class="loading-spinner"></div>
          <p>정보를 불러오는 중...</p>
        </div>
        

        <div v-else class="profile-content">
          <div class="profile-photo-section">
            <div class="photo-wrapper">
              <div v-if="state.form.profileImage" class="profile-img-container">
                <img 
                  :src="state.form.profileImage" 
                  alt="프로필 사진" 
                  class="profile-img"
                  @error="handleImageError"
                >
              </div>
              <div v-else class="profile-img default-avatar">
                <span>{{ (state.form.name || '사용자').charAt(0) }}</span>
              </div>
            </div>
            <div class="user-info">
              <h2>{{ state.form.name || '사용자명 없음' }}</h2>
              <p>@{{ state.form.memberNick || state.form.memberId || '닉네임 없음' }}</p>
            </div>
          </div>

          <div class="info-cards">
            <div class="info-card">
              <div class="card-header">
                <h3>기본 정보</h3>
              </div>
              <div class="card-content">
                <div class="info-item">
                  <span class="label">아이디</span>
                  <span class="value">{{ state.form.memberId }}</span>
                </div>
                <div class="info-item">
                  <span class="label">이메일</span>
                  <span class="value">{{ state.form.email }}</span>
                </div>
                <div class="info-item">
                  <span class="label">이름</span>
                  <span class="value">{{ state.form.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">닉네임</span>
                  <span class="value">{{ state.form.memberNick }}</span>
                </div>
                <div class="info-item">
                  <span class="label">생년월일</span>
                  <span class="value">{{ formatBirthDate(state.form.birthDate) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="button-group">
            <router-link 
              to="/detail" 
              class="btn btn-primary"
            >
              정보 수정
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.page-wrapper {
  min-height: 100vh;
  background: #f8fafb;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header {
  color: #1e293b;;
  padding: 40px 30px;

  text-align: center;
}

.header h1 {
  font-size: 1.75rem;
  margin: 22px 0 -50px 0;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.header p {
  opacity: 0.9;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

.content-container {
  padding: 40px;
}

.loading-wrapper {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f1f3f5;
  border-top: 3px solid #5BA7F7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-wrapper p {
  color: #6c757d;
  font-size: 1rem;
}

.profile-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-photo-section {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  padding: 30px;
}

.photo-wrapper {
  position: relative;
}

.profile-img-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5BA7F7 0%, #4A9EF5 100%);
  border: 3px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.default-avatar span {
  color: white;
  font-size: 2rem;
  font-weight: 600;
  text-transform: uppercase;
}

.user-info h2 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 5px 0;
}

.user-info p {
  color: #5BA7F7;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}


.info-cards {
  margin-bottom: 40px;
}

.info-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  background: #f8fafb;
  padding: 20px 30px;
  border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
}

.card-content {
  padding: 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 30px;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 500;
  color: #6c757d;
  font-size: 0.9rem;
}

.info-item .value {
  color: #343a40;
  font-size: 0.95rem;
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 32px;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  min-width: 100px;
  border: none;
}

.btn-primary {
  background: #5BA7F7;
  color: white;
}

.btn-primary:hover {
  background: #4A9EF5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 167, 247, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

</style>