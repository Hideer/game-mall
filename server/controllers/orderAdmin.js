const UserModel = require('../models/UserModel.js')
const GoodsModel = require('../models/GoodsModel.js')
const GoodsDetailModel = require('../models/GoodsDetailModel.js')
const OrderModel = require('../models/OrderModel.js')
const moment = require('moment')
const email = require('./../utils/email')
const socketio = require('./../socketio')

const Util = require('./../utils')

//获得订单
exports.getOrders = async (req, res) => {
  /*-1全部，0未付款，1已付款未发货，2已发货未确认收到，3确认到货订单完成*/
  const state = Number(req.query.state)
  try {
    let orders = []
    if (state === -1) {
      orders = await OrderModel.find({}, null, { sort: { updatetime: -1 } })
    } else {
      orders = await OrderModel.find(
        {
          state: state
        },
        null,
        { sort: { updatetime: -1 } }
      )
    }
    if (orders.length === 0) {
      res.send(Util.returnSuccess({ data: [] }))
      return
    }
    let orderList = []
    for (let order of orders) {
      let user = await UserModel.findOne({
        id: order.userId
      })
      if (!user) {
        user = {
          nickname: '已注销账户',
          recipient: '已注销账户',
          address: '已注销账户',
          phone: '已注销账户'
        }
      }
      let spec = await GoodsDetailModel.findOne({
        id: order.goodsDetailId
      })
      if (!spec) {
        spec = {
          goodsId: 0,
          specName: '已下架'
        }
      }
      let goods = await GoodsModel.findOne({
        id: spec.goodsId
      })
      if (!goods) {
        goods = {
          name: '已下架'
        }
      }
      orderList.push({
        id: order.id,
        user: {
          id: order.userId, //用户id
          nickname: user.nickname,
          name: user.recipient,
          address: user.address,
          phone: user.phone
        },
        goods: goods.name,
        spec: spec.specName,
        num: order.goodsNum,
        amount: order.amount,
        state: order.state === 0 ? '未付款' : order.state === 1 ? '未发货' : order.state === 2 ? '已发货' : '已到货',
        time: moment(order.updatetime).format('MM-DD HH:mm')
      })
    }

    res.send(
      Util.returnSuccess({
        data: orderList
      })
    )
  } catch (e) {
    console.log('这是个什么结构', e)
    res.send(Util.returnMsg())
  }
}

//获得订单
exports.getOrder = async (req, res) => {
  const id = Number(req.query.id)
  try {
    let order = await OrderModel.findOne({
      id: id
    })
    if (!order) {
      res.send(Util.returnSuccess({ data: {} }))
      return
    }
    const spec = await GoodsDetailModel.findOne({
      id: order.goodsDetailId
    })
    console.log(order, spec)
    const specs = await GoodsDetailModel.find({
      goodsId: spec.goodsId
    })
    const goods = await GoodsModel.findOne({
      id: spec.goodsId
    })
    res.send(
      Util.returnSuccess({
        data: {
          id: order.id,
          goods: goods.name,
          amount: order.amount,
          num: order.goodsNum,
          spec: specs,
          states: [
            { id: 0, name: '未付款' },
            { id: 1, name: '未发货' },
            { id: 2, name: '已发货' },
            { id: 3, name: '已到货' }
          ],
          curSpec: {
            id: spec.id,
            name: spec.specName
          },
          curState: {
            id: order.state,
            name: order.state === 0 ? '未付款' : order.state === 1 ? '未发货' : order.state === 2 ? '已发货' : '已到货'
          }
        }
      })
    )
  } catch (e) {
    console.log('这是gege ', e)
    res.send(Util.returnMsg())
  }
}

//修改订单
exports.changeOrder = async (req, res) => {
  const orderObj = req.body
  try {
    const order = await OrderModel.findOne({
      id: orderObj.id
    })
    const difNum = orderObj.num - order.goodsNum
    const spec = await GoodsDetailModel.findOne({
      id: orderObj.spec
    })
    await GoodsDetailModel.findOneAndUpdate(
      {
        id: orderObj.spec
      },
      {
        stockNum: spec.stockNum - difNum
      }
    )
    const res_ = await OrderModel.findOneAndUpdate(
      {
        id: orderObj.id
      },
      {
        goodsNum: orderObj.num,
        goodsDetailId: orderObj.spec,
        state: orderObj.state,
        amount: spec.unitPrice * orderObj.num
      }
    )

    let user = await UserModel.findOne({
      id: order.userId
    })

    res.send(Util.returnSuccess({ data: {} }))
    if (orderObj.state == 2) {
      const goods = await GoodsModel.findOne({
        id: spec.goodsId
      })

      email
        .postEmail({
          email: user.email,
          nickname: user.nickname,
          goods: goods.name
        })
        .then(() => {
          socketio.messageOrder({
            type: 'success',
            msg: '订单已发货，请注意邮箱查收激活码'
          })
        })
    } else {
      socketio.messageOrder({
        type: 'info',
        msg: '订单状态已变更请注意查收'
      })
    }
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//删除订单
exports.deleteOrder = async (req, res) => {
  const id = req.query.id
  try {
    const order = await OrderModel.findOne({
      id: id
    })
    //还没结束的订单，那就库存增加
    if (order.state !== 3) {
      const goodsDetail = await GoodsDetailModel.findOne({
        id: id
      })
      await GoodsDetailModel.findOneAndUpdate(
        {
          id: id
        },

        {
          stockNum: goodsDetail.stockNum + order.goodsNum
        }
      )
    }

    const res_ = await OrderModel.findOneAndDelete({
      id: id
    })
    res.send(Util.returnSuccess({ data: {} }))
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}
