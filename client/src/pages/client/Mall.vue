<template>
  <div class="Mall">
    <header>
      <div class="container clear">
        <span class="title" @click="navTo('/mall')"
          >{{ $t("system.title") }}——{{ $t("system.info") }}
        </span>
        <!-- <NoticeList :notices="notices" /> -->

        <div class="right">
          <div class="searchBox">
            <el-input
              placeholder="请输入商品关键字"
              v-model="searchText"
              class="search-item"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                type="warning"
                @click="searchConfirm"
              ></el-button>
            </el-input>
          </div>
          <template v-if="clientToken">
            <span class="name"
              >{{ $t("system.Welcome") }}，{{ clientName }}</span
            >
            <span @click="navTo('/mall/personal')">{{
              $t("system.My-ZOE")
            }}</span>
            <span @click="logout">{{ $t("system.log-out") }}</span>
          </template>
          <template v-else>
            <div class="system">
              <span @click="navTo('/login')">{{ $t("system.login") }}</span>
              <span @click="navTo('/login')">{{ $t("system.register") }}</span>
            </div>
          </template>
        </div>
      </div>
    </header>
    <div class="content" :style="{ minHeight: clientHeight + 'px' }">
      <div class="container">
        <router-view></router-view>
      </div>
      <div class="fixedAd">
        <ul class="fixedList">
          <li>
            <i class="iconfont icon-collection_fill" />
            <span>The couple and polite</span>
          </li>
          <li>
            <i class="iconfont icon-paixing-copy" />
            <span>Hot commodity</span>
          </li>
          <li>
            <i class="iconfont icon-fabulous" />
            <span>User feedback</span>
          </li>
          <li @click="backToTop" v-show="shouldShowBT">
            <i class="iconfont icon-arrows-4-7" />
            <span>Return to the top</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="bottomInfo">
      <div class="container">
        <div class="service footerItem">
          <p class="title">客户服务</p>
          <span><i class="iconfont icon-people_fill" />在线客服</span>
          <span><i class="iconfont icon-fabulous" />用户反馈</span>
        </div>
        <div class="intro footerItem">
          <p class="title">何为爱玩-游戏商城</p>
          <p class="intro-p">
            爱玩-游戏商城原创生活类电商品牌，秉承李宁一贯的严谨态度，我们深入世界各地，从源头全程严格把控商品生产环节，力求帮消费者甄选到优质的商品
          </p>
          <div>
            关注我们：
            <img
              src="http://yanxuan.nosdn.127.net/60068701f3a380911f237c26c91b39d0.png"
              alt=""
            />
            <img
              src="http://yanxuan.nosdn.127.net/031e783d7ee645b6096980d0bf83079b.png"
              alt=""
            />
            <img
              src="http://yanxuan.nosdn.127.net/0c8759a89cdbd7acf7f2921e6f0fad19.png"
              alt=""
            />
          </div>
        </div>
        <div class="code footerItem">
          <p class="title">扫码下载APP</p>
          <img src="../../assets/img/code.png" alt="" />
          <span>下载领1000元新人礼包</span>
        </div>
      </div>
    </div> -->
    <footer>
      <div class="container">
        <ul class="footerTop">
          <li>
            <img
              src="//yanxuan.nosdn.127.net/e6021a6fcd3ba0af3a10243b7a2fda0d.png"
              alt=""
            />
            <span>Free return and exchange within 30 days</span>
          </li>
          <li>
            <img
              src="//yanxuan.nosdn.127.net/e09c44e4369232c7dd2f6495450439f1.png"
              alt=""
            />
            <span>And buy and send activation codes</span>
          </li>
          <li>
            <img
              src="//yanxuan.nosdn.127.net/e72ed4de906bd7ff4fec8fa90f2c63f1.png"
              alt=""
            />
            <span>Game copyright guarantee</span>
          </li>
        </ul>
        <div class="footerBottom">
          <ul>
            <li>About us</li>
            <li>Help center</li>
            <li>After-sales service</li>
            <li>Distribution and acceptance</li>
            <li>Business cooperation</li>
            <li>Enterprise procurement</li>
            <li>Open platform</li>
            <li>The search is recommended</li>
            <li>link</li>
          </ul>
          <p>XXCopyright © 1996-2018 all rights reserved:XXXXXXXXXXXXXXXXX</p>
        </div>
      </div>
    </footer>
    <div class="bg"></div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { getClientSize, backToTop } from "../../util/util";

import NoticeList from "../../components/NoticeList";
import TipsInput from "../../components/TipsInput";

