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
    name: {
      type: String,
      required: [true, '此项必填']
    },
    typeId: {
      type: Number,
      required: [true, '此项必填']
    },
    img: {
      type: String
    },
    desc: {
      type: String
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
const GoodsModel = mongoose.model('Goods', ModelSchema)
GoodsModel.find({ id: { $gt: 0 } })
  .sort({ id: -1 })
  .then(([first, ...others]) => {
    if (first) counter = first.id + 1
  })
module.exports = GoodsModel
