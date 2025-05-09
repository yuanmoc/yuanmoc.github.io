<template>
  <div class="article-list-container">
    <DailyPassword v-if="showDailyPassword" :encryptedKey="encryptedKey" @submitPassword="handlePasswordInput" @close="closePasswordInput"/>
    <div class="vp-article-wrapper">
      <div v-for="article in displayedArticles" :key="article.id" class="vp-article-item">
        <div v-if="!article.password" v-html="article.content"></div>
        <div v-else>
          &zwnj;写了又怕别人看到，直接6666星级加密！&zwnj;
          <div class="eye-toggle" @click="handleDecrypt(article)"></div>
        </div>
        <div class="horizontal-line"></div>
        <div class="floating-time">{{ formatDate(article.date) }}</div>
        <div class="like-container">
          <button @click="toggleLike(article.id)" :class="{ 'liked': isLiked[article.id] }" class="like-button">
            <span class="like-icon"></span>
          </button>
          <span class="like-count">{{ likes?.[article.id] || 0 }}</span>
        </div>
      </div>
    </div>
    <!-- 加载提示 -->
    <div class="loading-indicator">
      <div v-if="dailyNum <= currentPage">~我是有底线的~</div>
      <div v-else class="loading-cursor" @click="loadMoreArticles">~加载更多~</div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch} from 'vue';
import CryptoJS from 'crypto-js';
import { getLikes, updateLikes } from "../util/jsonstorage.js"

// 页码
const dailyNum = ref();
// 当前显示的文章索引
const currentPage = ref(0);
// 最后滚动时间
let lastScrollTime = Date.now();
// 显示的文章列表
const displayedArticles = ref([])

// 远程likes列表
const likes = ref({})
// 历史所有点击存在本地的like
const isLiked = ref({});

// 是否显示密码框
const showDailyPassword = ref(false)
// 输入的密码
const password = ref('')
// 当前解密内容
const currentEncryptedArticles = ref()

const props = defineProps({
  encryptedKey: {
    type: String,
    required: true
  }
});

onMounted(async () => {
  // 点赞数据
  const storedIsLiked = localStorage.getItem('isLiked');
  isLiked.value = storedIsLiked ? JSON.parse(storedIsLiked) : {}
  likes.value = {...isLiked.value}

  // 异步加载 dailyNum
  const { dailyNum: num } = await import("@temp/daily");
  dailyNum.value = num;
  // 开始加载第一页
  currentPage.value = 0
  // 监听滚动
  document.addEventListener('scroll', handleScroll);

  // 获取点赞数据 {1746090400000: 1}
  const onLinkLikes = await getLikes()
  if (onLinkLikes &&  Object.keys(onLinkLikes).length !== 0) {
    Object.keys(onLinkLikes).forEach(key => {
      likes.value[key] = onLinkLikes[key]
    })
  }
})

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll);
});

const handleDecrypt = (article) => {
  if (!article.password) {
    return;
  }
  currentEncryptedArticles.value = article
  if (props.encryptedKey === CryptoJS.SHA256(password.value).toString()) {
    // 已经输入密码，直接使用密码解密
    handlePasswordInput(password.value)
  } else {
    // 弹出密码输入框进行验证
    showDailyPassword.value = true
  }
}

