//引入模块
const nodemailer = require('nodemailer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const emailBase = require('./../config/emailBase')

exports.postEmail = async (req, res) => {
  //设置邮箱配置
  let transporter = nodemailer.createTransport({
    host: emailBase.host, //邮箱服务的主机，如smtp.qq.com
    port: emailBase.port, //对应的端口号
    //开启安全连接
    // secure: false,
    secureConnection: true,
    //用户信息
    auth: emailBase.auth
  })

  const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email.ejs'), 'utf8'))

  const html = template({
    code: 'Ejs123'
  })


  let mailOptions = {
    from: `${emailBase.hostTitle} <${emailBase.auth.user}>`, //谁发的
    to: 'yu_meng_cheng@163.com', //发给谁
    subject: 'Hello', //主题是什么
    // text: '', //文本内容
    html //html模板

    //附件信息
    // attachments: [
    //   {
    //     filename: '',
    //     path: ''
    //   }
    // ]
  }

  //发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send({
        code: 10000,
        message: '获取验证码失败'
      })
      return console.log('emailERROR', error)
    }
    res.send({
      code: 0,
      data: info
    })
    // console.log(`Message: ${info.messageId}`)
    // console.log(`sent: ${info.response}`)
  })
}
