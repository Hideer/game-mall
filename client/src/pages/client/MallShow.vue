<template>
  <div class="MallShow">
    <FixedNav v-show="navShouldFixed">
      <div slot="navContent" class="container fixedNavContainer">
        <h3 class="fixedLeft" @click="navTo('/mall/show/index')">
          爱玩-游戏商城
        </h3>
        <ul class="fixedRight">
          <li
            v-for="(item, index) in typeList"
            :key="'type' + item.id"
            :class="{ selected: judgeCurPath(item.id) }"
            @click="selectType(item.id)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </FixedNav>
    <header>
      <ul ref="typeList" class="typeList">
        <li
          v-for="(item, index) in typeList"
          :key="'type' + item.id"
          :class="{ selected: judgeCurPath(item.id) }"
          @click="selectType(item.id)"
        >
          {{ item.name }}
        </li>
      </ul>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTypes, getGoodsList } from "../../api/client";
import FixedNav from "../../components/FixedNav";

export default {
  name: "MallShow",
  components: {
    FixedNav
  },
  computed: {
    curPath() {
      return this.$route.path;
    }
  },
  data() {
    return {
      typeList: [],
      navShouldFixed: false
    };
  },

  methods: {
    navTo(route) {
      this.$router.push(route);
    },
    judgeCurPath(typeId) {
      if (typeId === -1) {
        if (this.curPath.indexOf("/show/index") > -1) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.curPath.indexOf(`/show/goodsList/${typeId}`) > -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    selectType(typeId) {
      //首页
      if (typeId === -1) {
        this.navTo("/mall/show/index");
      } else {
        this.navTo("/mall/show/goodsList/" + typeId + "/all");
      }
    },
    scrollHandle() {
      const top = this.$refs.typeList.getBoundingClientRect().top;
      //还未到顶
      if (top > 0) {
        this.navShouldFixed = false;
      }
      //已经到顶
      else {
        this.navShouldFixed = true;
      }
    }
  },

  mounted() {
    //获取数据
    const res = getTypes();
    res
      .then(data => {
        data.unshift({
          id: -1,
          name: "首页"
        });
        this.typeList = data;
      })
      .catch(e => {
        this.$message.error("输入不能为空！");
      });

    //监听滚动事件
    document.addEventListener("scroll", this.scrollHandle, false);
  },

  destroyed() {
    document.removeEventListener("scroll", this.scrollHandle, false);
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.MallShow {
  width: 100%;
  .container {
    min-width: 1200px;
  }
  .logo {
    display: block;
    margin: -10px auto 30px;
    text-align: right;
    user-select: none;
    vertical-align: middle;
    img {
      display: inline-block;
      width: 33.3%;
      vertical-align: middle;
    }
    .searchBox {
      display: inline-block;
      width: 33.3%;
      vertical-align: middle;
      text-align: left;
      .TipsInput {
        margin-left: 30px;
      }
      .icon-search {
        font-size: 24px;
        font-weight: bold;
        color: @thirdColor;
        cursor: pointer;
        position: relative;
        top: 4px;
      }
    }
  }
  header .typeList {
    width: 100%;
    text-align: center;
    background-color: white;
    padding: 16px 0 26px;
    li {
      display: inline-block;
      width: 60px;
      margin: 0 50px;
      text-align: center;
      height: 30px;
      line-height: 20px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
    }
    .selected {
      color: @thirdColor;
      border-bottom: 3px solid @thirdColor;
    }
  }
  .fixedNavContainer {
    text-align: left;
    .fixedLeft {
      display: inline-block;
      vertical-align: middle;
      width: 15%;
      height: 100%;
      font-size: 22px;
      color: @thirdColor;
      user-select: none;
      line-height: 64px;
      text-align: center;
      cursor: pointer;
    }
    .fixedRight {
      width: 70%;
      height: 100%;
      display: inline-block;
      vertical-align: middle;
      li {
        display: inline-block;
        width: 60px;
        margin: 0 30px;
        text-align: center;
        height: 30px;
        line-height: 20px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        position: relative;
        top: 4px;
      }
      .selected {
        color: @thirdColor;
        border-bottom: 3px solid @thirdColor;
      }
    }
  }
}
</style>
