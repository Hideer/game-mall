const AdminModel = require('../models/AdminModel.js')
const UserModel = require('../models/UserModel.js')
const jwt = require('jsonwebtoken')
const Util = require('./../utils')

const moment = require('moment')

// 管理员注册
exports.register = async (req, res, next) => {
  try {
    const find_user = await AdminModel.find({ account: req.body.account })
    if (find_user && find_user.length) {
      res.send(Util.returnMsg('The user already exists!' || '用户已存在！'))
    } else {
      await new AdminModel(req.body).save()
      res.send(Util.returnSuccess({ msg: 'Registration successful!' || '注册成功！' }))
    }
  } catch (error) {
    console.log(error)
    res.send(Util.returnMsg())
  }
}

//管理员登录
exports.login = async (req, res) => {
  const admin = req.body
  try {
    //看该账号是否已经注册
    const accountSigned = await AdminModel.findOne({
      // where: {
      account: admin.account
      // }
    })

    //如果不存在
    if (!accountSigned) {
      res.send(
        Util.returnMsg(
          'This account has not been registered, please contact the administrator to register' ||
            '该账号还没注册，请联系管理员注册'
        )
      )
      return
    }
    //已经存在
    else {
      //密码不对
      if (accountSigned.pwd !== admin.pwd) {
        res.send(Util.returnMsg('Incorrect password' || '密码不正确'))
        return
      }
      //密码正确
      else {
        const token = jwt.sign(accountSigned.id, 'chambers')
        res.send(
          Util.returnSuccess({
            msg: 'Login successful! ' || ' 登录成功！',
            data: {
              token: token,
              name: accountSigned.name
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

//管理员修改密码
exports.changePwd = async (req, res) => {
  const pwdObj = req.body
  pwdObj.adminToken = jwt.decode(pwdObj.adminToken)
  try {
    const adminOldPwd = await AdminModel.findOne({
      id: pwdObj.adminToken
    })
    if (adminOldPwd.pwd !== pwdObj.oldPwd) {
      res.send(Util.returnMsg('Old password error' || '旧密码错误'))
      return
    }
    await AdminModel.findOneAndUpdate(
      {
        id: pwdObj.adminToken
      },
      {
        pwd: pwdObj.newPwd
      }
    )
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//查询所有用户
exports.getAllUser = async (req, res) => {
  try {
    const users = await UserModel.find({}, 'id email nickname sex recipient address phone')
    res.send(Util.returnSuccess({ data: users }))
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//删除用户
exports.deleteUser = async (req, res) => {
  const id = req.query.id
  try {
    await UserModel.deleteOne({
      id: id
    })
    res.send(Util.returnSuccess())
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}

//查询指定用户
exports.searchUser = async (req, res) => {
  const word = req.query.word
  try {
    const users = await UserModel.find({
      $or: [
        { email: { $regex: new RegExp(word, 'i') } },
        // { phone: { $regex: new RegExp(word, 'i') } },
        { nickname: { $regex: new RegExp(word, 'i') } },
        { recipient: { $regex: new RegExp(word, 'i') } },
        { address: { $regex: new RegExp(word, 'i') } }
      ]
    })
    res.send(Util.returnSuccess({ data: users }))
  } catch (e) {
    console.log(e)
    res.send(Util.returnMsg())
  }
}
