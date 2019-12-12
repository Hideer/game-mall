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
    userId: {
      type: Number,
      required: [true, '此项必填']
    },
    goodsId: {
      type: Number,
      required: [true, '此项必填']
    },
    content: {
      type: String,
      required: [true, '此项必填']
    },
    /*0未回复，1已回复*/
    state: {
      type: Number,
      default: () => 0,
      required: [true, '此项必填']
    }
  },
  {
    timestamps: {
      createdAt: 'createtime',
      updatedAt: 'updatetime'
    }
  }
)

// dietSchema.plugin(mongoosePaginate)
const MessageModel = mongoose.model('Message', ModelSchema)
MessageModel.find({ id: { $gt: 0 } })
  .sort({ id: -1 })
  .then(([first, ...others]) => {
    if (first) counter = first.id + 1
  })
module.exports = MessageModel
