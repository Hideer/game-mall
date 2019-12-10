import { getLocalItem, setLocalItem } from "../../util/util";
import * as types from "./../mutation-types";


const state = {
  clientName: getLocalItem("clientName") ? getLocalItem("clientName") : "",
  clientToken: getLocalItem("clientToken") ? getLocalItem("clientToken") : null
};

const mutations = {
  [types.SET_CLIENT_TOKEN]: (state, clientToken) => {
    state.clientToken = clientToken;
    setLocalItem("clientToken", clientToken);
  },
  [types.SET_CLIENT_NAME]: (state, name) => {
    state.clientName = name;
    setLocalItem("clientName", name);
  },
  [types.CLIENT_LOGOUT]: state => {
    state.clientToken = null;
    state.clientName = "";
    localStorage.removeItem("clientToken", "clientName");
  }
};

const actions = {};

export default {
  // namespaced: true,
  state,
  mutations,
  actions
};
