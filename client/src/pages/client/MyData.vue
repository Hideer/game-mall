<template>
  <div class="MyData">
    <ul>
      <li>
        <span>{{ $t("user.headimg") }}</span>
        <img :src="headimg" alt="headimg" />
      </li>
      <li>
        <span>{{ $t("user.account") }}</span>
        <p>{{ email }}</p>
      </li>
      <li>
        <span>{{ $t("user.nickname") }}</span>
        <input type="text" v-model="nickname" />
      </li>
      <li>
        <span>{{ $t("user.recipient") }}</span>
        <input type="text" v-model="recipient" />
      </li>
      <li>
        <span>{{ $t("user.address") }}</span>
        <input type="text" class="long" v-model="address" />
      </li>
      <li>
        <span>{{ $t("user.phone") }}</span>
        <input type="text" v-model="phone" />
      </li>
      <li>
        <span>{{ $t("user.pwd") }}</span>
        <button @click="showPopup">
          {{ $t("public.modify") }}
        </button>
      </li>
    </ul>
    <button @click="updateUserData" class="saveBtn">
      {{ $t("public.save") }}
    </button>
    <Popup
      :title="$t('user.modifyPwd')"
      @popupClose="closePopup"
      v-show="popupShow"
    >
      <div class="popupContent" slot="popupContent">
        <input
          type="password"
          style="height:30px"
          v-model="oldPwd"
          placeholder="Please enter the original password"
        />
        <input
          type="password"
          style="height:30px"
          v-model="newPwd"
          placeholder="Please enter your new password"
        />
        <input
          type="password"
          style="height:30px"
          v-model="confirmPwd"
          placeholder="Please enter a new password again"
        />
        <button @click="updatePwd" style="height:30px;line-height: 30px;">
          {{ $t("public.confirm") }}
        </button>
      </div>
    </Popup>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getUserData, updateUserData, updatePwd } from "../../api/client";
import Popup from "../../components/Popup";

export default {
  name: "MyData",
  components: {
    Popup
  },
  computed: {
    ...mapGetters(["clientToken"])
  },
  data() {
    return {
      id: "",
      headimg: "",
      email: "",
      nickname: "",
      recipient: "",
      address: "",
      phone: "",
      popupShow: false,
      oldPwd: "",
      newPwd: "",
      confirmPwd: ""
    };
  },

  methods: {
    ...mapMutations({
      setClientName: "SET_CLIENT_NAME"
    }),
    updateUserData() {
      const res = updateUserData({
        id: this.id,
        nickname: this.nickname,
        recipient: this.recipient,
        address: this.address,
        phone: this.phone
      });
      res
        .then(() => {
          this.$message.success("修改成功");
          this.setClientName(this.nickname);
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    closePopup() {
      this.popupShow = false;
    },
    showPopup() {
      this.popupShow = true;
    },
    updatePwd() {
      if (this.newPwd !== this.confirmPwd) {
        this.$message.info("两次输入的密码不一致！");
        return;
      }
      const res = updatePwd({
        id: this.id,
        oldPwd: this.oldPwd,
        newPwd: this.newPwd,
        confirmPwd: this.confirmPwd
      });
      res
        .then(() => {
          this.oldPwd = "";
          this.newPwd = "";
          this.confirmPwd = "";
          this.closePopup();
          this.$message.success("修改密码成功");
        })
        .catch(e => {
          this.$message.error(e);
        });
    }
  },

  mounted() {
    const res = getUserData(this.clientToken);
    res
      .then(data => {
        this.id = data.id;
        this.headimg = data.headimg;
        this.email = data.email;
        this.nickname = data.nickname;
        this.recipient = data.recipient;
        this.address = data.address;
        this.phone = data.phone;
      })
      .catch(e => {
        this.$message.error(e);
      });
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.MyData {
  ul {
    width: 100%;
    overflow: hidden;
    li {
      margin-bottom: 30px;
      &:first-child {
        height: 60px;
        line-height: 60px;
        span {
          position: relative;
          bottom: 18px;
        }
      }
      span {
        display: inline-block;
        width: 100px;
        height: 20px;
      }
      img {
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      p {
        display: inline-block;
      }
      input {
        width: 280px;
        border: none;
        text-align: center;
        border-bottom: 2px solid @thirdColor;
      }
      .long {
      }
      button {
        background-color: white;
        border: 1px solid @thirdColor;
        color: @thirdColor;
        width: 80px;
        height: 30px;
      }
    }
  }
  .saveBtn {
    background-color: @thirdColor;
    border: none;
    color: white;
    width: 110px;
    height: 35px;
    display: block;
    margin: 10px auto;
  }
  .popupContent {
    padding: 20px;
    input {
      display: block;
      border: none;
      border-bottom: 1px solid #313541;
      margin-bottom: 16px;
      font-size: 13px;
      padding: 5px;
      width: 200px;
    }
    button {
      background-color: #333333;
      border: none;
      color: white;
      width: 80px;
      height: 32px;
      display: block;
      margin: 20px auto 5px;
    }
  }
}
</style>
