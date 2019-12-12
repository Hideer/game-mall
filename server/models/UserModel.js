// const Sequelize = require('sequelize')
// const sequelize = require('../config/sequelizeBase')

// const UserModel = sequelize.define(
//   'user',
//   {
//     id: {
//       type: Sequelize.BIGINT,
//       primaryKey: true,
//       allowNull: false,
//       autoIncrement: true
//     },
//     email: {
//       type: Sequelize.STRING(64),
//       unique: true,
//       allowNull: false
//     },
//     pwd: {
//       type: Sequelize.STRING(255),
//       allowNull: false
//     },
//     nickname: {
//       type: Sequelize.STRING(64),
//       unique: true,
//       allowNull: false
//     },
//     /*0保密，1男，2女*/
//     sex: {
//       type: Sequelize.INTEGER,
//       defaultValue: 0,
//       allowNull: false
//     },
//     recipient: {
//       type: Sequelize.STRING(64),
//       allowNull: true
//     },
//     address: {
//       type: Sequelize.STRING(500),
//       allowNull: true
//     },
//     phone: {
//       type: Sequelize.STRING(64),
//       allowNull: true
//     },
//     headimg: {
//       type: Sequelize.STRING(500),
//       allowNull: false,
//       defaultValue: 'http://tvax4.sinaimg.cn/crop.0.0.480.480.180/768c39d5ly8fjje1d0teej20dc0dcq35.jpg'
//     },
//     updatetime: {
//       type: Sequelize.DATE,
//       allowNull: false
//     },
//     createtime: {
//       type: Sequelize.DATE,
//       allowNull: false
//     }
//   },
//   {
//     timestamps: false
//   }
// )

// // 反向生成数据库
// // sequelize.sync()

// module.exports = UserModel

const mongoose = require('mongoose')
// const mongoosePaginate = require('mongoose-paginate');//分页插件
let counter = 1
var ModelSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      default: () => counter++
    },
    email: {
      type: String,
      unique: true,
      required: [true, '此项必填']
    },
    pwd: {
      type: String,
      required: [true, '此项必填']
    },
    nickname: {
      type: String,
      unique: true,
      required: [true, '此项必填']
    },
    /*0保密，1男，2女*/
    sex: {
      type: Number,
      default: () => 1,
      required: [true, '此项必填']
    },
    recipient: {
      type: String
    },
    address: {
      type: String
    },
    phone: {
      type: Number,
      required: [true, '此项必填']
    },
    headimg: {
      type: String,
      default: () => 'http://tvax4.sinaimg.cn/crop.0.0.480.480.180/768c39d5ly8fjje1d0teej20dc0dcq35.jpg'
    },
  },
  {
    timestamps: {
      createdAt: 'createtime',
      updatedAt: 'updatetime'
    }
  }
)

// dietSchema.plugin(mongoosePaginate)
const UserModel = mongoose.model('User', ModelSchema)
UserModel.find({ id: { $gt: 0 } })
  .sort({ id: -1 })
  .then(([first, ...others]) => {
    if (first) counter = first.id + 1
  })
module.exports = UserModel
