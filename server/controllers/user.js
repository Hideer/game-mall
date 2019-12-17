const UserModel = require('../models/UserModel.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const moment = require('moment')

const Util = require('./../utils')

//注册
exports.signup = async (req, res) => {
  try {
    const hashPwd = bcrypt.hashSync(req.body.pwd, salt)
    const user = {
      email: req.body.email,
      pwd: hashPwd,
      nickname: req.body.nickname,
      recipient: req.body.recipient,
      address: req.body.address,
      phone: req.body.phone
    }

    //验证邮箱唯一性
    const emailUniq = await UserModel.findOne({
      email: req.body.email
    })
    //如果已经存在
    if (emailUniq) {
      res.send(Util.returnMsg('The mailbox has been registered' || '该邮箱已被注册'))
      return
    }

    //验证昵称唯一性
    const nicknameUniq = await UserModel.findOne({
      nickname: req.body.nickname
    })
    //如果已经存在
    if (nicknameUniq) {
      res.send(Util.returnMsg('The nickname has been registered' || '该昵称已被注册'))
      return
    }

    //插入数据
    const UserInfo = await new UserModel(user).save()
    const token = jwt.sign(UserInfo.id, 'chambers')

    res.send(
      Util.returnSuccess({
        data: {
          name: UserInfo.nickname,
          token: token
        }
      })
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//登录
exports.login = async (req, res) => {
  try {
    const user = req.body
    //看该邮箱是否已经注册
    const emailSigned = await UserModel.findOne({
      email: user.account
    })

    //如果不存在
    if (!emailSigned) {
      res.send(Util.returnMsg('This email address has not been registered, please go to register' || '该邮箱还没注册，请前往注册'))
      return
    }
    //已经存在
    else {
      //密码不对
      if (!bcrypt.compareSync(user.pwd, emailSigned.pwd)) {
        res.send(Util.returnMsg('Incorrect password' || '密码不正确'))
        return
      }
      //密码正确
      else {
        const token = jwt.sign(emailSigned.id, 'chambers')
        res.send(
          Util.returnSuccess({
            data: {
              name: emailSigned.nickname,
              token: token
            }
          })
        )
      }
    }
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//获取user基本资料
exports.getData = async (req, res) => {
  const id = jwt.verify(req.query.token, 'chambers')
  try {
    const user = await UserModel.findOne({
      id: id
    })
    if (!user) {
      res.send(Util.returnMsg('The user does not exist' || '该用户不存在'))
      return
    }
    res.send(
      Util.returnSuccess({
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
    )
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//更改用户资料
exports.updateUserData = async (req, res) => {
  const data = req.body
  try {
    await UserModel.findOneAndUpdate(
      {
        id: data.id
      },
      {
        recipient: data.recipient,
        address: data.address,
        phone: data.phone,
        nickname: data.nickname
      }
    )
    //正常修改
    res.send(
      Util.returnSuccess({
        msg: '修改成功'
      })
    )
  } catch (e) {
    //发生错误
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//修改密码
exports.updatePwd = async (req, res) => {
  const data = req.body
  try {
    const account = await UserModel.findOne({
      id: data.id
    })

    if (!bcrypt.compareSync(data.oldPwd, account.pwd)) {
      res.send(Util.returnMsg('Incorrect password' || '密码不正确'))
      return
    }
    //密码正确
    else {
      const hashPwd = bcrypt.hashSync(data.newPwd, salt)
      await UserModel.findOneAndUpdate(
        {
          id: data.id
        },
        {
          pwd: hashPwd
        }
      )
      //正常修改
      res.send(Util.returnSuccess({ msg: 'Password change successful!' || '修改密码成功！' }))
    }
  } catch (e) {
    //发生错误
    console.log(e)
    res.send(Util.returnMsg( 'Error modifying password' || '修改密码出错'))
  }
}
