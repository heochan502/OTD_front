<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/accountService';

const router = useRouter();

const state = reactive({
    form: {
        memberId: '',
        memberPw: ''
    }
});

const submit = async () => {
    const detail = state.form;
    console.log(state.form);
    const res = await login(state.form);

    switch(res.status) {
        case 200:
            await router.push('/');
            break;
        case 404:
            alert('아이디/비밀번호를 확인해 주세요.');
            break;
    }
}
</script>

<template>
    <div class="login">
        <div class="container">
            <form class="py-5 d-flex flex-column gap-3" @submit.prevent="submit">
                <h1 class="h5 mb-3">로그인</h1>

                 <div class="form-floating">
                    <input type="text" class="form-control" id="memberId" placeholder="아이디" v-model="state.form.memberId">
                    <label for="memberId">아이디</label>
                </div>  
                <div class="form-floating">
                    <input type="password" class="form-control" id="memberPw" placeholder="패스워드" v-model="state.form.memberPw" autocomplete="off">
                    <label for="memberPw">비밀번호</label>
                </div>   
                <button class="w-100 h6 btn py-3 btn-primary">로그인</button>

            </form> 
        </div>
    </div>
</template>

<style scoped>
.container { max-width: 576px; }
</style>