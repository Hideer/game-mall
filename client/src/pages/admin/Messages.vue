<template>
  <div class="Messages container-box-public">
    <el-tabs v-model="activeName" @tab-click="changeTag" v-loading="loading">
      <el-tab-pane v-for="item in tags" :key="item" :label="item">
        <div class="content">
          <template v-if="activeName == 0">
            <ul class="msgList" v-if="noReplyMsgList && noReplyMsgList.length">
              <li
                v-for="(item, index) in noReplyMsgList"
                :key="'noReply' + item.id"
                class="clear box-shadow-public"
              >
                <img :src="item.user.headimg" alt="" />
                <div class="info">
                  <span class="name">{{ item.user.name }}</span>
                  <div class="goods ellipsis">
                    {{ $t("Orders.goods") }}：{{ item.goods.name }}
                  </div>
                  <p>{{ item.content }}</p>
                </div>
                <div class="operate">
                  <div>{{ item.time }}</div>
                  <button @click="reply(item.id)">
                    {{ $t("Orders.reply") }}
                  </button>
                </div>
              </li>
            </ul>
            <template v-else>
              <NoData />
            </template>
          </template>
          <template v-else>
            <ul class="msgList" v-if="repliedMsgList && repliedMsgList.length">
              <li
                v-for="(item, index) in repliedMsgList"
                :key="'replied' + item.id"
                class="clear box-shadow-public"
              >
                <img :src="item.user.headimg" alt="" />
                <div class="info">
                  <span class="name">{{ item.user.name }}</span>
                  <div class="goods ellipsis">
                    {{ $t("Orders.goods") }}：{{ item.goods.name }}
                  </div>
                  <p>{{ item.content }}</p>
                  <p class="replyContent">
                    {{ $t("Orders.response") + "：" + item.replyContent }}
                  </p>
                </div>
                <div class="operate">
                  <div>{{ item.time }}</div>
                  <span>{{ $t("Orders.replied") }}</span>
                </div>
              </li>
            </ul>
            <template v-else>
              <NoData />
            </template>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>

    <Popup
      :title="$t('Orders.Message-reply')"
      @popupClose="closePopup"
      v-show="popupShow"
    >
      <div class="popupContent" slot="popupContent">
        <textarea
          ref="replyText"
          cols="30"
          rows="10"
          :placeholder="$t('Orders.response')"
        ></textarea>
        <button @click="replyConfirm">{{ $t("public.confirm") }}</button>
      </div>
    </Popup>
  </div>
</template>

<script>
import { getNoReplyMsg, getRepliedMsg, reply } from "../../api/admin";
import Popup from "../../components/Popup";
import NoData from "./../../components/NoData";

export default {
  name: "Messages",
  components: {
    Popup,
    NoData
  },
  computed: {},
  data() {
    return {
      loading: false,
      activeName: 0,
      tags: [this.$t("Orders.noReply"), this.$t("Orders.replied")],
      noReplyMsgList: [],
      repliedMsgList: [],
      curIndex: 0,
      curMsgId: 0,
      popupShow: false
    };
  },
  mounted() {
    this.getNoReplyMsg();
  },
  methods: {
    async changeTag(tab) {
      let index = tab.index;
      if (index == 1) {
        await this.getRepliedMsg();
      } else {
        await this.getNoReplyMsg();
      }
    },
    getNoReplyMsg() {
      this.loading = true;
      const res = getNoReplyMsg();
      res
        .then(msgs => {
          this.loading = false;
          this.noReplyMsgList = msgs;
        })
        .catch(e => {
          this.loading = false;
          this.$message.error(e);
        });
    },
    getRepliedMsg() {
      this.loading = true;
      const res = getRepliedMsg();
      res
        .then(msgs => {
          this.loading = false;
          this.repliedMsgList = msgs;
        })
        .catch(e => {
          this.loading = false;
          this.$message.error(e);
        });
    },
    reply(id) {
      this.popupShow = true;
      this.curMsgId = id;
      this.$refs.replyText.value = "";
    },
    closePopup() {
      this.popupShow = false;
    },
    replyConfirm() {
      const val = this.$refs.replyText.value;
      const res = reply({
        id: this.curMsgId,
        content: val
      });
      res
        .then(() => {
          this.$message.success("Reply to success!");
          this.noReplyMsgList.map((item, index) => {
            if (item.id === this.curMsgId) {
              this.noReplyMsgList.splice(index, 1);
            }
          });
          this.closePopup();
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
.Messages {
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
    padding: 20px;
    .msgList {
      li {
        width: 100%;
        border: 1px solid @borderColor;
        padding: 10px;
        position: relative;
        margin-bottom: 5px;
        img {
          position: absolute;
          width: 48px;
          height: 48px;
          display: inline-block;
          margin-right: 20px;
          top: 50%;
          margin-top: -24px;
        }
        .info {
          display: inline-block;
          margin-left: 70px;
          max-width: 820px;
          font-size: 13px;
          .name {
            font-size: 15px;
          }
          .goods {
            color: @mainColor;
            font-size: 13px;
            margin-top: 10px;
          }
          p {
            margin-top: 10px;
            color: @fontDefaultColor;
          }
          .replyContent {
          }
        }
        .operate {
          display: inline-block;
          width: 150px;
          height: 60px;
          position: absolute;
          margin-top: -30px;
          top: 50%;
          right: 10px;
          text-align: right;
          div {
            text-align: right;
            color: @fontDefaultColor;
            margin-bottom: 15px;
          }
          button {
            width: 50px;
            height: 25px;
            color: @secondColor;
            border: 1px solid @secondColor;
            background-color: white;
            border-radius: 5px;
          }
        }
      }
    }
  }
  .popupContent {
    width: 300px;
    padding: 8px;
    textarea {
      width: 100%;
      height: 100px;
      display: block;
      border: 1px solid @borderColor;
      padding: 3px;
    }
    button {
      display: block;
      width: 70px;
      height: 30px;
      margin: 10px auto 5px;
      background-color: #333333;
      color: white;
      border: none;
    }
  }
}
</style>
