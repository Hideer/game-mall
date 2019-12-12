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
    goodsDetailId: {
      type: Number,
      required: [true, '此项必填']
    },
    orderId: {
      type: Number,
      required: [true, '此项必填']
    },
    content: {
      type: String
    },
    /*打分，一颗星代表20分，最高100分*/
    score: {
      type: Number,
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
const CommentModel = mongoose.model('Comment', ModelSchema)
CommentModel.find({ id: { $gt: 0 } })
  .sort({ id: -1 })
  .then(([first, ...others]) => {
    if (first) counter = first.id + 1
  })
module.exports = CommentModel
