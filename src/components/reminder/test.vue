<script setup>
import { useWebNotification } from '@vueuse/core';

const { isSupported, show, close } = useWebNotification({
  title: '새로운 알림이 왔습니다!',
  tag: 'test',
  body: '이것은 테스트 알림입니다.',
  icon: '/public/image/mobile/select-calendar.png', // 알림에 표시할 아이콘 경로
});

function handleShowNotification() {
  if (isSupported.value) {
    show();
  } else {
    alert('이 브라우저에서는 알림 기능을 지원하지 않습니다.');
  }
}
</script>
<template>
  <button @click="handleShowNotification">알림 표시하기</button>
</template>