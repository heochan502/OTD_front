<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getProfile, updateProfile } from '@/services/accountService';
import { useAccountStore } from '@/stores/counter';

const router = useRouter();
const counter = useAccountStore();
const photoInput = ref(null);

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
  originalForm: {},
  loading: true,
  saving: false,
  showSuccess: false
});

const formatDateForInput = (birthDate) => {
  if (!birthDate || birthDate.length !== 8) return '';
  return `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}`;
};

const formatDateForSave = (dateString) => {
  if (!dateString) return '';
  return dateString.replace(/-/g, '');
};


const handleImageError = (e) => {

  state.form.profileImage = '';
};

const changeProfilePhoto = () => {
  photoInput.value?.click();
};

const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.form.profileImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveProfile = async () => {
  if (!state.form.name.trim()) {
    alert('이름을 입력해주세요.');
    return;
  }
  
  if (!state.form.email.trim()) {
    alert('이메일을 입력해주세요.');
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(state.form.email)) {
    alert('올바른 이메일 형식을 입력해주세요.');
    return;
  }

  state.saving = true;
  
  try {
    const formData = {
      ...state.form,
      birthDate: formatDateForSave(state.form.birthDate)
    };
    
    console.log('전송할 데이터:', formData);
    
    const res = await updateProfile(formData);
    
    console.log('API 응답:', res);
    console.log('응답 상태:', res?.status);
    console.log('응답 데이터:', res?.data);
    
    if (res && res.status === 200) {
      state.showSuccess = true;
      state.originalForm = { ...state.form };
      
      setTimeout(() => {
        state.showSuccess = false;
      }, 3000);
    } else {
      console.error('수정 실패 - 전체 응답:', res);
      alert(`정보 수정에 실패했습니다. 상태코드: ${res?.status || '알 수 없음'}`);
    }
  } catch (error) {
    console.error('Profile update error:', error);
    alert('오류가 발생했습니다: ' + error.message);
  } finally {
    state.saving = false;
  }
};

onMounted(async () => {
  if (!counter.state.loggedIn) {
    router.push('/login');
    return;
  }

  try {
    console.log('프로필 정보 로딩 시작...');
    const res = await getProfile();
    console.log('getProfile 응답:', res);
    
    if (res && res.status === 200) {
      const profileData = {
        ...res.data,
        birthDate: formatDateForInput(res.data.birthDate)
      };
      
      console.log('처리된 프로필 데이터:', profileData);
      
      Object.assign(state.form, profileData);
      state.originalForm = { ...profileData };
    } else {
      console.error('프로필 로딩 실패:', res);
    }
  } catch (error) {
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
        <h1>회원정보 수정</h1>
      </div>

      <div class="content-container">
        <div v-if="state.loading" class="loading-wrapper">
          <div class="loading-spinner"></div>
          <p>정보를 불러오는 중...</p>
        </div>

        <div v-else class="edit-content">
          <div v-if="state.showSuccess" class="success-message">
            정보가 성공적으로 업데이트되었습니다!
          </div>

          <form @submit.prevent="saveProfile">
            <div class="profile-photo-section">
              <div class="photo-wrapper" @click="changeProfilePhoto">
              <img 
                  :src="state.form.profileImage" 
                  alt="프로필 사진" 
                  class="profile-img"
                  @error="handleImageError"
                >
                <div class="photo-overlay">
                  <span>사진 변경</span>
                </div>
              </div>
              <input
                ref="photoInput"
                type="file"
                accept="image/*"
                @change="handlePhotoChange"
                style="display: none"
              />
            </div>

            <div class="section">
              <h3 class="section-title">기본 정보</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="memberId">아이디</label>
                  <input
                    type="text"
                    id="memberId"
                    :value="state.form.memberId"
                    readonly
                    class="readonly"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    v-model="state.form.email"
                    required
                    placeholder="이메일을 입력하세요"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="name">이름</label>
                  <input
                    type="text"
                    id="name"
                    v-model="state.form.name"
                    required
                    placeholder="이름을 입력하세요"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="memberNick">닉네임</label>
                  <input
                    type="text"
                    id="memberNick"
                    v-model="state.form.memberNick"
                    placeholder="닉네임을 입력하세요"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="birthDate">생년월일</label>
                  <input
                    type="text"
                    id="birthDate"
                    v-model="state.form.birthDate"
                    placeholder="YYYYMMDD"
                  />
                </div>
              </div>
            </div>
            <div class="button-group">
              <router-link to="/profile" class="btn btn-outline">
                취소
              </router-link>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="state.saving"
              >
                <span v-if="state.saving">저장 중...</span>
                <span v-else>저장하기</span>
              </button>
            </div>
          </form>
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', sans-serif;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #5ba7f7 0%, #4a9ef5 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.header h1 {
  font-size: 1.75rem;
  margin: 0 0 8px 0;
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
  border-top: 3px solid #5ba7f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-wrapper p {
  color: #6c757d;
  font-size: 1rem;
}

.success-message {
  background: #e8f5e8;
  color: #2d5a2d;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border-left: 4px solid #5ba7f7;
  font-size: 0.95rem;
  font-weight: 500;
}

.profile-photo-section {
  text-align: center;
  margin-bottom: 40px;
}

.photo-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #e9ecef;
  object-fit: cover;
  transition: all 0.2s ease;
}

.photo-wrapper:hover .profile-img {
  border-color: #5ba7f7;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(91, 167, 247, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-wrapper:hover .photo-overlay {
  opacity: 1;
}

.photo-overlay span {
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f1f3f5;
}

/* 폼 레이아웃 */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
}

input:focus {
  outline: none;
  border-color: #5ba7f7;
  box-shadow: 0 0 0 3px rgba(91, 167, 247, 0.1);
}

input.readonly {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #5ba7f7;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4a9ef5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 167, 247, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #6c757d;
  border: 1.5px solid #dee2e6;
}

.btn-outline:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}
</style>
