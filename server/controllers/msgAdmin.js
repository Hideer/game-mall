const UserModel = require('../models/UserModel.js')
const MessageModel = require('../models/MessageModel.js')
const GoodsModel = require('../models/GoodsModel.js')
const ReplyModel = require('../models/ReplyModel.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const Util = require('./../utils')

//获得未回复的留言
exports.getNoReplyMsg = async (req, res) => {
  try {
    const noReplyMsgs = await MessageModel.find(
      {
        state: 0
      },
      null,
      { sort: { updatetime: -1 } }
    )
    if (noReplyMsgs.length === 0) {
      res.send(Util.returnSuccess())
      return
    } else {
      let messageList = []
      for (let msg of noReplyMsgs) {
        let user = await UserModel.findOne({
          id: msg.userId
        })
        //用户已被删除
        if (!user) {
          user = {}
          user.nickname = '该用户已注销'
          user.headimg = ''
        }
        let goods = await GoodsModel.findOne({
          id: msg.goodsId
        })
        //商品已被删除
        if (!goods) {
          goods = {}
          goods.id = 0
          goods.name = '该商品已下架'
        }
        messageList.push({
          user: {
            name: user.nickname,
            headimg: user.headimg
          },
          id: msg.id,
          content: msg.content,
          time: moment(msg.createtime)
            .add('hours', 8)
            .format('MM-DD HH:mm'),
          goods: {
            id: goods.id,
            name: goods.name
          }
        })
      }
      res.send(Util.returnSuccess({ data: messageList }))
    }
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//获得已回复的留言
exports.getRepliedMsg = async (req, res) => {
  try {
    const repliedMsg = await MessageModel.find(
      {
        state: 1
      },
      null,
      { sort: { updatetime: -1 } }
    )
    if (repliedMsg.length === 0) {
      res.send({
        code: 10000,
        data: []
      })
      return
    } else {
      let messageList = []
      for (let msg of repliedMsg) {
        let user = await UserModel.findOne({
          id: msg.userId
        })
        //用户已被删除
        if (!user) {
          user = {}
          user.nickname = '该用户已注销'
          user.headimg = ''
        }
        let goods = await GoodsModel.findOne({
          id: msg.goodsId
        })
        //商品已被删除
        if (!goods) {
          goods = {}
          goods.id = 0
          goods.name = '该商品已下架'
        }
        const reply = await ReplyModel.findOne({
          messageId: msg.id
        })
        messageList.push({
          user: {
            name: user.nickname,
            headimg: user.headimg
          },
          id: msg.id,
          content: msg.content,
          replyContent: reply.content,
          time: moment(msg.createtime)
            .add('hours', 8)
            .format('MM-DD HH:mm'),
          goods: {
            id: goods.id,
            name: goods.name
          }
        })
      }
      res.send(Util.returnSuccess({ data: messageList }))
    }
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//回复
exports.reply = async (req, res) => {
  const replyObj = req.body
  try {
    const res1 = await new ReplyModel({
      messageId: replyObj.id,
      content: replyObj.content,
      createtime: new Date()
    }).save()
    const res2 = await MessageModel.findOneAndUpdate(
      {
        id: replyObj.id
      },
      {
        state: 1
      }
    )
    res.send(Util.returnSuccess({}))
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}
