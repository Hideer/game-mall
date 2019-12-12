const GoodsDetailModel = require('../models/GoodsDetailModel.js')
const GoodsModel = require('../models/GoodsModel.js')
const TypeModel = require('../models/TypeModel.js')
const MessageModel = require('../models/MessageModel.js')
const ReplyModel = require('../models/ReplyModel.js')
const UserModel = require('../models/UserModel.js')
const OrderModel = require('../models/OrderModel.js')
const CommentModel = require('../models/CommentModel.js')

const jwt = require('jsonwebtoken')
const moment = require('moment')

const Util = require('./../utils')

//得到不同类目的商品
exports.getGoodsByType = async (req, res) => {
  const typeId = req.query.typeId
  try {
    let goods
    //查全部
    if (typeId === '-1') {
      goods = await GoodsModel.find({}, null, { sort: { updatetime: -1 } })
    } else {
      goods = await GoodsModel.find(
        {
          typeId: typeId
        },
        null,
        { sort: { updatetime: -1 } }
      )
    }
    if (goods.length === 0) {
      res.send(Util.returnSuccess({ data: [] }))
      return
    }
    let goodsList = []

    for (let item of goods) {
      const spec = await GoodsDetailModel.findOne({
        goodsId: item.id
      })
      goodsList.push({
        ...item._doc,
        price: spec ? spec.unitPrice : 0
      })
    }
    res.send(Util.returnSuccess({ data: goodsList }))
  } catch (e) {
    console.log('异常错误', e)
    res.send(Util.returnMsg())
  }
}

