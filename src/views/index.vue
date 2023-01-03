<template>
  <el-container class="common-layout">
    <el-header class="layout-header-wrapper">
      <el-row style="width: 100%">
        <el-col :span="1">
          <div class="header-left-logo">
            <img src="../assets/svg/header_logo.svg" />
          </div>
        </el-col>
        <el-col :span="19">
          <nav-bar></nav-bar>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
    </el-header>
    <el-main class="main-container">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
// import { onMounted } from 'vue'
</script>

<style lang="scss" scoped>
@import '../assets/coverElement.scss';
.common-layout {
  height: 100%;

  .header-left-logo {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .layout-header-wrapper {
    display: flex;
    background: #545c64;
  }
}

.main-container {
  background: #000;
}
</style>
