const UserModel = require('../models/UserModel.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const moment = require('moment')

//注册
exports.signup = async (req, res) => {
  const hashPwd = bcrypt.hashSync(req.body.pwd, salt)
  const user = {
    email: req.body.email,
    pwd: hashPwd,
    nickname: req.body.nickname,
    recipient: req.body.recipient,
    address: req.body.address,
    phone: req.body.phone,
    createtime: new Date(),
    updatetime: new Date()
  }

  //验证邮箱唯一性
  const emailUniq = await UserModel.findOne({
    where: {
      email: req.body.email
    }
  })
  //如果已经存在
  if (emailUniq) {
    res.send({
      code: 10000,
      message: '该邮箱已被注册'
    })
    return
  }

  //验证昵称唯一性
  const nicknameUniq = await UserModel.findOne({
    where: {
      nickname: req.body.nickname
    }
  })
  //如果已经存在
  if (nicknameUniq) {
    res.send({
      code: 10000,
      message: '该昵称已被注册'
    })
    return
  }

  //插入数据
  const res_ = await UserModel.create(user)
  const token = jwt.sign(res_.id, 'chambers')
  res.send({
    code: 0,
    data: {
      name: res_.nickname,
      token: token
    }
  })
}

//登录
exports.login = async (req, res) => {
  const user = req.body
  //看该邮箱是否已经注册
  const emailSigned = await UserModel.findOne({
    where: {
      email: user.account
    }
  })

  //如果不存在
  if (!emailSigned) {
    res.send({
      code: 10000,
      message: '该邮箱还没注册，请前往注册'
    })
    return
  }
  //已经存在
  else {
    //密码不对
    if (!bcrypt.compareSync(user.pwd, emailSigned.pwd)) {
      res.send({
        code: 10000,
        message: '密码不正确'
      })
      return
    }
    //密码正确
    else {
      const token = jwt.sign(emailSigned.id, 'chambers')
      res.send({
        code: 0,
        data: {
          name: emailSigned.nickname,
          token: token
        }
      })
    }
  }
}

//获取user基本资料
exports.getData = async (req, res) => {
  const id = jwt.verify(req.query.token, 'chambers')
  try {
    const user = await UserModel.findOne({
      attributes: ['id', 'email', 'nickname', 'recipient', 'address', 'phone', 'headimg'],
      where: {
        id: id
      }
    })
    if (!user) {
      res.send({
        code: 10000,
        message: '该用户不存在'
      })
      return
    }
    res.send({
      code: 0,
      data: {
        id: user.id,
        headimg: user.headimg,
        email: user.email,
        nickname: user.nickname,
        recipient: user.recipient,
        address: user.address,
        phone: user.phone
      }
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络错误'
    })
  }
}

//更改用户资料
exports.updateUserData = async (req, res) => {
  const data = req.body

  try {
    const res_ = await UserModel.update(
      {
        recipient: data.recipient,
        address: data.address,
        phone: data.phone,
        nickname: data.nickname
      },
      {
        where: {
          id: data.id
        }
      }
    )
    //正常修改
    res.send({
      code: 0,
      nickname: data.nickname
    })
  } catch (e) {
    //发生错误
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//修改密码
exports.updatePwd = async (req, res) => {
  const data = req.body

  const account = await UserModel.findOne({
    where: {
      id: data.id
    }
  })

  if (!bcrypt.compareSync(data.oldPwd, account.pwd)) {
    res.send({
      code: 10000,
      message: '密码不正确'
    })
    return
  }
  //密码正确
  else {
    try {
      const hashPwd = bcrypt.hashSync(data.newPwd, salt)
      const res_ = await UserModel.update(
        {
          pwd: hashPwd
        },
        {
          where: {
            id: data.id
          }
        }
      )
      //正常修改
      res.send({
        code: 0
      })
    } catch (e) {
      //发生错误
      res.send({
        code: 10000,
        message: '修改密码出错'
      })
    }
  }
}
