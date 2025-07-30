<script setup>
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { changePassword } from '@/services/accountService';
import { useAccountStore } from '@/stores/counter';


const router = useRouter();
const counter = useAccountStore();

const state = reactive({
  form: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  validation: {
    currentPassword: {
      isValid: true,
      message: '',
      touched: false,
    },
    newPassword: {
      isValid: true,
      message: '',
      touched: false,
    },
    confirmPassword: {
      isValid: true,
      message: '',
      touched: false,
    },
  },
  saving: false,
  showSuccess: false,
  generalError: '',
});


const validateCurrentPassword = (password) => {
  if (!password) {
    return { isValid: false, message: '현재 비밀번호를 입력해주세요.' };
  }
  return { isValid: true, message: '' };
};

const validateNewPassword = (password) => {
  if (!password) {
    return { isValid: false, message: '새 비밀번호를 입력해주세요.' };
  }
  if (password.length < 2) {
    return { isValid: false, message: '새 비밀번호는 2자 이상이어야 합니다.' };
  }
  if (password.length > 20) {
    return { isValid: false, message: '새 비밀번호는 최대 20자까지 입력 가능합니다.' };
  }
  if (password === state.form.currentPassword) {
    return { isValid: false, message: '현재 비밀번호와 다른 비밀번호를 입력해주세요.' };
  }
  return { isValid: true, message: '' };
};

const validateConfirmPassword = (confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: '새 비밀번호 확인을 입력해주세요.' };
  }
  if (state.form.newPassword !== confirmPassword) {
    return { isValid: false, message: '새 비밀번호가 일치하지 않습니다.' };
  }
  return { isValid: true, message: '새 비밀번호가 일치합니다.' };
};

const validateField = (field, value) => {
  let result;

  switch (field) {
    case 'currentPassword':
      result = validateCurrentPassword(value);
      break;
    case 'newPassword':
      result = validateNewPassword(value);
      break;
    case 'confirmPassword':
      result = validateConfirmPassword(value);
      break;
    default:
      result = { isValid: true, message: '' };
  }

  state.validation[field] = {
    ...state.validation[field],
    isValid: result.isValid,
    message: result.message,
  };
};

const handleFieldTouch = (field) => {
  state.validation[field].touched = true;
  validateField(field, state.form[field]);
};

const isFormValid = () => {
  return Object.values(state.validation).every((field) => field.isValid) &&
         state.form.currentPassword && 
         state.form.newPassword && 
         state.form.confirmPassword;
};


watch(
  () => state.form.currentPassword,
  (newValue) => {
    if (state.validation.currentPassword.touched) {
      validateField('currentPassword', newValue);
    }

    if (state.validation.newPassword.touched) {
      validateField('newPassword', state.form.newPassword);
    }
  }
);

watch(
  () => state.form.newPassword,
  (newValue) => {
    if (state.validation.newPassword.touched) {
      validateField('newPassword', newValue);
    }

    if (state.validation.confirmPassword.touched) {
      validateField('confirmPassword', state.form.confirmPassword);
    }
  }
);

watch(
  () => state.form.confirmPassword,
  (newValue) => {
    if (state.validation.confirmPassword.touched) {
      validateField('confirmPassword', newValue);
    }
  }
);


const changePasswordSubmit = async () => {

  Object.keys(state.validation).forEach((field) => {
    state.validation[field].touched = true;
    validateField(field, state.form[field]);
  });

  if (!isFormValid()) {
    state.generalError = '입력 정보를 다시 확인해주세요.';
    setTimeout(() => (state.generalError = ''), 3000);
    return;
  }

  state.saving = true;
  state.generalError = '';

  try {
    const requestData = {
      currentPassword: state.form.currentPassword,
      newPassword: state.form.newPassword,
    };

    console.log('비밀번호 변경 요청:', requestData);

    const res = await changePassword(requestData);

    console.log('API 응답:', res);

    if (res && res.status === 200) {
      state.showSuccess = true;
      

      state.form.currentPassword = '';
      state.form.newPassword = '';
      state.form.confirmPassword = '';
      

      Object.keys(state.validation).forEach((field) => {
        state.validation[field] = {
          isValid: true,
          message: '',
          touched: false,
        };
      });

      setTimeout(() => {
        state.showSuccess = false;
      }, 3000);
    } else {
      console.error('비밀번호 변경 실패 - 전체 응답:', res);
      
      if (res?.status === 401) {
        state.generalError = '현재 비밀번호가 올바르지 않습니다.';
      } else if (res?.status === 400) {
        state.generalError = res.data?.message || '잘못된 요청입니다.';
      } else {
        state.generalError = `비밀번호 변경에 실패했습니다. 상태코드: ${
          res?.status || '알 수 없음'
        }`;
      }
    }
  } catch (error) {
    console.error('Password change error:', error);
    state.generalError = '오류가 발생했습니다: ' + error.message;
  } finally {
    state.saving = false;
  }
};


