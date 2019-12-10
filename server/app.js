const Express = require('express')
const logger = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const jwt = require('express-jwt')
const cors = require('cors')
const app = new Express()
// const http = require('http').Server(app)
// const io = require('socket.io')(http)
// const io = require('socket.io').listen(app)


// router
const mall = require('./routes/mall')
const user = require('./routes/user')
const admin = require('./routes/admin')

// middlewares
app.use(
  cors({
    origin: '*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
)
app.use(Express.static(path.join(__dirname, 'public')))
app.use(logger())
app.use(methodOverride())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

app.use(
  jwt({
    secret: 'chambers'
  }).unless({ path: [/(^\/api|\/)/] })
)

// routes
// app.use(mall.routes(), mall.allowedMethods());
// app.use(user.routes(), user.allowedMethods());
// app.use(admin.routes(), admin.allowedMethods());
app.use(mall)
app.use(user)
app.use(admin)

// socket
// io.sockets.on('connection', (socket) => {
//     console.log('连接成功');
//     // socket.emit('login', 'loginSuccess');
//     // socket.on('toggle', value => {
//     //     console.log(value);
//     //     socket.emit('toggle', !value);
//     // })
// });

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
