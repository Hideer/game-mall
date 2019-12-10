import Vue from "vue";
import store from "./store";
import VueSocketIO from "vue-socket.io";

export const Connection = (token) => {
  Vue.use(
    new VueSocketIO({
      debug: true,
      connection: `http://localhost:3000/admin?token=${token}`,
      // query: `token=${token}`,
      vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_"
      },
      options: {
        // path: "/admin"//重置连接名字
      } //Optional options
    })
  );
};

// export const SET_TOKEN = (token) => {
//   console.log(Vue.$socket);
// };
