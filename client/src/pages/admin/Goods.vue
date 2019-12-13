<template>
  <div class="Goods container-box-public">
    <el-tabs
      v-loading="loading"
      v-model="curIndex"
      type="card"
      addable
      @edit="onTabsEdit"
      @tab-click="onChangeTag"
    >
      <template v-if="goodsModuleList.length">
        <el-tab-pane :key="index" v-for="(item, index) in goodsModuleList">
          <span slot="label"
            ><i class="el-icon-goods"></i> {{ item.typeName }}</span
          >
          <div class="content">
            <ul class="clear">
              <li v-for="(item, index) in goodsList" :key="'goods' + item.id">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="item.img"
                  :preview-src-list="
                    goodsList.map(item => {
                      return item.img;
                    })
                  "
                >
                </el-image>
                <span style="font-weight:700">{{ item.name }}</span>
                <div>
                  <el-button
                    type="primary"
                    plain
                    @click="navTo('/goods/' + item.id)"
                    >{{ $t("public.edit") }}
                  </el-button>
                  <el-button
                    type="danger"
                    plain
                    @click="deleteGoods(item.id)"
                    >{{ $t("public.delete") }}</el-button
                  >
                </div>
              </li>
              <li>
                <div class="addGoods" @click="navTo('/goods/new')">
                  <i class="el-icon-circle-plus"></i>
                  {{ $t("Goods.addNewGood") }}
                </div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
      </template>
      <template v-else>
        <NoData />
      </template>
    </el-tabs>
    <Popup :title="$t('Goods.addGoodType')" @popupClose="closePopup" v-show="popupShow">
      <div class="popupContent" slot="popupContent">
        <input type="text" ref="typeInput" :placeholder="$t('Goods.请输入类目名称')" />
        <button @click="addConfirm">{{ $t('public.confirm') }}</button>
      </div>
    </Popup>
  </div>
</template>

<script>
import { getGoods, getTypes, addType, deleteGoods } from "../../api/admin";
import Popup from "../../components/Popup";
import NoData from "./../../components/NoData";

export default {
  name: "Goods",
  components: {
    Popup,
    NoData
  },
  data() {
    return {
      loading: false,
      goodsList: [],
      goodsModuleList: [],
      popupShow: false,
      curIndex: 0
    };
  },
  methods: {
    onChangeTag(tab) {
      this.changeTag(tab.index);
    },
    changeTag(index) {
      this.loading = true;
      const res = getGoods(this.goodsModuleList[index].type);
      res
        .then(goods => {
          this.loading = false;
          this.goodsList = goods;
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    },
    getTypes() {
      const res = getTypes();
      res
        .then(data => {
          this.goodsModuleList = data.map(item => {
            return {
              type: item.id,
              typeName: item.name
            };
          });
          this.goodsModuleList.length && this.changeTag(this.curIndex);
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    addType() {
      this.popupShow = true;
    },
    closePopup() {
      this.popupShow = false;
    },
    addConfirm() {
      const val = this.$refs.typeInput.value;
      const res = addType({
        name: val
      });
      res
        .then(() => {
          this.$message.success("添加成功!");
          this.getTypes();
          this.closePopup();
        })
        .catch(e => {
          console.log(e);
        });
    },
    navTo(route) {
      this.$router.push(route);
    },
    deleteGoods(id) {
      const res = deleteGoods(id);
      res
        .then(() => {
          this.goodsList.map((item, index) => {
            if (item.id === id) {
              this.goodsList.splice(index, 1);
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    onTabsEdit(targetName, action) {
      if (action === "add") {
        this.popupShow = true;
      }
      // if (action === "remove") {// delete options
      // let tabs = this.editableTabs;
      // let activeName = this.editableTabsValue;
      // if (activeName === targetName) {
      //   tabs.forEach((tab, index) => {
      //     if (tab.name === targetName) {
      //       let nextTab = tabs[index + 1] || tabs[index - 1];
      //       if (nextTab) {
      //         activeName = nextTab.name;
      //       }
      //     }
      //   });
      // }
      // this.editableTabsValue = activeName;
      // this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      // }
    }
  },
  mounted() {
    this.getTypes();
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.Goods {
  header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    span {
      float: left;
    }
    button {
      float: right;
      background-color: #337da4;
      color: white;
      border: none;
      width: 80px;
      height: 30px;
      border-radius: 5px;
    }
  }
  .content {
    position: relative;
    background-color: white;
    width: 100%;
    top: -2px;
    ul {
      padding: 10px;
      li {
        float: left;
        display: inline-block;
        width: 200px;
        text-align: center;
        margin: 0 10px 20px 10px;
        img {
          width: 100%;
          height: 200px;
          border: 1px solid @borderColor;
        }
        span {
          font-size: 13px;
          display: block;
          margin: 10px 0;
          color: @fontDefaultColor;
        }
        .normalBtn {
          width: 50px;
          height: 25px;
          color: @mainColor;
          border: 1px solid @mainColor;
          background-color: white;
          border-radius: 5px;
          margin-right: 5px;
        }
        .deleteBtn {
          width: 50px;
          height: 25px;
          color: @falseColor;
          border: 1px solid @falseColor;
          background-color: white;
          border-radius: 5px;
        }
        .addGoods {
          width: 100%;
          height: 165px;
          line-height: 165px;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          color: @fontDefaultColor;
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
  .popupContent {
    padding: 20px;
    input {
      display: block;
      width: 200px;
      height: 30px;
      border: none;
      border-bottom: 2px solid #333333;
      margin-top: 20px;
    }
    button {
      display: block;
      margin: 30px auto 0;
      background-color: #333333;
      color: white;
      border: none;
      width: 80px;
      height: 30px;
      border-radius: 5px;
    }
  }
}
</style>
