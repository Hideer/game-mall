import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import router from "./router/admin";
import store from "./store";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "@/styles/index.scss"; // global css
import "element-ui/lib/theme-chalk/index.css";

// import './assets/css/common.less';
// import './assets/font/iconfont.css';

Vue.config.productionTip = false;

import ElementUI from "element-ui";

Vue.use(ElementUI, { size: "mini", zIndex: 3000 });

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});
