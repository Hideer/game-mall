<template>
  <div
    class="AdminLogin"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <div class="content">
      <h3>{{ $t("login.title") }}</h3>
      <P
        >{{ $t("login.systemInfo") }}
        <!-- |
        <span @click="onChangeLanguage">{{ language }}</span> -->
      </P>
      <input ref="account" type="text" :placeholder="$t('login.account')" />
      <input ref="pwd" type="password" :placeholder="$t('login.pwd')" />
      <button @click="login">{{ $t("login.login") }}</button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getClientSize } from "../../util/util";
import { login } from "../../api/admin";
import { setup as languageSetup } from "@/locales/admin";

export default {
  name: "AdminLogin",
  computed: {
    ...mapGetters(["language"]),
    width() {
      return getClientSize().width;
    },
    height() {
      return getClientSize().height;
    }
  },
  data() {
    return {
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setAdminName: "SET_ADMIN_NAME",
      setAdminToken: "SET_ADMIN_TOKEN"
    }),
    onChangeLanguage() {
      languageSetup(this.language == "zh" ? "en" : "zh");
      this.$store.dispatch(
        "app/changeLanguage",
        this.language == "zh" ? "en" : "zh"
      );
    },
    login() {
      const account = this.$refs.account.value;
      const pwd = this.$refs.pwd.value;
      if (!!!account || !!!pwd) {
        this.$message.error(this.$t("message.info"));
        return;
      }
      const res = login({
        account: account,
        pwd: pwd
      });
      res
        .then(data => {
          this.setAdminName(data.name);
          this.setAdminToken(data.token);
          this.$router.push({ path: this.redirect || "/" });
        })
        .catch(e => {
          console.log(e);
          this.$message.error(e);
        });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.AdminLogin {
  background-color: @bgColor;
  position: relative;
  .content {
    width: 300px;
    height: 360px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -180px;
    margin-left: -150px;
    text-align: center;
    overflow: hidden;
    h3 {
      color: @secondColor;
      font-size: 36px;
    }
    p {
      margin-top: 20px;
      color: @fontDefaultColor;
      margin-bottom: 20px;
    }
    input {
      border-radius: 0;
      box-shadow: none;
      background: #fff;
      padding: 8px;
      width: 80%;
      border: 1px solid @borderColor;
      margin-bottom: 10px;
    }
    button {
      width: 80%;
      background: @secondColor;
      box-shadow: none;
      border: 0;
      border-radius: 3px;
      line-height: 41px;
      color: #fff;
      cursor: pointer;
      margin-top: 8px;
    }
  }
}
</style>
