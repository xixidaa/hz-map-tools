<!--
 * @Author: WangNing
 * @Date: 2023-01-03 19:44:45
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-18 18:07:37
 * @FilePath: /hz-map-tools/src/views/index.vue
-->
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
      <WaterMark></WaterMark>

      <!-- <hz-ce-watermark ref="ceWaterMark"></hz-ce-watermark> -->
    </el-main>
  </el-container>
</template>

<script setup>
// import { onMounted, ref } from "vue";

// const ceWaterMark = ref(null); // 自定义水印dom
// onMounted(() => {
//   waterMarkObserver();
// });
// const waterMarkObserver = () => {
//   const ceWaterMarkRt = ceWaterMark.value.shadowRoot;
//   let options = {
//     childList: true, //观察目标节点的子节点的新增和删除中)
//     subtree: true,
//   };
//   const checkWaterNode = (removedNodes) => {
//     const removedNodesArr = Array.from(removedNodes);
//     if (removedNodesArr) {
//       const waterNode = removedNodesArr.filter((item) => {
//         return item.id === "water-mark";
//       });
//       return waterNode.length > 0;
//     }
//   };
//   const callback = (records) => {
//     records.forEach((record) => {
//       console.log(record, "record");
//       if (checkWaterNode(record.removedNodes)) {
//         const { removedNodes, target } = record;
//         const waterMarkDom = removedNodes[0];
//         target.appendChild(waterMarkDom);
//       }
//     });
//   };
//   const observer = new MutationObserver(callback);
//   observer.observe(ceWaterMarkRt, options);
// };
</script>

<style lang="scss" scoped>
// @import '../assets/coverElement.scss';
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
  position: relative;
  background: #fff;
}
</style>
