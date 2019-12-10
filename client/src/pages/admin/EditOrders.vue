<template>
  <div class="EditOrders container-box-public">
    <div class="content">
      <el-form ref="form" :model="ordersForm" label-width="100px">
        <el-form-item label="订单号:">
          <span class="val">{{ id }}</span>
        </el-form-item>
        <el-form-item label="商品名称：">
          <span class="val">{{ goods }}</span>
        </el-form-item>
        <el-form-item label="总金额：">
          <span class="val">{{ "¥ " + amount }}</span>
        </el-form-item>
        <el-form-item label="规格：">
          <!-- <Radio
            v-for="(item, index) in spec"
            :key="item.id"
            v-model="temSpecId"
            :initVal="temSpecId"
            radioName="spec"
            :radioVal="item.id"
          >
            <span class="tips" slot="tips">{{ item.specName }}</span>
          </Radio> -->
          <el-radio-group v-model="temSpecId" size="small">
            <el-radio-button
              v-for="item in spec"
              :label="item.id"
              :key="item.id"
              >{{ item.specName }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量：">
          <el-input-number
            v-model.trim.number="temNum"
            :min="1"
            :max="999"
            label="库存量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="订单状态：">
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
          <el-button type="primary" @click="saveChange">保存修改</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="inputBox">
        <span>订单号：</span>
        <span class="val">{{id}}</span>
      </div>
      <div class="inputBox">
        <span>商品名称：</span>
        <span class="val">{{goods}}</span>
      </div>
      <div class="inputBox">
        <span>总金额：</span>
        <span class="val">{{'¥'+amount}}</span>
      </div>
      <div class="inputBox">
        <span>规格：</span>
        <Radio v-for="(item,index) in spec" :key="item.id" v-model="temSpecId" :initVal="temSpecId" radioName="spec" :radioVal="item.id">
          <span class="tips" slot="tips">{{item.specName}}</span>
        </Radio>
      </div>
      <div class="inputBox">
        <span>数量：</span>
        <NumberInput v-model="temNum" :initNum="temNum" :min="1" :max="999"/>
      </div>
      <div class="inputBox">
        <span>订单状态：</span>
        <Radio v-for="(item,index) in states" :key="item.id" v-model="temStateId" :initVal="temStateId" radioName="state" :radioVal="item.id">
          <span class="tips" slot="tips">{{item.name}}</span>
        </Radio>
      </div>
      <div class="btnBox">
        <button class="confirmBtn" @click="saveChange">保存修改</button>
        <button class="normalBtn" @click="back">返回</button>
      </div> -->
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
        num: this.temNum
      });
      res
        .then(() => {
          this.$message.success('修改成功')
          this.fetchOrderDetail(this.$route.params.id);
          this.back()
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
