<template>
  <div class="main">测试页面</div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  console.log('chufa')
})
</script>

<style lang="scss" scoped>
.main {
  background-color: #fff;
}
</style>
