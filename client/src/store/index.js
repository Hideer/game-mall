import Vuex from "vuex";
import Vue from "vue";
import getters from "./getters";
// import * as actions from "./actions";
// import state from "./state";
// import mutations from "./mutations";
// 模块
import app from "./modules/app"
import settings from "./modules/settings";
import userAdmin from "./modules/user-admin";
import userClient from "./modules/user-client";


Vue.use(Vuex);

export default new Vuex.Store({
  // state,
  // actions,
  // mutations,
  modules: {
    settings,
    app,//管理端
    userAdmin,
    userClient
  },
  getters
});
