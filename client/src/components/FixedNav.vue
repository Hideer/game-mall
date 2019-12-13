<template>
  <div class="FixedNav" :style="{ width: width }">
    <slot name="navContent"></slot>
  </div>
</template>

<script>
import { getClientSize } from "../util/util";
export default {
  name: "FixedNav",
  props: {},
  data() {
    return {
      width: ""
    };
  },
  mounted() {
    this.width = getClientSize().width + "px";
  }
};
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.FixedNav {
  position: fixed;
  top: 0;
  left: 0;
  height: 64px;
  background-color: white;
  animation: slideIn 0.3s;
  z-index: 10000;
  box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.1),
    0 5px 10px -5px rgba(0, 0, 0, 0.1);
}
@keyframes slideIn {
  from {
    top: -64px;
  }
  to {
    top: 0px;
  }
}
</style>
