<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <img
            :src="
              'https://avatar-static.segmentfault.com/288/089/2880895340-5d89b6312c336_huge256'
            "
            class="user-avatar"
          />
          <span class="user-name">
            {{ adminName }}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t("layout.表盘") }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/system/editAdmin">
            <el-dropdown-item>{{ $t("layout.修改资料") }}</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item divided>
            <span style="display:block;" @click="onChangeLanguage">{{
              language
            }}</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{
              $t("layout.登出")
            }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import Breadcrumb from "./Breadcrumb";
import Hamburger from "./Hamburger";
import { setup as languageSetup } from "@/locales/admin";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "adminName", "language"])
  },
  methods: {
    ...mapMutations({
      adminLogout: "ADMIN_LOGOUT"
    }),
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.adminLogout();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    onChangeLanguage() {
      console.log(123123);
      languageSetup(this.language == "zh" ? "en" : "zh");
      this.$store.dispatch(
        "app/changeLanguage",
        this.language == "zh" ? "en" : "zh"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        .user-avatar,
        .user-name {
          vertical-align: middle;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
