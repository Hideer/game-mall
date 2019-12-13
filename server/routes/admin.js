const router = require('express').Router()
const userAdmin = require('../controllers/userAdmin')
const msgAdmin = require('../controllers/msgAdmin')
const orderAdmin = require('../controllers/orderAdmin')
const goodsAdmin = require('../controllers/goodsAdmin')

/* 管理员用户 STAER */
// 注册
router.post('/api/admin/register', userAdmin.register)

//登录
router.post('/api/admin/login', userAdmin.login)

//管理员修改密码
router.post('/api/admin/changePwd', userAdmin.changePwd)
/* 管理员用户 END */



/* C端用户 STAER */
//查询所有用户
router.get('/api/admin/allUser', userAdmin.getAllUser)

//删除指定用户
router.delete('/api/admin/deleteUser', userAdmin.deleteUser)

//搜索用户
router.get('/api/admin/searchUser', userAdmin.searchUser)
/* C端用户 END */



//查询未回复信息
router.get('/api/admin/noReplyMsg', msgAdmin.getNoReplyMsg)

//查询已回复信息
router.get('/api/admin/repliedMsg', msgAdmin.getRepliedMsg)

//回复信息
router.post('/api/admin/reply', msgAdmin.reply)

//获取订单
router.get('/api/admin/orders', orderAdmin.getOrders)

//获取订单一些可供修改的信息
router.get('/api/admin/order', orderAdmin.getOrder)

//修改订单
router.post('/api/admin/changeOrder', orderAdmin.changeOrder)

//删除订单
router.delete('/api/admin/deleteOrder', orderAdmin.deleteOrder)


/* 管理端商品管理 STAET */
//增加类目
router.post('/api/admin/addType', goodsAdmin.addType)

//得到类目
router.get('/api/admin/getType', goodsAdmin.getType)

//根据类型得到商品
router.get('/api/admin/getGoodsByType', goodsAdmin.getGoodsByType)

//得到商品详情
router.get('/api/admin/getGoodsInfo', goodsAdmin.getGoodsInfo)

//增加商品
router.post('/api/admin/addGoods', goodsAdmin.addGoods)

//增加规格
router.post('/api/admin/addSpec', goodsAdmin.addSpec)

//删除规格
router.post('/api/admin/deleteSpec', goodsAdmin.deleteSpec)

//更新商品信息
router.post('/api/admin/updateGoods', goodsAdmin.updateGoods)

//删除商品
router.delete('/api/admin/deleteGoods', goodsAdmin.deleteGoods)
/* 管理端商品管理 END */

module.exports = router
