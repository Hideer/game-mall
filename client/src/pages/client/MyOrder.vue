<template>
  <div class="MyOrder">
    <ul class="tagList">
      <li
        :class="{ selected: curIndex === index }"
        v-for="(item, index) in tagList"
        :key="'tag' + index"
        @click="changeIndex(index)"
      >
        {{ item }}
      </li>
    </ul>
    <div class="orderBox">
      <div class="orderTableHeader">
        <span>{{ $t("cart.Blurb") }}</span>
        <span>{{ $t("cart.unit-price") }}</span>
        <span>{{ $t("cart.subtotal") }}</span>
        <span>{{ $t("cart.amount") }}</span>
        <span>{{ $t("cart.operation") }}</span>
      </div>
      <ul class="orderList">
        <li v-for="(item, index) in orderList" :key="'order' + item.id">
          <div class="orderHeader">
            <span class="orderTime">{{ item.createtime }}</span>
            <span class="orderId">{{ $t("cart.orderId") + item.id }}</span>
            <span class="state">{{ tagList[item.state + 1] }}</span>
            <span class="deleteBtn" @click="deleteOrder(item.id)"
              ><i class="iconfont icon-close"
            /></span>
          </div>
          <div class="orderDetail">
            <img :src="item.goods.img" alt="商品图片" />
            <div class="goodsName">
              <p @click="navTo('/mall/goods/' + item.goods.id)">
                {{ item.goods.name }}
              </p>
              <span>{{ item.goods.spec }}</span>
            </div>
            <span class="unitPrice">{{ "￥" + item.goods.unitPrice }}</span>
            <span class="num">{{ item.goodsNum }}</span>
            <span class="amount">{{ "￥" + item.amount }}</span>
            <button v-if="item.state === 0" @click="confirmPay(item.id)">
              {{ $t("public.pay") }}
            </button>
            <button
              v-else-if="item.state === 2"
              @click="confirmReceive(item.id)"
            >
              confirm receipt
            </button>
            <button
              v-else-if="item.state === 3 && !item.hasComment"
              @click="
                showPopup(item.id, item.goods.id, item.goods.goodsDetailId)
              "
            >
              evaluate
            </button>
            <span
              class="hasComment"
              v-else-if="item.state === 3 && item.hasComment"
              >Have evaluation</span
            >
          </div>
        </li>
      </ul>
    </div>
    <Popup title="EVALUTE" @popupClose="closePopup" v-show="popupShow">
      <div class="popupContent" slot="popupContent">
        <div class="scoreBox">
          <span class="tips">grade：</span>
          <i
            class="iconfont icon-collection_fill"
            v-for="(item, index) in 5"
            :key="'star' + index"
            :style="{ color: index + 1 <= curStar ? '#f9bd4f' : 'white' }"
            @mouseover="setCurStar(index + 1)"
            @mouseout="setCurStar(0)"
            @click="confirmStar(index + 1)"
          />
        </div>
        <textarea
          v-model="comment"
          cols="30"
          rows="10"
          placeholder="Please enter comments"
        ></textarea>
        <button @click="sendComment">Publish</button>
      </div>
    </Popup>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getOrderByState,
  deleteOrder,
  confirmReceive,
  pay,
  sendComment
} from "../../api/client";
import Popup from "../../components/Popup";