//得到商品详情页信息
exports.getGoodsInfo = async (req, res) => {
  const id = req.query.id
  try {
    const goods = await GoodsModel.findOne({
      id: id
    })
    if (!goods) {
      res.send(
        Util.returnSuccess({
          data: {
            img: '',
            name: '',
            desc: '',
            specs: [],
            typeId: ''
          }
        })
      )
      return
    }

    const specs = await GoodsDetailModel.find({
      goodsId: id
    })
    res.send(
      Util.returnSuccess({
        data: {
          img: goods.img,
          name: goods.name,
          desc: goods.desc,
          typeId: goods.typeId,
          specs: specs
        }
      })
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//获得商品详情页问答区数据
exports.getGoodsMsg = async (req, res) => {
  const id = req.query.id
  try {
    const msgs = await MessageModel.find(
      {
        goodsId: id
      },
      null,
      { sort: { updatetime: -1 } }
    )
    if (msgs.length === 0) {
      res.send(Util.returnSuccess({ data: [] }))
      return
    }

    let msgList = []
    for (let msg of msgs) {
      let nickname = ''
      let user = await UserModel.findOne({
        id: msg.userId
      })
      if (!user) {
        nickname = '该用户已注销'
      } else {
        nickname = user.nickname
      }

      let replyObj = {}
      let reply = await ReplyModel.findOne({
        messageId: msg.id
      })

      if (reply) {
        replyObj = {
          id: reply.id,
          content: reply.content,
          time: moment(reply.createtime)
            .add('hours', 8)
            .format('MM-DD HH:mm')
        }
      }

      msgList.push({
        ...msg._doc,
        asker: nickname,
        time: moment(msg.createtime)
          .add('hours', 8)
          .format('MM-DD HH:mm'),
        reply: replyObj
      })
    }
    res.send(Util.returnSuccess({ data: msgList }))
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//提问商品
exports.askGoodsMsg = async (req, res) => {
  const token = req.body.token
  try {
    const res_ = new MessageModel({
      userId: jwt.verify(token, 'chambers'),
      goodsId: req.body.goodsId,
      content: req.body.msg
    }).save()
    res.send(Util.returnSuccess({}))
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//加入购物车或立即购买
exports.addOrder = async (req, res) => {
  const token = req.body.token
  try {
    const res_ = new OrderModel({
      userId: jwt.verify(token, 'chambers'),
      goodsDetailId: req.body.goodsDetailId,
      goodsNum: req.body.num,
      amount: req.body.amount,
      state: req.body.state
    }).save()
    //如果是立即购买的话，库存要马上变动
    if (req.body.state === 1) {
      const spec = await GoodsDetailModel.findOne({
        id: req.body.goodsDetailId
      })
      let newNum = spec.stockNum - req.body.num
      await GoodsDetailModel.findOneAndRemove(
        {
          id: req.body.goodsDetailId
        },
        {
          stockNum: newNum
        }
      )
    }
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//获得用户订单
exports.getOrderByState = async (req, res) => {
  const state = Number(req.query.state)
  const userId = jwt.verify(req.query.token, 'chambers')
  try {
    let orders
    //查全部的
    if (state === -1) {
      orders = await OrderModel.find(
        {
          userId: userId
        },
        null,
        { sort: { updatetime: -1 } }
      )
    } else {
      orders = await OrderModel.find(
        {
          userId: userId,
          state: state
        },
        null,
        { sort: { updatetime: -1 } }
      )
    }

    let orderList = []
    for (let order of orders) {
      const spec = await GoodsDetailModel.findOne({
        id: order.goodsDetailId
      })
      if (!spec) {
        continue
      }
      const goods = await GoodsModel.findOne({
        id: spec.goodsId
      })
      if (!goods) {
        continue
      }

      //如果是已完成订单，那就看看评价过没有
      let hasComment = false
      if (order.state === 3) {
        let comment = await CommentModel.findOne({
          orderId: order.id
        })
        if (comment) {
          hasComment = true
        }
      }

      orderList.push({
        id: order.id,
        createtime: moment(order.createtime)
          .add('hours', 8)
          .format('MM-DD HH:mm'),
        goods: {
          img: goods.img,
          id: goods.id,
          goodsDetailId: spec.id,
          name: goods.name,
          spec: spec.specName,
          unitPrice: spec.unitPrice
        },
        goodsNum: order.goodsNum,
        amount: order.amount,
        state: order.state,
        hasComment: hasComment
      })
    }

    res.send(
      Util.returnSuccess({
        data: orderList
      })
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//删除订单
exports.deleteOrder = async (req, res) => {
  const orderId = req.query.id
  try {
    const order = await OrderModel.findOne({
      id: orderId
    })
    if (!order) {
      res.send(Util.returnSuccess())
      return
    }

    //除了已完成订单和未付款订单外，其它状态的订单被删除，库存量都要加回去
    if (order.state === 1 || order.state === 2) {
      const spec = await GoodsDetailModel.findOne({
        id: order.goodsDetailId
      })
      let newNum = spec.stockNum + order.goodsNum
      await GoodsDetailModel.findOneAndUpdate(
        {
          id: order.goodsDetailId
        },
        {
          stockNum: newNum
        }
      )
    }

    //删除
    const res_ = await OrderModel.findOneAndDelete({
      id: orderId
    })

    res.send(Util.returnSuccess())
  } catch (e) {
    res.send(Util.returnMsg())
  }
}

//确认收货
exports.confirmReceive = async (req, res) => {
  const orderId = req.query.id
  try {
    await OrderModel.findOneAndUpdate(
      {
        id: orderId
      },
      {
        state: 3
      }
    )
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//确认付款
exports.pay = async (req, res) => {
  const orderId = req.query.id
  try {
    await OrderModel.findOneAndUpdate(
      {
        id: orderId
      },
      {
        state: 1
      }
    )
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//购物车结算
exports.settleAccounts = async (req, res) => {
  let cartList = req.body.cartList
  try {
    for (let item of cartList) {
      let order = await OrderModel.findOne({
        id: item.id
      })
      await OrderModel.findOneAndUpdate(
        {
          id: item.id
        },
        {
          state: 1,
          goodsNum: item.goodsNum,
          amount: item.amount
        }
      )
      //更新库存
      let spec = await GoodsDetailModel.findOne({
        id: order.goodsDetailId
      })
      let newNum = spec.stockNum - item.goodsNum
      await GoodsDetailModel.findOneAndUpdate(
        {
          id: order.goodsDetailId
        },
        {
          stockNum: newNum
        }
      )
    }
    res.send(Util.returnSuccess())
  } catch (e) {
    res.send(Util.returnMsg())
  }
}

//发送评价
exports.sendComment = async (req, res) => {
  try {
    const res_ = await new CommentModel({
      userId: jwt.verify(req.body.token, 'chambers'),
      goodsId: req.body.goodsId,
      goodsDetailId: req.body.goodsDetailId,
      orderId: req.body.orderId,
      content: req.body.content,
      score: req.body.score
    }).save()

    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//获得商品评论
exports.getGoodsComment = async (req, res) => {
  const goodsId = req.query.goodsId
  try {
    const comments = await CommentModel.find(
      {
        goodsId: goodsId
      },
      null,
      { sort: { updatetime: -1 } }
    )
    if (comments.length <= 0) {
      res.send(Util.returnSuccess())
      return
    }

    //分数累加
    let sum = 0
    let commentList = []
    for (let comment of comments) {
      sum += comment.score
      let user = await UserModel.findOne({
        id: comment.userId
      })
      if (!user) {
        user = {
          nickname: '该用户已注销',
          headimg: 'http://tvax3.sinaimg.cn/default/images/default_avatar_male_180.gif'
        }
      }

      let spec = await GoodsDetailModel.findOne({
        id: comment.goodsDetailId
      })
      if (!spec) {
        spec = {
          specName: '该规格已下架'
        }
      }

      commentList.push({
        id: comment.id,
        user: user,
        score: comment.score,
        comment: comment.content,
        time: moment(comment.createtime)
          .add('hours', 8)
          .format('MM-DD HH:mm'),
        specName: spec.specName
      })
    }
    //算平均分
    let rate = sum / comments.length

    res.send(
      Util.returnSuccess({
        data: {
          rate: rate,
          commentList: commentList
        }
      })
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//关键词搜索商品
exports.searchGoods = async (req, res) => {
  const keyword = req.query.keyword
  try {
    let goods
    goods = await GoodsModel.find(
      {
        name: { $regex: new RegExp(keyword, 'i') }
      },
      null,
      { sort: { updatetime: -1 } }
    )
    if (goods.length === 0) {
      res.send(Util.returnSuccess({ data: [] }))
      return
    }

    let goodsList = []

    for (let item of goods) {
      const spec = await GoodsDetailModel.findOne({
        goodsId: item.id
      })
      goodsList.push({
        id: item.id,
        img: item.img,
        name: item.name,
        price: spec ? spec.unitPrice : 0,
        typeId: item.typeId
      })
    }
    res.send(
      Util.returnSuccess({
        data: goodsList
      })
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}
