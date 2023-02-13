<template>
  <div class="space-setting" :style="style">
    <div class="space-setting-header">
      <div>{{ title }}</div>
      <div @click="buttonEvent('close')" class="close">
        <SvgIcon name="close" class="space-icon common-icon-middle"></SvgIcon>
      </div>
    </div>
    <div class="space-setting-content">
      <slot></slot>
    </div>

    <div class="space-bottom">
      <div @click="buttonEvent('cancel')" class="cancel">取消</div>
      <div @click="buttonEvent('complete')" class="select">确定</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  styleObject: {
    type: String,
    required: false
  }
})
const style = computed(() => props.styleObject)
const title = computed(() => props.title)
const emit = defineEmits(['buttonEvent'])
const buttonEvent = (val) => {
  emit('buttonEvent', val)
}
</script>

<style lang="scss" scoped>
.common-icon-middle {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 50%);
}

.space-setting {
  box-sizing: border-box;
  width: 388px;
  min-height: 148px;
  background: #242730;
  box-shadow: 0 16px 32px -6px rgba(4, 8, 16, 64%), 0 3px 8px -2px rgba(4, 8, 16, 48%), 0 0 1px rgba(4, 8, 16, 32%);
  border-radius: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 70%);
  padding: 14px 24px 20px;
  position: fixed;
  pointer-events: auto;
  visibility: visible;
  z-index: 12;
}

.space-setting-header {
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .close {
    cursor: pointer;
  }

  .close:hover {
    .space-icon {
      color: rgba(0, 177, 184, 54%);
    }
  }
}

.space-bottom {
  display: flex;
  margin-top: 5px;
  justify-content: flex-end;
  align-items: center;

  div {
    width: 49px;
    height: 28px;
    left: 239px;
    border-radius: 4px;
    margin: 0 8px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
  }

  .select {
    color: rgba(0, 177, 184, 100%);
  }

  .select:hover {
    background: rgba(0, 177, 184, 10%);
    border-color: rgba(3, 225, 233, 30%);
  }

  .cancel:focus,
  .cancel:hover {
    border-color: #414657;
    background-color: rgba(81, 88, 107, 30%);
  }
}
</style>