export default {
  name: "MyOrder",
  components: {
    Popup
  },
  computed: {
    ...mapGetters(["clientToken"])
  },
  data() {
    return {
      tagList: [
        this.$t("cart.全部订单"),
        this.$t("cart.待付款"),
        this.$t("cart.待发货"),
        this.$t("cart.已发货"),
        this.$t("cart.已完成")
      ],
      curIndex: 0,
      orderList: [],
      popupShow: false,
      curOrderId: "",
      curCommentGoodsId: "",
      curCommentGoodsDetailId: "",
      curStar: 0,
      hasClickStar: false,
      comment: ""
    };
  },

  methods: {
    changeIndex(i) {
      this.curIndex = i;
      this.getOrderByState(this.curIndex - 1);
    },
    navTo(route) {
      this.$router.push(route);
    },
    getOrderByState(state) {
      const res = getOrderByState(state, this.clientToken);
      res
        .then(data => {
          this.orderList = data;
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    deleteOrder(orderId) {
      const res = deleteOrder(orderId);
      res
        .then(() => {
          this.$message.info("删除订单成功！");
          this.orderList.map((item, index) => {
            if (item.id === orderId) {
              this.orderList.splice(index, 1);
            }
          });
        })
        .catch(e => {
          this.$message.error(e);
        });
    },

    confirmPay(orderId) {
      const res = pay(orderId);
      res
        .then(() => {
          this.$message.success("支付成功！");
          this.orderList.map((item, index) => {
            if (item.id === orderId) {
              item.state = 1;
            }
          });
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    confirmReceive(orderId) {
      const res = confirmReceive(orderId);
      res
        .then(() => {
          this.$message.info("确认收货成功！");
          this.orderList.map((item, index) => {
            if (item.id === orderId) {
              item.state = 3;
            }
          });
        })
        .catch(e => {
          this.$message.error(e);
        });
    },

    closePopup() {
      this.popupShow = false;
      this.curCommentGoodsId = "";
      this.curOrderId = "";
      this.curCommentGoodsDetailId = "";
      this.hasClickStar = false;
      this.curStar = 0;
      this.comment = "";
    },
    showPopup(orderId, goodsId, goodsDetailId) {
      this.curCommentGoodsId = goodsId;
      this.curOrderId = orderId;
      this.curCommentGoodsDetailId = goodsDetailId;
      this.popupShow = true;
    },
    sendComment() {
      if (this.curStar <= 0 || this.comment == "") {
        this.$message.info("评分和评价不能为空！");
        return;
      }
      const res = sendComment({
        token: this.clientToken,
        orderId: this.curOrderId,
        goodsId: this.curCommentGoodsId,
        goodsDetailId: this.curCommentGoodsDetailId,
        content: this.comment,
        score: this.curStar * 20
      });
      res
        .then(() => {
          this.$message.success("评价成功！");
          for (let order of this.orderList) {
            if (order.id === this.curOrderId) {
              order.hasComment = true;
            }
          }
          this.closePopup();
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    setCurStar(star) {
      if (this.hasClickStar) {
        return;
      }
      this.curStar = star;
    },
    confirmStar(star) {
      this.curStar = star;
      this.hasClickStar = true;
    }
  },

  mounted() {
    this.getOrderByState(-1);
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.MyOrder {
  .tagList {
    li {
      text-align: center;
      display: inline-block;
      font-weight: 550;
      font-size: 18px;
      border-bottom: 2px solid @borderColor;
      cursor: pointer;
      padding: 10px 20px;
      position: relative;
      &:after {
        top: 12px;
        right: 0;
        position: absolute;
        content: "";
        width: 1px;
        height: 15px;
        background-color: @borderColor;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
    }
    .selected {
      color: @thirdColor;
      border-bottom: 2px solid @thirdColor;
    }
  }
  .orderBox {
    width: 100%;
    margin-top: 20px;
    .orderTableHeader {
      width: 100%;
      height: 40px;
      background-color: #f5f5f5;
      border: 1px solid @borderColor;
      color: @fontDefaultColor;
      font-size: 14px;
      line-height: 40px;
      span {
        display: inline-block;
        width: 14%;
        &:first-child {
          width: 40%;
          text-align: center;
        }
      }
    }
    .orderList {
      width: 100%;
      li {
        border: 1px solid @borderColor;
        font-size: 13px;
        margin-top: 10px;
        .orderHeader {
          background-color: #f1f1f1;
          height: 40px;
          line-height: 40px;
          padding: 0 5px;
          .orderTime {
            font-weight: 600;
          }
          .orderId,
          .state {
            margin-left: 10px;
          }
          .deleteBtn {
            float: right;
            cursor: pointer;
            i {
            }
          }
        }
        .orderDetail {
          width: 100%;
          padding: 10px;
          position: relative;
          overflow: hidden;
          img {
            width: 84px;
            height: 84px;
            display: inline-block;
          }
          .goodsName {
            display: inline-block;
            margin-left: 5px;
            width: 230px;
            vertical-align: top;
            p {
              cursor: pointer;
              line-height: 20px;
              &:hover {
                text-decoration: underline;
              }
            }
            span {
              color: @fontDefaultColor;
              display: block;
              margin-top: 10px;
            }
          }
          .unitPrice,
          .num,
          .amount,
          .hasComment {
            display: inline-block;
            vertical-align: top;
            width: 15%;
            height: 85px;
            line-height: 85px;
            text-align: center;
          }
          button {
            position: absolute;
            right: 90px;
            bottom: 40px;
            width: 70px;
            height: 30px;
            border-radius: 3px;
            background-color: @thirdColor;
            color: white;
            border: none;
          }
        }
      }
    }
  }
  .popupContent {
    padding: 10px;
    .scoreBox {
      width: 100%;
      height: 50px;
      position: relative;
      line-height: 50px;
      text-align: left;
      .tips {
        font-size: 15px;
        vertical-align: middle;
        display: inline-block;
      }
      i {
        cursor: pointer;
        vertical-align: middle;
        display: inline-block;
        font-size: 25px;
        margin-right: 5px;
        -webkit-text-stroke: 1px #f9bd4f;
      }
    }
    textarea {
      width: 400px;
      height: 80px;
      padding: 5px;
      border: 1px solid @borderColor;
      display: block;
      margin-top: 10px;
    }
    button {
      display: block;
      margin: 10px auto;
      width: 70px;
      height: 30px;
      border-radius: 3px;
      background-color: #313541;
      color: white;
      border: none;
    }
  }
}
</style>
