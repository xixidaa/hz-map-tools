<!--
 * @Author: WangNing
 * @Date: 2023-02-08 20:38:39
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-16 15:41:58
 * @FilePath: /hz-map-tools/src/components/DrawRelated/DrawToolType.vue
-->
<template>
  <DrawToolContainer>
    <div
      @click="drawShape('Circle')"
      :class="shapeKey == 'Circle' && 'space-select-active'"
    >
      <span>
        <SvgIcon name="circle" class="space-icon common-icon-middle"></SvgIcon>
      </span>
      <span>圆形</span>
    </div>
    <div
      @click="drawShape('Rectangle')"
      :class="shapeKey == 'Rectangle' && 'space-select-active'"
    >
      <span>
        <SvgIcon name="react" class="space-icon common-icon-middle"></SvgIcon>
      </span>
      <span>矩形</span>
    </div>
    <div
      title="双击完成绘制"
      @click="drawShape('Polygon')"
      :class="shapeKey == 'Polygon' && 'space-select-active'"
    >
      <span>
        <SvgIcon name="user_define" class="space-icon common-icon-middle"></SvgIcon>
      </span>
      <span>自定义</span>
    </div>
  </DrawToolContainer>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["drawToolValueChange"]);

const shapeKey = ref("");
const drawShape = (val) => {
  shapeKey.value = val;
  emit("drawToolValueChange", val);
};
const resetShape = () => {
  shapeKey.value = "";
};
// 子组件方法暴露给父组件;
defineExpose({
  resetShape,
});
</script>

<style lang="scss" scoped>
.common-icon-middle {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.5);
}
.common-icon-max {
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.5);
}

.space-select-active {
  color: rgba(0, 177, 184, 1);
  .space-icon {
    color: rgba(0, 177, 184, 1);
  }
}

.space-region {
  & > div {
    width: 64px;
    &:nth-child(n + 1) {
      border-right: 2px solid rgba(204, 219, 255, 0.1);
    }
    &:nth-last-child(1) {
      border: none;
    }
  }
  & > div:hover {
    color: rgba(0, 177, 184, 1);
    cursor: pointer;
    .space-icon {
      color: rgba(0, 177, 184, 1);
    }
  }
}
.space-region > div > span:nth-of-type(2) {
  vertical-align: text-top;
  margin-left: 5px;
}
</style>
