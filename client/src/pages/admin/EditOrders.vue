<template>
  <div class="EditOrders container-box-public">
    <div class="content">
      <el-form ref="form" :model="ordersForm" label-width="100px">
        <el-form-item :label="$t('Orders.goods-id')">
          <span class="val">{{ id }}</span>
        </el-form-item>
        <el-form-item :label="$t('Goods.GoodsName')">
          <span class="val">{{ goods }}</span>
        </el-form-item>
        <el-form-item :label="$t('Orders.goods-amount')">
          <span class="val">{{ "¥ " + amount }}</span>
        </el-form-item>
        <el-form-item :label="$t('Orders.goods-spec')">
          <el-radio-group v-model="temSpecId" size="small">
            <el-radio-button
              v-for="item in spec"
              :label="item.id"
              :key="item.id"
              >{{ item.specName }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('Orders.goods-num')">
          <el-input-number
            v-model.trim.number="temNum"
            :min="1"
            :max="999"
          ></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('Orders.goods-state')">
          <el-radio-group v-model="temStateId" size="small">
            <el-radio-button
              v-for="item in states"
              :label="item.id"
              :key="item.id"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveChange">{{
            $t("public.save")
          }}</el-button>
          <el-button @click="back">{{ $t("public.return") }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getAOrder, changeOrder } from "../../api/admin";
import Radio from "../../components/Radio";
import NumberInput from "../../components/NumberInput";

export default {
  name: "EditOrders",
  components: {
    Radio,
    NumberInput
  },
  computed: {
    amount() {
      let price = 0;
      this.spec.map((item, index) => {
        if (item.id === this.temSpecId) {
          price = item.unitPrice;
        }
      });
      return this.temNum * price;
    }
  },
  data() {
    return {
      ordersForm: {},
      id: this.$route.params.id,
      goods: "",
      spec: [],
      states: [],
      curSpecId: "",
      curStateId: "",
      temSpecId: "",
      temNum: 0,
      temStateId: 0
    };
  },
  methods: {
    fetchOrderDetail(id) {
      const res = getAOrder(id);
      res
        .then(order => {
          this.goods = order.goods;
          this.spec = order.spec;
          this.states = order.states;
          this.curSpecId = order.curSpec.id;
          this.curStateId = order.curState.id;
          this.temSpecId = order.curSpec.id;
          this.temNum = Number(order.num);
          this.temStateId = order.curState.id;
        })
        .catch(e => {
          this.$message.error(e);
        });
    },

    back() {
      this.$router.go(-1);
    },

    saveChange() {
      const res = changeOrder({
        id: this.$route.params.id,
        state: this.temStateId,
        spec: this.temSpecId,
        num: this.temNum,
      });
      res
        .then(() => {
          this.$message.success("修改成功");
          this.fetchOrderDetail(this.$route.params.id);
          this.back();
        })
        .catch(e => {
          this.$message.error(e);
        });
    }
  },
  mounted() {
    this.fetchOrderDetail(this.$route.params.id);
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.EditOrders {
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
    padding: 10px;
    .inputBox {
      margin-bottom: 30px;
      span {
        width: 90px;
        display: inline-block;
        color: @fontDefaultColor;
        font-weight: 600;
      }
      .Radio /deep/ input:checked + .tipsBox {
        &:after {
          background-color: #337da4;
        }
      }
      .tips {
        font-weight: normal;
        width: auto;
        font-size: 13px;
        position: relative;
        left: 3px;
      }
      .val {
        width: auto;
        font-weight: 500;
        font-size: 14px;
        color: @fontDeepColor;
      }
      .NumberInput {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .btnBox {
      margin: auto;
      display: block;
      width: 250px;
    }
    .confirmBtn {
      display: inline-block;
      margin-right: 30px;
      background-color: #337da4;
      color: white;
      border: none;
      width: 100px;
      height: 30px;
      border-radius: 5px;
      cursor: pointer;
    }
    .normalBtn {
      display: inline-block;
      background-color: grey;
      color: white;
      border: none;
      width: 100px;
      height: 30px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
</style>
