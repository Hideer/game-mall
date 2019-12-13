var socket_io = require('socket.io')
var socketio = {} // 获取io
let clientList = {} // 客户端连接用户
let adminList = {} // 客户端连接用户
let io = null

socketio.getSocketio = function(server) {
  // http(s) server
  io = socket_io.listen(server)

  // 管理端
  let admin = io.of('/admin').on('connection', function(socket) {
    console.log('ADMIN_connection:' + socket.id)
    let token = socket.handshake.query.token
    adminList[socket.id] = {
      // isLogin:
      token
    }
    console.log(adminList)
    // socket.on('setToken', (res)=>{
    // }
    // 离线
    socket.on('disconnect', function(item) {
      // 这里监听 disconnect，就可以知道谁断开连接了
      console.log('disconnect: ' + socket.id)
      delete adminList[socket.id]
      console.log(adminList)
    })
  })

  // 客户端
  let client = io.of('/client').on('connection', function(socket) {
    console.log('CLIENT_connection:' + socket.id)
    let token = socket.handshake.query.token
    clientList[socket.id] = {
      // isLogin:
      token
    }
    console.log(clientList)
    // socket.emit('noticeInfo', '这还是一个通知')
    // 离线
    socket.on('disconnect', function(item) {
      // 这里监听 disconnect，就可以知道谁断开连接了
      console.log('disconnect: ' + socket.id)
      delete clientList[socket.id]
    })
  })
}

// 客户端订单变更通知
socketio.messageOrder = function name(params) {
  io.of('/client').emit('messageOrder', params)
}

module.exports = socketio
