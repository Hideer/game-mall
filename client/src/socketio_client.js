import Vue from "vue";
import store from "./store";
import VueSocketIO from "vue-socket.io";

export const Connection = token => {
  Vue.use(
    new VueSocketIO({
      debug: true,
      connection: `http://localhost:3000/client?token=${token}`,
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
