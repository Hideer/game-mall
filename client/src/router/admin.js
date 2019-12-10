import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

let isConnection = false;
import { Connection, SET_TOKEN } from "@/socketio_admin";

import AdminLogin from "@/pages/admin/AdminLogin";
import Backstage from "@/pages/admin/Backstage";
import EditUser from "@/pages/admin/EditUser";
import EditAdmin from "@/pages/admin/EditAdmin";
import Goods from "@/pages/admin/Goods";
import Orders from "@/pages/admin/Orders";
import EditOrders from "@/pages/admin/EditOrders";
import EditGoods from "@/pages/admin/EditGoods";
import Messages from "@/pages/admin/Messages";
import ErrorPage from "@/pages/ErrorPage";
import Layout from "@/pages/admin/layout";

/**
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

Vue.use(Router);

let router = new Router({
  routes: [
    // {
    //   path: "/",
    //   redirect: "/login"
    // },
    {
      path: "/login",
      name: "AdminLogin",
      component: AdminLogin,
      hidden: true
    },
    {
      path: "/",
      component: Layout,
      redirect: "/editUser",
      hidden: true,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          meta: { requireLogin: true, title: "表盘", icon: "el-icon-orange" },
          component: () => import("@/pages/admin/dashboard/index")
        }
      ]
    },
    // user moduel
    {
      path: "/editUser",
      component: Layout,
      children: [
        {
          path: "",
          name: "EditUser",
          meta: {
            requireLogin: true,
            title: "会员管理",
            icon: "el-icon-user-solid"
          },
          component: EditUser
        }
      ]
    },
    // goods module
    {
      path: "/goods",
      component: Layout,
      meta: {
        title: "商品管理"
      },
      children: [
        {
          path: "",
          name: "Goods",
          meta: {
            requireLogin: true,
            title: "商品列表",
            icon: "el-icon-s-goods"
          },
          component: Goods
        },
        {
          path: ":id",
          name: "EditGoods",
          component: EditGoods,
          hidden: true,
          meta: {
            title: "商品编辑",
            requireLogin: true
          }
        }
      ]
    },
    // order module
    {
      path: "/orders",
      component: Layout,
      meta: {
        icon: "el-icon-s-order",
        title: "订单管理"
      },
      children: [
        {
          path: "",
          name: "Orders",
          meta: {
            title: "订单列表",
            icon: "el-icon-s-claim",
            requireLogin: true
          },
          component: Orders
        },
        {
          path: "d/:id",
          name: "EditOrders",
          hidden: true,
          component: EditOrders,
          meta: {
            title: "订单详情",
            requireLogin: true
          }
        },
        {
          path: "messages",
          name: "Messages",
          component: Messages,
          meta: {
            title: "评论管理",
            icon: "el-icon-s-comment",
            requireLogin: true
          }
        }
      ]
    },
    // system module
    {
      path: "/system",
      component: Layout,
      meta: {
        title: "系统管理",
        icon: "el-icon-s-tools"
      },
      children: [
        {
          path: "editAdmin",
          name: "EditAdmin",
          component: EditAdmin,
          meta: {
            requireLogin: true,
            title: "修改资料",
            icon: "el-icon-lollipop"
          }
        }
      ]
    },
    // {
    //   path: "/backstage",
    //   name: "Backstage",
    //   // redirect: "/backstage/editUser",
    //   component: Backstage,
    //   children: [
    //     {
    //       path: "editUser",
    //       name: "EditUser",
    //       component: EditUser,
    //       meta: {
    //         requireLogin: true
    //       }
    //     },
    //     {
    //       path: "editAdmin",
    //       name: "EditAdmin",
    //       component: EditAdmin,
    //       meta: {
    //         requireLogin: true
    //       }
    //     },
    //     {
    //       path: "goods",
    //       name: "Goods",
    //       component: Goods,
    //       meta: {
    //         requireLogin: true
    //       }
    //     },
    //     {
    //       path: "goods/:id",
    //       name: "EditGoods",
    //       component: EditGoods,
    //       meta: {
    //         requireLogin: true
    //       }
    //     },
    //     {
    //       path: "orders",
    //       name: "Orders",
    //       component: Orders,
    //       meta: {
    //         requireLogin: true
    //       }
    //     },
    //     {
    //       path: "orders/:id",
    //       name: "EditOrders",
    //       component: EditOrders,
    //       meta: {
    //         requireLogin: true
    //       }
    //     },
    //     {
    //       path: "messages",
    //       name: "Messages",
    //       component: Messages,
    //       meta: {
    //         requireLogin: true
    //       }
    //     }
    //   ]
    // },
    {
      //404页面
      path: "*",
      name: "ErrorPage",
      component: ErrorPage
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

//登录拦截
router.beforeEach((to, from, next) => {
  try {
    if (to.meta.requireLogin) {
      if (store.getters.adminToken) {
        !isConnection && Connection(store.getters.adminToken);
        isConnection = true;
        // SET_TOKEN(store.getters.adminToken);
        // // setTimeout(() => {
        // // }, 2000);
        // console.log(Vue.$socket);
        next();
      } else {
        next({
          path: "/login",
          query: { redirect: to.fullPath }
        });
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export default router;
