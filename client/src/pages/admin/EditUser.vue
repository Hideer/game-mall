<template>
  <div class="EditUser container-box-public">
    <div style="padding:20px;" class="box-shadow-public">
      <el-table
        class="table-box-pullic"
        :data="userList"
        style="width: 100%"
        stripe
      >
        <el-table-column
          show-overflow-tooltip
          :label="$t('Member.UserID')"
          prop="id"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('Member.Email')"
          prop="email"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('Member.Niickname')"
          prop="nickname"
        >
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip label="性别" prop="sex">
        </el-table-column> -->
        <!-- <el-table-column
          show-overflow-tooltip
          :label="$t('Member.Recipient')"
          prop="recipient"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('Member.Address')"
          prop="address"
        >
        </el-table-column> -->
        <el-table-column
          show-overflow-tooltip
          :label="$t('Member.Phone')"
          prop="phone"
        >
        </el-table-column>
        <el-table-column fixed="right" align="right" width="240">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              @keyup.enter.native="searchUser"
              placeholder="Please enter search keyword"
            >
            </el-input>
          </template>
          <template slot-scope="scope">
            <el-button @click="editUser(scope.row)">{{
              $t("public.modify")
            }}</el-button>
            <el-button type="danger" @click="deleteUser(scope.row.id)">{{
              $t("public.delete")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- user edit -->
    <el-dialog
      :title="$t('Member.MemberInfo')"
      :visible.sync="editUserFormVisible"
      width="400px"
    >
      <el-form :model="editUserForm">
        <el-form-item :label="$t('Member.Email')">
          <el-input
            disabled
            v-model="editUserForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('Member.Niickname')">
          <el-input
            v-model="editUserForm.nickname"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="性别">
          <el-input v-model="editUserForm.sex" autocomplete="off"></el-input>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('Member.Recipient')">
          <el-input
            v-model="editUserForm.recipient"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('Member.Address')">
          <el-input
            v-model="editUserForm.address"
            autocomplete="off"
          ></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('Member.Phone')">
          <el-input
            v-model="editUserForm.phone"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserFormVisible = false">{{
          $t("public.cancel")
        }}</el-button>
        <el-button type="primary" @click="onEdit">{{
          $t("public.confirm")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllUser,
  getSearchUser,
  deleteUser,
  updateUserData
} from "@/api/admin";
import { Connection } from "@/socketio_admin";
export default {
  name: "EditUser",
  computed: {},
  data() {
    return {
      editUserFormVisible: false,
      editUserForm: {},
      userList: [],
      search: ""
    };
  },
  mounted() {
    this.init();
    // console.log(this.$socket);
    // this.$socket.emit('connect', 1)
  },
  methods: {
    init() {
      const res = getAllUser();
      res
        .then(users => {
          this.userList = users;
        })
        .catch(e => {
          console.log(e);
          this.$message.error(e);
        });
    },
    deleteUser(id) {
      this.$confirm("This action will permanently delete the member. Do you want to continue?", "Info", {
        confirmButtonText: "confirm",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          const res = deleteUser(id);
          res
            .then(() => {
              this.$message.success("Delete the success!");
              this.userList.map((item, index) => {
                if (item.id === id) {
                  this.userList.splice(index, 1);
                }
              });
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "undeleted!"
          });
        });
    },
    editUser(item) {
      this.editUserFormVisible = true;
      this.editUserForm = {
        ...item
      };
    },
    onEdit() {
      updateUserData({
        ...this.editUserForm
      })
        .then(data => {
          this.editUserFormVisible = false;
          this.$message.success("modify successfully！");
          this.init();
        })
        .catch(e => {
          console.log(e);
        });
    },
    searchUser() {
      const val = this.search;
      const res = getSearchUser(val);
      res
        .then(data => {
          this.userList = data;
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.EditUser {
  header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    span {
      float: left;
    }
    div {
      height: 20px;
      float: right;
      input {
        border: none;
        border-bottom: 1px solid #337da4;
        background-color: rgba(0, 0, 0, 0);
        width: 180px;
        padding-left: 10px;
      }
      button {
        position: relative;
        top: -1px;
        border: none;
        background-color: rgba(0, 0, 0, 0);
        i {
          font-size: 17px;
          color: #337da4;
        }
      }
    }
  }
}
</style>
