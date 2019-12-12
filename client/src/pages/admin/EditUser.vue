<template>
  <div class="EditUser container-box-public">
    <!-- <header class="clear">
      <span>用户管理</span>
      <div>
        <input ref="input" type="text" placeholder="输入搜索用户" /><button
          @click="searchUser"
        >
          <i class="iconfont icon-search" />
        </button>
      </div>
    </header>
    <table className="userTable">
      <thead>
        <tr>
          <th>用户ID</th>
          <th>email</th>
          <th>昵称</th>
          <th>性别</th>
          <th>收件人</th>
          <th>收货地址</th>
          <th>联系电话</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in userList" :key="'user' + item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.nickname }}</td>
          <td>{{ item.sex }}</td>
          <td>{{ item.recipient }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.phone }}</td>
          <td>
            <button class="delete" @click="deleteUser(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table> -->
    <!-- :data="
        tableData.filter(
          data =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      " -->
    <div style="padding:20px;" class="box-shadow-public">
      <el-table
        class="table-box-pullic"
        :data="userList"
        style="width: 100%"
        stripe
      >
        <el-table-column show-overflow-tooltip label="用户ID" prop="id">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="email" prop="email">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="昵称" prop="nickname">
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip label="性别" prop="sex">
        </el-table-column> -->
        <el-table-column show-overflow-tooltip label="收件人" prop="recipient">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="收货地址" prop="address">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="联系电话" prop="phone">
        </el-table-column>
        <el-table-column fixed="right" align="right" width="240">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              @keyup.enter.native="searchUser"
              placeholder="输入关键字搜索"
            >
              <!-- <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser"
            ></el-button> -->
            </el-input>
          </template>
          <template slot-scope="scope">
            <el-button @click="editUser(scope.row)">修改</el-button>
            <el-button type="danger" @click="deleteUser(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- user edit -->
    <el-dialog title="会员信息" :visible.sync="editUserFormVisible" width="400px">
      <el-form :model="editUserForm">
        <el-form-item label="会员账号">
          <el-input
            disabled
            v-model="editUserForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="称呢">
          <el-input
            v-model="editUserForm.nickname"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="性别">
          <el-input v-model="editUserForm.sex" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="收件人">
          <el-input
            v-model="editUserForm.recipient"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input
            v-model="editUserForm.address"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="editUserForm.phone"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEdit">修 改</el-button>
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
      this.$confirm("此操作将永久删除该会员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const res = deleteUser(id);
          res
            .then(() => {
              this.$message.success("删除成功");
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
            message: "已取消删除"
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
          this.$message.success("修改成功");
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
