<template>
  <div class="Orders container-box-public">
    <!-- <header class="clear">
  		<span>订单管理</span>
  	</header>
  	<Tag :tagList="tags" @indexChange="changeTag"/>
  	<div class="content">
  		<table class="ordersTable">
	        <thead>
	        	<tr><th>订单号</th><th>用户昵称</th><th>收件人</th><th>收货地址</th><th>联系电话</th><th>商品</th><th>规格</th><th>购买数量</th><th>金额</th><th>订单状态</th><th>更新时间</th><th>操作</th></tr>
	        </thead>
	        <tbody>
	            <tr v-for="(item,index) in orderList" :key="'order'+item.id">
	            	<td>{{item.id}}</td>
	            	<td>{{item.user.nickname}}</td>
	            	<td>{{item.user.name}}</td>
	            	<td>{{item.user.address}}</td>
	            	<td>{{item.user.phone}}</td>
	            	<td>{{item.goods}}</td>
	            	<td>{{item.spec}}</td>
	            	<td>{{item.num}}</td>
	            	<td>{{item.amount}}</td>
	            	<td>{{item.state}}</td>
	            	<td>{{item.time}}</td>
	                <td><button class="normal" @click="editOrder(item.id)">编辑</button><button class="delete" @click="deleteOrder(item.id)">删除</button></td>
	            </tr>
	        </tbody>
	    </table>
  	</div> -->

    <el-tabs
      type="border-card"
      v-model="activeOrderModule"
      @tab-click="changeTag"
      v-loading="loading"
    >
      <el-tab-pane v-for="item in orderModule" :key="item.typeName">
        <!-- <i class="el-icon-s-order"></i> -->
        <span slot="label">{{ item.typeName }}</span>
        <el-table
          class="table-box-pullic"
          :data="orderList"
          style="width: 100%"
          stripe
        >
          <el-table-column
            fixed
            show-overflow-tooltip
            label="订单号"
            prop="id"
            width="100"
          >
          </el-table-column>
          <el-table-column fixed label="订单状态" prop="state">
            <template slot-scope="scope">
              <el-tag
                :type="
                  {
                    未付款: 'info',
                    未发货: 'danger',
                    已发货: '',
                    已到货: 'success'
                  }[scope.row.state]
                "
                >{{ scope.row.state }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="用户昵称"
            prop="user.nickname"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="收件人"
            prop="user.name"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="收货地址"
            prop="user.address"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="联系电话"
            prop="user.phone"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip label="商品" prop="goods">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="规格" prop="spec">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="购买数量" prop="num">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="金额" prop="amount">
          </el-table-column>

          <el-table-column show-overflow-tooltip label="更新时间" prop="time">
          </el-table-column>
          <el-table-column fixed="right" align="right" width="240">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" placeholder="输入关键字搜索">
                <!-- @keyup.enter.native="searchUser" -->
                <!-- <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser"
            ></el-button> -->
              </el-input>
            </template>
            <template slot-scope="scope">
              <el-button @click="editOrder(scope.row.id)">编辑</el-button>
              <el-button type="danger" @click="deleteOrder(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getOrders, deleteOrder } from "../../api/admin";
import Tag from "../../components/Tag";
export default {
  name: "Orders",
  components: {
    Tag
  },
  computed: {},
  data() {
    return {
      loading: false,
      activeOrderModule: 0,
      // tags: ["全部", "未付款", "未发货", "已发货", "已到货"],
      orderList: [],
      search: "",
      orderModule: [
        {
          typeName: "全部"
        },
        {
          typeName: "未付款"
        },
        {
          typeName: "未发货"
        },
        {
          typeName: "已发货"
        },
        {
          typeName: "已到货"
        }
      ]
    };
  },
  methods: {
    changeTag(tab, even) {
      this.loading = true;
      let index = tab ? parseInt(tab.index) : 0;
      const res = getOrders(index - 1);
      res
        .then(orders => {
          this.$message.success("获取成功");
          this.loading = false;
          this.orderList = orders;
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    },
    editOrder(id) {
      this.$router.push("/orders/d/" + id);
    },
    deleteOrder(id) {
      this.loading = true;
      const res = deleteOrder(id);
      res
        .then(() => {
          this.loading = false;
          this.$message.success("删除成功!");
          this.orderList.map((item, index) => {
            if (item.id === id) {
              this.orderList.splice(index, 1);
            }
          });
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    }
  },
  mounted() {
    this.changeTag();
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.Orders {
  header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    span {
      float: left;
    }
  }
  .content {
    width: 100%;
    background-color: white;
    position: relative;
    top: -3px;
    padding: 5px;
    .ordersTable {
      width: 100%;
      th {
        text-align: center;
      }
      tbody {
        tr {
          td {
            max-width: 100px;
            min-width: 30px;
            text-align: center;
            button {
              display: block;
              overflow: hidden;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
