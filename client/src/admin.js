import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import router from "./router/admin";
import store from "./store";
import i18n from "./locales/admin";
import locale from "element-ui/lib/locale/lang/en";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "@/styles/index.scss"; // global css
import "element-ui/lib/theme-chalk/index.css";

import ElementUI from "element-ui";
Vue.use(ElementUI, { locale, size: "mini", zIndex: 3000 });

Vue.config.productionTip = false;
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App },
  i18n
});
