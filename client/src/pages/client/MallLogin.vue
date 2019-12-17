<template>
  <div
    class="ClientLogin"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <div class="content">
      <h3>{{ $t("system.title") }}</h3>
      <div class="tag">
        <span @click="setIndex(0)" :class="{ selected: curIndex === 0 }">{{
          $t("system.login")
        }}</span>
        <span @click="setIndex(1)" :class="{ selected: curIndex === 1 }">{{
          $t("system.register")
        }}</span>
      </div>
      <div class="formBox" v-show="curIndex === 0">
        <input ref="account" type="text" :placeholder="$t('system.account')" />
        <input ref="pwd" type="password" :placeholder="$t('system.pwd')" />
        <button @click="login">{{ $t("system.login") }}</button>
      </div>
      <div class="formBox" v-show="curIndex === 1">
        <input
          ref="signEmail"
          type="text"
          :placeholder="$t('system.请输入注册的邮箱')"
        />
        <input
          ref="signName"
          type="text"
          :placeholder="$t('system.请输入昵称')"
        />
        <input
          ref="signPwd"
          type="password"
          :placeholder="$t('system.请输入密码')"
        />
        <!-- <input
          ref="signRecipient"
          type="text"
          :placeholder="$t('system.请输入收件人姓名')"
        />
        <input
          ref="signAddress"
          type="text"
          :placeholder="$t('system.请输入收件地址')"
        /> -->
        <input
          ref="signPhone"
          type="text"
          :placeholder="$t('system.请输入联系电话')"
        />
        <button @click="signup">{{ $t("system.register") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { getClientSize } from "../../util/util";
import { login, signup } from "@/api/client";
import { isEmpty } from "@/utils";
import { validateEmail, validatePhone } from "@/utils/validate";

export default {
  name: "ClientLogin",
  computed: {
    width() {
      return getClientSize().width;
    },
    height() {
      return getClientSize().height;
    }
  },
  data() {
    return {
      curIndex: 0
    };
  },
  methods: {
    ...mapMutations({
      setClientName: "SET_CLIENT_NAME",
      setClientToken: "SET_CLIENT_TOKEN"
    }),
    setIndex(index) {
      if (index === this.curIndex) {
        return;
      }
      this.curIndex = index;
    },
    login() {
      const account = this.$refs.account.value;
      const pwd = this.$refs.pwd.value;
      const res = login({
        account: account,
        pwd: pwd
      });
      res
        .then(data => {
          this.setClientName(data.name);
          this.setClientToken(data.token);
          this.$router.push("/");
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    signup() {
      if (
        isEmpty(this.$refs.signEmail.value) ||
        isEmpty(this.$refs.signName.value) ||
        isEmpty(this.$refs.signPwd.value) ||
        isEmpty(this.$refs.signPhone.value)
      ) {
        this.$message.info("Please enter content in the input field");
        return;
      }

      if (!validateEmail(this.$refs.signEmail.value)) {
        this.$message.info("Please enter the correct email address");
        return;
      }

      if (!validatePhone(this.$refs.signPhone.value)) {
        this.$message.info("Please enter the correct phone number");
        return;
      }

      const res = signup({
        email: this.$refs.signEmail.value,
        nickname: this.$refs.signName.value,
        pwd: this.$refs.signPwd.value,
        // recipient: this.$refs.signRecipient.value,
        // address: this.$refs.signAddress.value,
        phone: this.$refs.signPhone.value
      });
      res
        .then(data => {
          this.setClientName(data.name);
          this.setClientToken(data.token);
          this.$router.push("/");
        })
        .catch(e => {
          this.$message.error(e);
        });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.ClientLogin {
  background-color: @bgColor;
  position: relative;
  .content {
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -180px;
    margin-left: -150px;
    text-align: center;
    overflow: hidden;
    .formBox {
      margin: 15px;
    }
    h3 {
      color: @secondColor;
      font-size: 36px;
    }
    .tag {
      margin-top: 20px;
      color: @fontDefaultColor;
      margin-bottom: 20px;
      span {
        display: inline-block;
        width: 50px;
        text-align: center;
        margin: 0 10px;
        padding: 10px 0;
        cursor: pointer;
      }
      .selected {
        border-bottom: 2px solid @secondColor;
        color: @secondColor;
      }
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
      line-height: 34px;
      color: #fff;
      cursor: pointer;
      margin-top: 10px;
    }
  }
}
</style>
