<template>
  <div class="EditAdmin container-box-public">
    <el-form ref="modifyAdminForm" :model="modifyAdminForm" style="width:300px">
      <el-form-item :label="$t('modifyUser.原密码')" prop="oldPwd">
        <el-input v-model="modifyAdminForm.oldPwd" show-password></el-input>
      </el-form-item>
      <el-form-item :label="$t('modifyUser.新密码')" prop="newPwd">
        <el-input v-model="modifyAdminForm.newPwd" show-password></el-input>
      </el-form-item>
      <el-form-item :label="$t('modifyUser.确认新密码')" prop="confirmPwd">
        <el-input v-model="modifyAdminForm.confirmPwd" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmChange">{{
          $t("public.confirm")
        }}</el-button>
        <el-button @click="resetForm('modifyAdminForm')">{{
          $t("public.reset")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePwd } from "../../api/admin";
import { mapGetters } from "vuex";

export default {
  name: "EditAdmin",
  computed: {
    ...mapGetters(["adminToken"])
  },
  data() {
    return {
      modifyAdminForm: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      }
    };
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    confirmChange() {
      const adminToken = this.adminToken;
      const res = changePwd({
        adminToken,
        ...this.modifyAdminForm
      });
      res
        .then(() => {
          this.$message.success("Successful modification!");
          this.resetForm("modifyAdminForm");
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
.EditAdmin {
  header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    span {
      float: left;
    }
  }
  .content {
    margin-top: 20px;
    width: 290px;
    text-align: center;
    .inputBox {
      text-align: left;
      margin-bottom: 20px;
      span {
        color: @fontDefaultColor;
        font-size: 13px;
        display: inline-block;
        width: 90px;
      }
      input {
      }
    }
    button {
      background-color: #337da4;
      color: white;
      border: none;
      width: 80px;
      height: 30px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
</style>
