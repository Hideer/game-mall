const GoodsDetailModel = require('../models/GoodsDetailModel.js')
const GoodsModel = require('../models/GoodsModel.js')
const TypeModel = require('../models/TypeModel.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const Util = require('./../utils')

//得到类目
exports.getType = async (req, res) => {
  try {
    const types = await TypeModel.find({}, 'id name')
    res.send(
      Util.returnSuccess({
        data: types
      })
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//得到商品
exports.getGoodsByType = async (req, res) => {
  const typeId = req.query.typeId
  try {
    const goods = await GoodsModel.find(
      {
        typeId: typeId
      },
      'id img name',
      {
        sort: {
          updatedAt: -1
        }
      }
    )
    res.send(
      Util.returnSuccess({
        data: goods
      })
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//增加类目
exports.addType = async (req, res) => {
  const name = req.body.name
  try {
    const res_ = new TypeModel({
      name: name
    }).save()
    res.send(Util.returnSuccess({ mgs: '栏目添加成功！' }))
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//得到商品信息
exports.getGoodsInfo = async (req, res) => {
  const id = req.query.id
  try {
    const goods = await GoodsModel.findOne(
      {
        id: id
      },
      'id typeId img name desc'
    )
    const specs = await GoodsDetailModel.find({
      goodsId: id
    })
    res.send(
      Util.returnSuccess({
        data: {
          goods: goods,
          specs: specs
        }
      })
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//增加商品
exports.addGoods = async (req, res) => {
  const goodsObj = req.body
  try {
    const goods = await new GoodsModel({
      name: goodsObj.name,
      typeId: goodsObj.typeId,
      img: goodsObj.img,
      desc: goodsObj.desc
    }).save()
    for (let item of goodsObj.specList) {
      const spec = await GoodsDetailModel({
        goodsId: goods.id,
        specName: item.specName,
        stockNum: item.stockNum,
        unitPrice: item.unitPrice
      }).save()
    }
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//增加规格
exports.addSpec = async (req, res) => {
  const specObj = req.body
  try {
    const spec = await new GoodsDetailModel({
      goodsId: specObj.goodsId,
      specName: specObj.specName,
      stockNum: specObj.stockNum,
      unitPrice: specObj.unitPrice
    }).save()
    res.send(Util.returnSuccess({ data: spec }))
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//删除规格
exports.deleteSpec = async (req, res) => {
  const specObj = req.body
  try {
    const res_ = await GoodsDetailModel.deleteOne({
      goodsId: specObj.goodsId,
      specName: specObj.specName
    })
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//更新商品信息
exports.updateGoods = async (req, res) => {
  const data = req.body
  try {
    const res1 = await GoodsModel.findOneAndUpdate(
      {
        id: data.id
      },
      {
        name: data.name,
        typeId: data.typeId,
        img: data.img,
        desc: data.desc
      }
    )
    for (let item of data.specList) {
      const res2 = await GoodsDetailModel.findOneAndUpdate(
        {
          id: item.id
        },
        {
          specName: item.specName,
          stockNum: item.stockNum,
          unitPrice: item.unitPrice
        }
      )
    }
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//删除商品
exports.deleteGoods = async (req, res) => {
  const id = req.query.id
  try {
    const res1 = await GoodsModel.deleteOne({
      id: id
    })
    const res2 = await GoodsDetailModel.deleteOne({
      goodsId: id
    })
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}