export default {
  name: "Mall",
  computed: {
    ...mapGetters(["clientToken", "clientName"])
  },
  components: {
    NoticeList,
    TipsInput
  },
  sockets: {
    messageOrder: function({ type = "info", msg = "一个新的提醒" } = {}) {
      this.$notify[type]({
        title: "订单更新提醒",
        // duration: 0,
        message: msg
      });
    }
  },
  data() {
    return {
      notices: [
        "今日疯抢：任天堂Switch仅229元！直减2...",
        "【福利】领1000元APP新人礼"
      ],
      clientHeight: getClientSize().height,
      shouldShowBT: false,
      searchText: "",
      tips: ["aa", "bb", "cc"]
    };
  },

  methods: {
    ...mapMutations({
      clientLogout: "CLIENT_LOGOUT"
    }),
    searchTip(tip) {
      this.$message.warning(tip);
    },
    searchConfirm() {
      if (this.searchText.trim().length <= 0) {
        this.$message.warning("输入不能为空！");
        return;
      }
      this.navTo(`/mall/show/goodsList/0/${this.searchText}`);
    },
    navTo(route) {
      this.$router.push(route);
    },
    logout() {
      this.clientLogout();
      this.$router.go(0);
    },
    backToTop() {
      backToTop();
    },
    watchScrollTop() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 150) {
        this.shouldShowBT = true;
      } else {
        this.shouldShowBT = false;
      }
    }
  },

  mounted() {
    document.addEventListener("scroll", this.watchScrollTop, false);
  },

  watch: {
    searchText(newVal, oldVal) {
      this.searchTextChange(newVal);
    }
  },

  beforeDestroyed() {
    document.removeEventListener("scroll", this.watchScrollTop, false);
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/css/var.less";
.Mall {
  width: 100%;
  .bg {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url("~@/assets/img/bg.jpg") center;
    z-index: -1;
  }
  header {
    width: 100%;
    min-width: 1200px;
    background-color: #191919;
    height: 38px;
    color: @fontShallowColor;
    user-select: none;
    z-index: 9;
    position: absolute;
    left: 0;
    top: 0;
    .container {
      position: relative;
      height: 38px;
      max-width: 1200px;
      margin: 0 auto;
      .title {
        position: absolute;
        left: 0;
        display: inline-block;
        height: 26px;
        top: 50%;
        margin-top: -13px;
        line-height: 26px;
        font-size: 14px;
        cursor: pointer;
      }
      .NoticeListBox {
        position: absolute;
        left: 200px;
      }
      .right {
        position: absolute;
        right: 0;
        height: 26px;
        line-height: 26px;
        top: 4px;
        font-size: 14px;
        span {
          margin-left: 20px;
          cursor: pointer;
        }
        .name {
          cursor: default;
        }
        .system,
        .searchBox {
          display: inline-block;
        }
        .search-item {
          border-radius: 30px;
          overflow: hidden;
        }
      }
    }
  }
  .content {
    padding-top: 40px;
  }
  .fixedAd {
    position: fixed;
    right: 0;
    top: 108px;
    width: 52px;
    .fixedList {
      margin-top: 2px;
      background-color: #ffffff52;
      width: 100%;
      li {
        width: 100%;
        height: 80px;
        text-align: center;
        border-bottom: 1px solid @borderColor;
        cursor: pointer;
        padding-top: 12px;
        i {
          display: block;
          font-size: 24px;
          color: #666666;
        }
        span {
          display: block;
          font-size: 12px;
          color: #666666;
          margin-top: 4px;
        }
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          i {
            color: @thirdColor;
          }
          span {
            color: @thirdColor;
          }
        }
      }
    }
  }
  .bottomInfo {
    width: 100%;
    height: 300px;
    border-top: 1px solid @borderColor;
    overflow: hidden;
    margin-top: 80px;
    .footerItem {
      width: 33%;
      height: 210px;
      position: relative;
      top: 45px;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      color: @fontDefaultColor;
      .title {
        color: @fontDeepColor;
        margin-bottom: 30px;
      }
    }
    .service {
      border-right: 1px solid @borderColor;
      span {
        display: inline-block;
        width: 80px;
        height: 100px;
        border: 1px solid @borderColor;
        text-align: center;
        margin: 0 10px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: @thirdColor;
        }
        i {
          display: block;
          font-size: 30px;
          margin-top: 20px;
          margin-bottom: 10px;
        }
      }
    }
    .intro {
      border-right: 1px solid @borderColor;
      .intro-p {
        font-size: 13px;
        width: 300px;
        margin: 0 auto;
        text-align: left;
        color: @fontDeepColor;
        line-height: 1.8em;
      }
      div {
        text-align: left;
        font-size: 14px;
        margin-left: 47px;
        margin-top: 20px;
        img {
          margin: 0 6px;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    .code {
      img {
        display: block;
        margin: 0 auto;
      }
      span {
        font-size: 12px;
        color: @thirdColor;
        margin-top: 10px;
        display: block;
      }
    }
  }
  footer {
    margin-top: 50px;
    width: 100%;
    height: 208px;
    background-color: #191919;
    color: white;
    overflow: hidden;
    .footerTop {
      padding: 36px 0;
      border-bottom: 1px solid #4f4f4f;
      width: 100%;
      li {
        display: inline-block;
        width: 33%;
        text-align: center;
        img {
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
          font-size: 18px;
          margin-left: 10px;
        }
      }
    }
    .footerBottom {
      color: @fontDefaultColor;
      margin-top: 30px;
      font-size: 13px;
      text-align: center;
      ul {
        li {
          display: inline-block;
          cursor: pointer;
          padding: 0 6px;
          border-right: 2px solid @fontDefaultColor;
          &:last-child {
            border-right: none;
          }
        }
      }
      p {
        margin-top: 5px;
        padding: 5px;
      }
    }
  }
}
</style>