watch(
  () => counter.state.loggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="content-container">
        <div class="password-change-content">
          <div v-if="state.showSuccess" class="success-message">
            <div class="message-icon">✓</div>
            <div>비밀번호가 성공적으로 변경되었습니다!</div>
          </div>

          <div v-if="state.generalError" class="error-message">
            <div class="message-icon">⚠</div>
            <div>{{ state.generalError }}</div>
          </div>

          <form @submit.prevent="changePasswordSubmit">
            <div class="section">
              <div class="header">
                <h1>비밀번호 변경</h1>
                <p class="subtitle">보안을 위해 주기적으로 비밀번호를 변경해주세요.</p>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="currentPassword">현재 비밀번호</label>
                  <input
                    type="password"
                    id="currentPassword"
                    v-model="state.form.currentPassword"
                    placeholder="현재 비밀번호를 입력하세요"
                    :class="{
                      error:
                        state.validation.currentPassword.touched &&
                        !state.validation.currentPassword.isValid,
                      success:
                        state.validation.currentPassword.touched &&
                        state.validation.currentPassword.isValid &&
                        state.form.currentPassword,
                    }"
                    @blur="handleFieldTouch('currentPassword')"
                    @input="
                      state.validation.currentPassword.touched &&
                        validateField('currentPassword', state.form.currentPassword)
                    "
                  />
                  <div
                    v-if="
                      state.validation.currentPassword.touched &&
                      state.validation.currentPassword.message
                    "
                    class="field-error"
                  >
                    {{ state.validation.currentPassword.message }}
                  </div>
                  <div
                    v-else-if="
                      state.validation.currentPassword.touched &&
                      state.validation.currentPassword.isValid &&
                      state.form.currentPassword
                    "
                    class="field-success"
                  >
                    현재 비밀번호가 입력되었습니다.
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="newPassword">새 비밀번호</label>
                  <input
                    type="password"
                    id="newPassword"
                    v-model="state.form.newPassword"
                    placeholder="새 비밀번호를 입력하세요 (2자 이상)"
                    :class="{
                      error:
                        state.validation.newPassword.touched &&
                        !state.validation.newPassword.isValid,
                      success:
                        state.validation.newPassword.touched &&
                        state.validation.newPassword.isValid &&
                        state.form.newPassword,
                    }"
                    @blur="handleFieldTouch('newPassword')"
                    @input="
                      state.validation.newPassword.touched &&
                        validateField('newPassword', state.form.newPassword)
                    "
                  />
                  <div
                    v-if="
                      state.validation.newPassword.touched &&
                      state.validation.newPassword.message
                    "
                    class="field-error"
                  >
                    {{ state.validation.newPassword.message }}
                  </div>
                  <div
                    v-else-if="
                      state.validation.newPassword.touched &&
                      state.validation.newPassword.isValid &&
                      state.form.newPassword
                    "
                    class="field-success"
                  >
                    사용 가능한 비밀번호입니다.
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="confirmPassword">새 비밀번호 확인</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="state.form.confirmPassword"
                    placeholder="새 비밀번호를 한번 더 입력하세요"
                    :class="{
                      error:
                        state.validation.confirmPassword.touched &&
                        !state.validation.confirmPassword.isValid,
                      success:
                        state.validation.confirmPassword.touched &&
                        state.validation.confirmPassword.isValid &&
                        state.form.confirmPassword,
                    }"
                    @blur="handleFieldTouch('confirmPassword')"
                    @input="
                      state.validation.confirmPassword.touched &&
                        validateField('confirmPassword', state.form.confirmPassword)
                    "
                  />
                  <div
                    v-if="
                      state.validation.confirmPassword.touched &&
                      state.validation.confirmPassword.message
                    "
                    :class="[
                      state.validation.confirmPassword.isValid ? 'field-success' : 'field-error'
                    ]"
                  >
                    {{ state.validation.confirmPassword.message }}
                  </div>
                </div>
              </div>

              <div class="security-notice">
                <h3>비밀번호 보안 권장사항</h3>
                <ul>
                  <li>2자 이상의 비밀번호를 입력해주세요</li>
                  <li>현재 비밀번호와 다른 비밀번호를 사용하세요</li>
                  <li>개인정보(이름, 생년월일 등)는 사용하지 마세요</li>
                  <li>주기적으로 비밀번호를 변경하세요</li>
                </ul>
              </div>
            </div>

            <div class="button-group">
              <router-link to="/profile" class="btn btn-outline">
                취소
              </router-link>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="state.saving || !isFormValid()"
              >
                <span v-if="state.saving">변경 중...</span>
                <span v-else>비밀번호 변경</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f8fafc;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #1e293b;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.error-message,
.success-message {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.success-message {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.message-icon {
  margin-right: 8px;
  font-weight: bold;
}

.field-error {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.field-success {
  color: #16a34a;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.section {
  background: white;
  padding: 47px;
  border-radius: 12px;
  margin-bottom: 23px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.form-row {
  margin-bottom: 20px;
}

.form-group {
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error {
  border-color: #dc2626;
  background-color: #fef2f2;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-group input.success {
  border-color: #16a34a;
  background-color: #f0fdf4;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-group input:focus.error {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
}

.form-group input:focus.success {
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.security-notice {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.security-notice h3 {
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.security-notice ul {
  margin: 0;
  padding-left: 20px;
  color: #64748b;
}

.security-notice li {
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn-outline {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: 2px solid #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #e5e7eb;
  color: #9ca3af;
  border-color: #e5e7eb;
}
</style>