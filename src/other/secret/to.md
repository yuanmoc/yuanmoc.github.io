---
title: secret
permalink: /secret/to.html
icon: /assets/icon/la--user-secret.svg
---

::: center
**自用跳转中间页面，没有进行sitemap！**
:::

:::center
<span style="cursor: pointer;" @click="linkToMy1">**跳转个人日常！**</span>
:::

:::center
<span style="cursor: pointer;" @click="linkToMy2">**跳转个人文档！**</span>
:::

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import { useRouter } from 'vue-router';

function linkToMy1() {
    console.log("喝茶🍵！");
}
function linkToMy2() {
    console.log("喝咖啡☕️！");
}

const router = useRouter();
const mcsClickCount = ref(0);
const mcsTimer = ref();
const dailyClickCount = ref(0);
const dailyTimer = ref();

function handleScreenClick(event) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (event.clientX < screenWidth - 100 ) {
        return;
    }
    // 跳转个人文档
    if (event.clientY > screenHeight - 200 && event.clientY < screenHeight - 100) {
        handeCheckToLink(mcsClickCount, mcsTimer, "/mcs/")
    }
    // 跳转个人日常
    if (event.clientY > screenHeight / 2 - 50 && event.clientY < screenHeight / 2 + 50) {
        handeCheckToLink(dailyClickCount, dailyTimer, "/daily/")
    }
}

function handeCheckToLink(clickCountRef, timerRef, routerName) {
    clickCountRef.value++
    // 0.5秒内连续点击有效
    clearTimeout(timerRef.value)
    timerRef.value = setTimeout(() => {
      clickCountRef.value = 0
    }, 500)
    
    if (clickCountRef.value === 3) {
        router.push(routerName)
        // 重置计数器
        clickCountRef.value  = 0 
    }
}

onMounted(() => {
    document.body.addEventListener('click', handleScreenClick)
})

onUnmounted(() => {
    clearTimeout(mcsTimer.value)
    clearTimeout(dailyTimer.value)
    document.body.removeEventListener('click', handleScreenClick)
})

</script>

<style scoped>
#markdown-content {
  user-select: none;
}
</style>