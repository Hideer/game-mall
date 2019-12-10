const AdminModel = require('../models/AdminModel.js')
const GoodsDetailModel = require('../models/GoodsDetailModel.js')
const GoodsModel = require('../models/GoodsModel.js')
const TypeModel = require('../models/TypeModel.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')

//得到类目
exports.getType = async (req, res) => {
  try {
    const types = await TypeModel.findAll({
      attributes: ['id', 'name']
    })
    res.send({
      code: 0,
      data: types
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//得到商品
exports.getGoodsByType = async (req, res) => {
  const typeId = req.query.typeId
  try {
    const goods = await GoodsModel.findAll({
      attributes: ['id', 'img', 'name'],
      order: [['createtime', 'DESC']],
      where: {
        typeId: typeId
      }
    })
    res.send({
      code: 0,
      data: goods
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//增加类目
exports.addType = async (req, res) => {
  const name = req.body.name
  try {
    const res_ = TypeModel.create({
      name: name
    })
    res.send({
      code: 0
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//得到商品信息
exports.getGoodsInfo = async (req, res) => {
  const id = req.query.id
  try {
    const goods = await GoodsModel.findOne({
      attributes: ['id', 'typeId', 'img', 'name', 'desc'],
      where: {
        id: id
      }
    })
    const specs = await GoodsDetailModel.findAll({
      where: {
        goodsId: id
      }
    })
    res.send({
      code: 0,
      data: {
        goods: goods,
        specs: specs
      }
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//增加商品
exports.addGoods = async (req, res) => {
  const goodsObj = req.body
  try {
    const goods = await GoodsModel.create({
      name: goodsObj.name,
      typeId: goodsObj.typeId,
      img: goodsObj.img,
      desc: goodsObj.desc,
      updatetime: new Date(),
      createtime: new Date()
    })
    for (let item of goodsObj.specList) {
      const spec = await GoodsDetailModel.create({
        goodsId: goods.id,
        specName: item.specName,
        stockNum: item.stockNum,
        unitPrice: item.unitPrice,
        updatetime: new Date(),
        createtime: new Date()
      })
    }

    res.send({
      code: 0
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//增加规格
exports.addSpec = async (req, res) => {
  const specObj = req.body
  try {
    const spec = await GoodsDetailModel.create({
      goodsId: specObj.goodsId,
      specName: specObj.specName,
      stockNum: specObj.stockNum,
      unitPrice: specObj.unitPrice,
      updatetime: new Date(),
      createtime: new Date()
    })

    res.send({
      code: 0,
      data: spec
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//删除规格
exports.deleteSpec = async (req, res) => {
  const specObj = req.body
  try {
    const res_ = await GoodsDetailModel.destroy({
      where: {
        goodsId: specObj.goodsId,
        specName: specObj.specName
      }
    })

    res.send({
      code: 0
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//更新商品信息
exports.updateGoods = async (req, res) => {
  const data = req.body
  try {
    const res1 = await GoodsModel.update(
      {
        name: data.name,
        typeId: data.typeId,
        img: data.img,
        desc: data.desc
      },
      {
        where: {
          id: data.id
        }
      }
    )
    for (let item of data.specList) {
      const res2 = await GoodsDetailModel.update(
        {
          specName: item.specName,
          stockNum: item.stockNum,
          unitPrice: item.unitPrice
        },
        {
          where: {
            id: item.id
          }
        }
      )
    }
    res.send({
      code: 0
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//删除商品
exports.deleteGoods = async (req, res) => {
  const id = req.query.id
  try {
    const res1 = await GoodsModel.destroy({
      where: {
        id: id
      }
    })
    const res2 = await GoodsDetailModel.destroy({
      where: {
        goodsId: id
      }
    })
    res.send({
      code: 0
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}
