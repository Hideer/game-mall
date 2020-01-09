<template>
  <div class="Orders container-box-public">
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
            :label="$t('Orders.goods-id')"
            prop="id"
            width="100"
          >
          </el-table-column>
          <el-table-column fixed :label="$t('Orders.goods-state')" prop="state">
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
            :label="$t('Member.Niickname')"
            prop="user.nickname"
          >
          </el-table-column>
          <!-- <el-table-column
            show-overflow-tooltip
            :label="$t('Member.Recipient')"
            prop="user.name"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :label="$t('Member.Address')"
            prop="user.address"
          >
          </el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            :label="$t('Member.Phone')"
            prop="user.phone"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :label="$t('Orders.goods')"
            prop="goods"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :label="$t('Orders.goods-spec')"
            prop="spec"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :label="$t('Orders.goods-num')"
            prop="num"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :label="$t('Orders.goods-amount')"
            prop="amount"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :label="$t('Orders.update-time')"
            prop="time"
            width="120"
          >
          </el-table-column>
          <el-table-column fixed="right" align="right" width="240">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                placeholder="Please enter a search phrase"
              >
                <!-- @keyup.enter.native="searchUser" -->
                <!-- <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser"
            ></el-button> -->
              </el-input>
            </template>
            <template slot-scope="scope">
              <el-button @click="editOrder(scope.row)">{{
                $t("public.edit")
              }}</el-button>
              <el-button type="danger" @click="deleteOrder(scope.row.id)">{{
                $t("public.delete")
              }}</el-button>
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
          typeName: i18n.t("Orders.All")
        },
        {
          typeName: i18n.t("Orders.Non-pay")
        },
        {
          typeName: i18n.t("Orders.Unshipped")
        },
        {
          typeName: i18n.t("Orders.Shipped")
        },
        {
          typeName: i18n.t("Orders.Received")
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
          this.loading = false;
          this.orderList = orders;
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    },
    editOrder(item) {
      this.$router.push("/orders/d/" + item.id);
    },
    deleteOrder(id) {
      this.loading = true;
      const res = deleteOrder(id);
      res
        .then(() => {
          this.loading = false;
          this.$message.success("Delete the success!");
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