const handlePasswordInput = (pwd) => {
  password.value = pwd;
  if (currentEncryptedArticles.value.password ) {
    const decrypted = CryptoJS.AES.decrypt(currentEncryptedArticles.value.content, password.value, {
      iv: password.value,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    currentEncryptedArticles.value.content = decrypted.toString(CryptoJS.enc.Utf8);
    currentEncryptedArticles.value.password = false;
  }
  closePasswordInput()
}

const closePasswordInput = () => {
  showDailyPassword.value = false
}

const toggleLike = async id => {
  // console.log("点赞功能尚未实现，没有找到可以使用的api接口！(可以更新/修改内容api接口，且可以跨域。)")
  if (isLiked.value[id]) {
    // 已经点赞过
    return
  }
  if (likes.value?.hasOwnProperty(id)) {
    likes.value[id] = likes.value[id] + 1
  } else {
    likes.value[id] = 1
  }
  // 保存点赞信息
  isLiked.value[id] = 1;
  localStorage.setItem('isLiked', JSON.stringify(isLiked.value));
  await updateLocalLike(id)
}


const updateLocalLike = async (id) => {
  // 更新点赞数据
  const onLineLikes =  await getLikes()
  for (const [key, value] of Object.entries(onLineLikes)) {
    if (key.toString() === id.toString()) {
      likes.value[key] = value + 1;
    } else {
      likes.value[key] = value;
    }
  }
  await updateLikes(likes.value)
}

// 当前显示的文章列表
const fetchDailyData = async () => {
  const decodedArticlesValue = await decodedArticles(currentPage.value)
  // 分隔排序
  displayedArticles.value = [...(displayedArticles.value || []), ...(decodedArticlesValue || [])]
};


// 解码文章数据
const decodedArticles = async (index) => {
  if (index < 0 || index >= dailyNum.value) {
    return []
  }
  const {dailyData} = await import(`@temp/${CryptoJS.SHA256(index)}.js`)
  const dailyDataJson = JSON.parse(dailyData)
  dailyDataJson.forEach(daily => {
    if(!daily.password) {
      const decrypted = CryptoJS.AES.decrypt(daily.content, props.encryptedKey, {
        iv: props.encryptedKey,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      daily.content = decrypted.toString(CryptoJS.enc.Utf8);
    }
  })
  return dailyDataJson;
}

// 时间格式化
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: 'numeric',
      // minute: 'numeric',
      // second: 'numeric'
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(date);
  } catch (e) {
    return "时间格式飘了"
  }

}


// 处理滚动事件
const handleScroll = () => {
  // 防止过度触发
  const now = Date.now();
  if (now - lastScrollTime < 60) { return }
  lastScrollTime = now;

  // 计算高
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight || document.body.clientHeight;

  //可以设置>=就行，这里也可以设置距离底部一定距离，自定义，不一定非要到达底部
    if( clientHeight + scrollTop + 50 >= scrollHeight) {
      // 接近底部，加载更多
      loadMoreArticles();
    }
};

// 加载更多文章
const loadMoreArticles = async () => {
  if (currentPage.value < dailyNum.value) {
    currentPage.value++;
  }
  // 模拟加载延迟
  await new Promise((resolve) => setTimeout(resolve, 500));
};

// 监听数据修改（immediate: false 创建时不触发执行，数据变化才执行）
watch(currentPage, fetchDailyData, { immediate: true });

</script>

<style scoped>

.vp-article-item {
  margin-bottom: 28px;
}

.horizontal-line {
  border-top: 1px dashed #ccc; /* 虚线样式 */
  margin: 15px 0;
  width: 100%;
}

/*时间*/

.floating-time {
  color: #7d7676;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  display: contents;
  float: left;
  user-select: none;
}

/*点赞功能*/

.like-container {
  position: relative;
  bottom: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
  user-select: none;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  transition: transform 0.2s ease;
}

.like-button:hover {
  transform: scale(1.1);
}

.like-icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url("/assets/icon/solar--like-linear.svg");
  background-size: cover;
  transition: background-image 0.2s ease;
}

.like-button.liked .like-icon {
  background-image: url("/assets/icon/solar--like-bold-duotone.svg");
}

.like-count {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/*加载更多*/

.loading-indicator {
  text-align: center;
  padding: 30px;
}

.loading-cursor {
  cursor: pointer;
}

/* 眼睛图标容器 */
.eye-toggle {
  width: 40px;
  height: 24px;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s;
  float: right;

  /* 使用SVG作为背景图片 */
  background-image: url("/assets/icon/mdi--eye-outline.svg");
  background-size: contain;
  background-repeat: no-repeat;
}

/* 悬浮动画 */
.eye-toggle:hover {
  transform: scale(1.1);
}

</style>
