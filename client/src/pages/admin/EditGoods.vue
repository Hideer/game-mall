<template>
  <div class="EditGoods container-box-public">
    <el-form ref="form" :model="goodsForm" label-width="80px">
      <el-form-item label="商品名称">
        <el-input
          v-model="goodsForm.goodsName"
          placeholder="请输入商品名称"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="选择类目">
        <el-select v-model="goodsForm.temTypeId" placeholder="请选择类别">
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片地址">
        <el-input
          v-model="goodsForm.goodsImg"
          placeholder="请输入图片地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格详情">
        <!-- <el-input v-model="goodsForm.goodsImg" placeholder="请输入图片地址"></el-input> -->
        <ul class="speclist-content">
          <li v-for="(item, index) in specList" :key="index">
            <el-input
              style="width:140px"
              v-model="item.specName"
              placeholder="请输入规格名称"
              maxlength="12"
              show-word-limit
            ></el-input>
            <span>库存量：</span>
            <el-input-number
              v-model.trim.number="item.stockNum"
              :min="1"
              label="库存量"
            ></el-input-number>
            <span>价格：</span>
            <el-input-number
              v-model.trim.number="item.unitPrice"
              :min="1"
              label="价格￥"
            ></el-input-number>
            <el-button
              v-show="specList.length > 1"
              @click="deleteSpec(item.specName)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </li>
          <li class="addSpec">
            <el-button type="primary" @click="showPopup">添加规格</el-button>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="详情描述">
        <el-input
          type="textarea"
          v-model="goodsForm.desc"
          placeholder="请输入简单描述"
          rows="4"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveChange">保存修改</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
    <Popup title="添加规格" @popupClose="closePopup" v-show="popupShow">
      <div class="popupContent" slot="popupContent">
        <input type="text" ref="specNameInput" placeholder="请输入规格名称" />
        <input type="text" ref="stockNumInput" placeholder="请输入库存量" />
        <input type="text" ref="priceInput" placeholder="请输入单价" />
        <button @click="addConfirm">确认</button>
      </div>
    </Popup>
  </div>
</template>

<script>
import Popup from "../../components/Popup";
import {
  getTypes,
  getGoodsInfo,
  addGoods,
  addSpec,
  deleteSpec,
  updateGoods
} from "../../api/admin";
export default {
  name: "EditGoods",
  components: {
    Popup
  },
  data() {
    return {
      popupShow: false,
      id: this.$route.params.id,
      types: [],
      goodsForm: {
        goodsName: "",
        initTypeId: "",
        temTypeId: "",
        goodsImg: "",
        desc: ""
      },
      specList: [
        {
          specName: "默认",
          stockNum: 0,
          unitPrice: 0
        }
      ]
    };
  },
  mounted() {
    this.getTypes();
    //新建商品
    if (this.id === "new") {
    } else {
      const res = getGoodsInfo(this.id);
      res
        .then(data => {
          this.goodsForm.temTypeId = data.goods.typeId;
          this.goodsForm.initTypeId = data.goods.typeId;
          this.goodsForm.goodsName = data.goods.name;
          this.goodsForm.goodsImg = data.goods.img;
          this.goodsForm.desc = data.goods.desc;

          this.specList = data.specs;
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  methods: {
    getTypes() {
      const res = getTypes();
      res
        .then(data => {
          this.types = data;
        })
        .catch(e => {
          alert(e);
        });
    },
    back() {
      this.$router.go(-1);
    },
    saveChange() {
      if (this.id === "new") {
        const res = addGoods({
          name: this.goodsForm.goodsName,
          typeId: this.goodsForm.temTypeId,
          img: this.goodsForm.goodsImg,
          desc: this.goodsForm.desc,
          specList: this.specList
        });
        res
          .then(() => {
            this.$message.success("创建商品成功！");
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        const res = updateGoods({
          id: this.id,
          name: this.goodsForm.goodsName,
          typeId: this.goodsForm.temTypeId,
          img: this.goodsForm.goodsImg,
          desc: this.goodsForm.desc,
          specList: this.specList
        });
        res
          .then(() => {
            this.$message.success("修改成功！");
          })
          .catch(e => {
            console.log(e);
          });
      }
      this.back();
    },
    closePopup() {
      this.popupShow = false;
    },
    addConfirm() {
      if (this.id === "new") {
        const name = this.$refs.specNameInput.value;
        const stock = this.$refs.stockNumInput.value;
        const price = this.$refs.priceInput.value;
        this.specList.push({
          specName: name,
          stockNum: stock,
          unitPrice: price
        });
        this.closePopup();
      } else {
        const res = addSpec({
          goodsId: this.id,
          specName: this.$refs.specNameInput.value,
          stockNum: this.$refs.stockNumInput.value,
          unitPrice: this.$refs.priceInput.value
        });
        res
          .then(spec => {
            this.specList.push(spec);
            this.closePopup();
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    showPopup() {
      this.popupShow = true;
    },
    deleteSpec(specname) {
      if (this.id === "new") {
        this.specList.map((item, index) => {
          if (item.specName === specname) {
            this.specList.splice(index, 1);
          }
        });
      } else {
        const res = deleteSpec({
          goodsId: this.id,
          specName: specname
        });
        res
          .then(() => {
            this.specList.map((item, index) => {
              if (item.specName === specname) {
                this.specList.splice(index, 1);
              }
            });
          })
          .catch(e => {
            alert(e);
          });
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.EditGoods {
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .speclist-content {
    li {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
  }
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
    textarea {
      width: 80%;
      height: 300px;
      border: 1px solid @borderColor;
    }
    .inputBox {
      margin-bottom: 30px;
      span {
        width: 90px;
        display: inline-block;
        color: @fontDefaultColor;
        font-weight: 600;
        vertical-align: middle;
      }
      .verTop {
        vertical-align: top;
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
        color: @fontDeepColor;
      }
      ul {
        display: inline-block;
        width: 500px;
        li {
          width: 100%;
          height: 40px;
          span {
            width: auto;
            font-size: 13px;
            font-weight: 500;
          }
          input {
            margin-right: 10px;
          }
          button {
            width: 50px;
            height: 25px;
            color: #d7514a;
            border: none;
            background-color: white;
            border-radius: 5px;
          }
        }
        .addSpec {
          text-align: center;
          line-height: 30px;
          background-color: #337da4;
          color: white;
          border: none;
          width: 100px;
          height: 30px;
          border-radius: 5px;
          font-size: 13px;
          cursor: pointer;
          margin: 10px auto;
        }
      }
      .long {
        width: 900px;
      }
      .numInput {
        width: 30px;
        text-align: center;
        border: none;
        border-bottom: 2px solid @mainColor;
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
  .popupContent {
    padding: 10px;
    input {
      display: block;
      width: 400px;
      margin-bottom: 10px;
      height: 30px;
    }
    button {
      display: block;
      margin: auto;
      background-color: #333333;
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
