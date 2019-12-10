const router = require('express').Router()
const user = require('../controllers/user');
const email = require('./../utils/email')
// import { postEmail } from './../utils/email'

// 发送邮件
router.get('/api/user/email', email.postEmail)

//注册
router.post('/api/user/signup', user.signup);

//登录
router.post('/api/user/login', user.login);

//获得用户基本信息
router.get('/api/user/data', user.getData);

//更改用户资料
router.post('/api/user/updateUserData', user.updateUserData);

//更改用户密码
router.post('/api/user/updatePwd', user.updatePwd);

/*
//修改昵称
router.post('/privateApi/user/setNickname',user.setNickname);

//修改性别
router.post('/privateApi/user/setSex',user.setSex);

//修改城市
router.post('/privateApi/user/setCity',user.setCity);

//修改头像
router.post('/privateApi/user/setHeadimg',user.setHeadimg);

//修改密码
router.post('/privateApi/user/setPwd',user.setPwd);

//搜索用户
router.get('/api/user/search', user.searchUser);*/

module.exports = router
