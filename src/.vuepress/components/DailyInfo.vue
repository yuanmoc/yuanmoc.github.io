<template>
  <div class="article-list-container">
    <ul class="space-y-4">
      <div v-for="article in displayedArticles" :key="article.date" class="vp-article-wrapper c-height">
        <div class="floating-time">{{ formatDate(article.date) }}</div>
        <div v-html="article.content" class="vp-article-item"></div>
      </div>
    </ul>
    <!-- 加载提示 -->
    <div class="loading-indicator">
      <div v-if="dailyNum <= currentPage">~我是有底线的~</div>
      <div v-else class="loading-cursor" @click="loadMoreArticles">~加载更多~</div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch} from 'vue';
import { fromBase64 } from '@jsonjoy.com/base64';

// 页码
const dailyNum = ref();
// 当前显示的文章索引
const currentPage = ref(0);
// 最后滚动时间
let lastScrollTime = Date.now();
// 显示的文章列表
const displayedArticles = ref([])

onMounted(async () => {
  // 异步加载 dailyNum
  const { dailyNum: num } = await import("@temp/daily-num");
  dailyNum.value = num;
  // 开始加载第一页
  currentPage.value = 0
  // 监听滚动
  document.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll);
});

// 当前显示的文章列表
const fetchDailyData = async () => {
  const decodedArticlesValue = await decodedArticles(currentPage.value)
  const splitData = regexList(decodedArticlesValue)
  // 分隔排序
  displayedArticles.value = [...(displayedArticles.value || []), ...(splitData || [])]
};

// 解析一个markdown中有多个记录
const regexList = (contents) => {
  const result = [];
  // const regex = /<p>@date: (.*?)<\/p>([\s\S]*?)(?=<p>@date: |$)/gms;
  const regex = /<p>@date: (.*?)<\/p>((?:(?!<p>@date:).)*)/gms;
  contents.forEach((content) => {
    let match
    let count = 0
    while ((match = regex.exec(content.content)) !== null) {
      count++
      result.push({
        date: match[1],
        content: match[2].trim() // 去除可能的换行和空格
      });
    }
    //  如果不能分隔，直接整个显示
    if (count === 0) {
      result.push({
        date: content.date,
        content: content.content // 去除可能的换行和空格
      });
    }
  })
  return result.sort((a,b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // 降序排序，最新的文章在前面
  })
}

// 解码文章数据
const decodedArticles = async (index) => {
  if (index < 0 || index >= dailyNum.value) {
    return []
  }
  const {dailyData} = await import(`@temp/daily-${index}.js`)
  const decodedUint8Array = fromBase64(dailyData);
  const decodedString = new TextDecoder().decode(decodedUint8Array);
  return JSON.parse(decodedString);
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

.loading-indicator {
  text-align: center;
  padding: 30px;
}

.loading-cursor {
  cursor: pointer;
}

.floating-time {
  padding: 3px 15px;
  background-color: #67676c;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  border-radius: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: inline-block;
  margin-bottom: 6px;
}
</style>
