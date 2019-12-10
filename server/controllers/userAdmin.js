const AdminModel = require('../models/AdminModel.js')
const UserModel = require('../models/UserModel.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')

//管理员登录
exports.login = async (req,res) => {
  const admin = req.body
  try {
    //看该账号是否已经注册
    const accountSigned = await AdminModel.findOne({
      where: {
        account: admin.account
      }
    })

    //如果不存在
    if (!accountSigned) {
      res.send({
        code: 10000,
        message: '该账号还没注册，请联系管理员注册'
      })
      return
    }
    //已经存在
    else {
      //密码不对
      if (accountSigned.pwd !== admin.pwd) {
        res.send({
          code: 10000,
          message: '密码不正确'
        })
        return
      }
      //密码正确
      else {
        const token = jwt.sign(accountSigned.id, 'chambers')
        res.send({
          code: 0,
          data: {
            token: token,
            name: accountSigned.name
          }
        })
      }
    }
  } catch (e) {
    console.log(e)

    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}


//管理员修改密码
exports.changePwd = async (req, res) => {
  const pwdObj = req.body
  pwdObj.adminToken = jwt.decode(pwdObj.adminToken)
  try {
    const adminOldPwd = await AdminModel.findOne({
      attributes: ['pwd'],
      where: {
        id: pwdObj.adminToken
      }
    })
    if (adminOldPwd.pwd !== pwdObj.oldPwd) {
      res.send({
        code: 10000,
        message: '旧密码错误'
      })
      return
    }
    const res_ = await AdminModel.update(
      {
        pwd: pwdObj.newPwd
      },
      {
        where: {
          id: pwdObj.adminToken
        }
      }
    )
    res.send({
      code: 0
    })
  } catch (e) {
    console.log(e);
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}

//查询所有用户
exports.getAllUser = async (req,res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ['id', 'email', 'nickname', 'sex', 'recipient', 'address', 'phone']
    })
    res.send({
      code: 0,
      data: users
    })
    // res.send({
    //   code: 0,
    //   data: users
    // }
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
    // res.send({
    //   code: 10000,
    //   message: '网络出错'
    // }
  }
}

//删除用户
exports.deleteUser = async (req,res) => {
  const id = req.query.id
  try {
    const res_ = await UserModel.destroy({
      where: {
        id: id
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

//查询指定用户
exports.searchUser = async (req,res) => {
  const word = req.query.word
  try {
    const users = await UserModel.findAll({
      attributes: ['id', 'email', 'nickname', 'sex', 'recipient', 'address', 'phone'],
      where: {
        $or: [
          { email: word },
          { phone: word },
          { nickname: { $like: '%' + word + '%' } },
          { recipient: { $like: '%' + word + '%' } },
          { address: { $like: '%' + word + '%' } }
        ]
      }
    })
    res.send({
      code: 0,
      data: users
    })
  } catch (e) {
    res.send({
      code: 10000,
      message: '网络出错'
    })
  }
}
