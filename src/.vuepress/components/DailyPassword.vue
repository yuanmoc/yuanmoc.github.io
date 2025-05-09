<template>
    <div class="password-container">
      <div class="password-box">
        <span class="close-button" @click="closePasswordInput">&times;</span>
        <input v-model="password" type="password" placeholder="输入密码显示" class="password-input">
        <div class="error-message">
            <p v-if="isPasswordError">密码错误，请重新输入。</p>
        </div>
        <button @click="passwordInput" class="confirm-button">确认</button>
      </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CryptoJS from 'crypto-js';

const password = ref('');
const isPasswordError = ref(false);
const emit = defineEmits(['submitPassword', 'close']);

const passwordInput = () => {
  if (props.encryptedKey === CryptoJS.SHA256(password.value).toString()) {
    isPasswordError.value = false;
    emit('submitPassword', password.value);
  } else {
    isPasswordError.value = true;
  }
};
const closePasswordInput = () => {
  emit("close")
}

const props = defineProps({
  encryptedKey: {
    type: String,
    required: true
  },
});
// 监听 password 变化，输入框内容变化时关闭提示
watch(password, () => {
  isPasswordError.value = false;
});
</script>

<style scoped>

.password-container {
  z-index: 99999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  overflow: hidden
}

.password-box {
  border-radius: 1.5rem;
  box-shadow: 2px 2px 10px 6px var(--vp-c-shadow);
  transition: box-shadow var(--vp-t-color);
  padding: 70px;
  background-color: white;
  position: relative;
}

.password-input {
  display: block;
  border: 2px solid #4285f4;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 0 1.5rem;
  font-size: 1rem;
  line-height: 2;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  transition: color 0.3s;
}

.confirm-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.error-message {
  display: block;
  height: 10px;
  color: red;
  font-size: 10px;
  margin-top: 5px;
}
.error-message p {
  padding: 0;
  margin: 0;
  line-height: 0;
}
</style>