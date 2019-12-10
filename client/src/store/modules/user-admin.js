import { getLocalItem, setLocalItem } from "../../util/util";
import * as types from "./../mutation-types";

const state = {
  adminToken: getLocalItem("adminToken") ? getLocalItem("adminToken") : null,
  adminName: getLocalItem("adminName") ? getLocalItem("adminName") : ""
};

const mutations = {
  [types.SET_ADMIN_TOKEN]: (state, adminToken) => {
    state.adminToken = adminToken;
    setLocalItem("adminToken", adminToken);
  },
  [types.SET_ADMIN_NAME]: (state, name) => {
    state.adminName = name;
    setLocalItem("adminName", name);
  },
  [types.ADMIN_LOGOUT]: state => {
    state.adminToken = null;
    state.adminName = "";
    localStorage.removeItem("adminToken", "adminName");
  }
};

const actions = {
  [types.SET_ADMIN_TOKEN]: ({ commit }, data) => {
    commit(types.SET_ADMIN_TOKEN, data);
  },
  [types.SET_ADMIN_NAME]: ({ commit }, data) => {
    commit(types.SET_ADMIN_NAME, data);
  }
};

export default {
  // namespaced: true,
  state,
  mutations,
  // actions
};
