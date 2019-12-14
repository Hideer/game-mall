/*
 Navicat Premium Data Transfer

 Source Server         : MongoDB-local
 Source Server Type    : MongoDB
 Source Server Version : 40201
 Source Host           : localhost:27017
 Source Schema         : game-mall

 Target Server Type    : MongoDB
 Target Server Version : 40201
 File Encoding         : 65001

 Date: 14/12/2019 12:15:55
*/


// ----------------------------
// Collection structure for admins
// ----------------------------
db.getCollection("admins").drop();
db.createCollection("admins");
db.getCollection("admins").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true
});
db.getCollection("admins").createIndex({
    account: NumberInt("1")
}, {
    name: "account_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of admins
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("admins").insert([ {
    _id: ObjectId("5def58341a6bf049275bba3e"),
    pwd: "admin",
    account: "admin",
    name: "admin",
    id: NumberInt("1"),
    addTime: ISODate("2019-12-10T08:32:52.579Z"),
    modifyTime: ISODate("2019-12-10T08:54:10.251Z"),
    __v: NumberInt("0"),
    updatetime: ISODate("2019-12-13T09:49:55.945Z")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for comments
// ----------------------------
db.getCollection("comments").drop();
db.createCollection("comments");
db.getCollection("comments").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of comments
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("comments").insert([ {
    _id: ObjectId("5df3b170fd9ba0ab4722c1be"),
    userId: NumberInt("4"),
    goodsId: NumberInt("2"),
    goodsDetailId: NumberInt("3"),
    orderId: NumberInt("4"),
    content: "good goods",
    score: NumberInt("100"),
    id: NumberInt("1"),
    createtime: ISODate("2019-12-13T15:42:40.759Z"),
    updatetime: ISODate("2019-12-13T15:42:40.759Z"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for goods
// ----------------------------
db.getCollection("goods").drop();
db.createCollection("goods");
db.getCollection("goods").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of goods
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("goods").insert([ {
    _id: ObjectId("5df3adace25217a9ef2c633f"),
    name: "game1",
    typeId: NumberInt("1"),
    img: "https://wegame.gtimg.com/g.2000340-r.83e94/oss-images/oss_5df1ad4d27605.jpg",
    desc: "gamesadfa",
    id: NumberInt("1"),
    createtime: ISODate("2019-12-13T15:26:36.023Z"),
    updatetime: ISODate("2019-12-13T15:26:36.023Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("goods").insert([ {
    _id: ObjectId("5df3b110fd9ba0ab4722c1ba"),
    name: "other",
    typeId: NumberInt("2"),
    img: "https://wegame.gtimg.com/g.2000004-r.2d21f/info/a46cded59fc9efa9ba34ba2dd664b26e.jpg/512",
    desc: "someone game desc ",
    id: NumberInt("2"),
    createtime: ISODate("2019-12-13T15:41:04.094Z"),
    updatetime: ISODate("2019-12-13T15:41:04.094Z"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for goodsdetails
// ----------------------------
db.getCollection("goodsdetails").drop();
db.createCollection("goodsdetails");
db.getCollection("goodsdetails").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of goodsdetails
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("goodsdetails").insert([ {
    _id: ObjectId("5df3adace25217a9ef2c6340"),
    goodsId: NumberInt("1"),
    specName: "默认",
    stockNum: NumberInt("0"),
    unitPrice: NumberInt("1"),
    id: NumberInt("1"),
    createtime: ISODate("2019-12-13T15:26:36.03Z"),
    updatetime: ISODate("2019-12-13T15:36:19.977Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("goodsdetails").insert([ {
    _id: ObjectId("5df3b110fd9ba0ab4722c1bb"),
    goodsId: NumberInt("2"),
    specName: "默认",
    stockNum: NumberInt("1"),
    unitPrice: NumberInt("1"),
    id: NumberInt("2"),
    createtime: ISODate("2019-12-13T15:41:04.534Z"),
    updatetime: ISODate("2019-12-13T15:41:04.534Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("goodsdetails").insert([ {
    _id: ObjectId("5df3b110fd9ba0ab4722c1bc"),
    goodsId: NumberInt("2"),
    specName: "lover",
    stockNum: NumberInt("76"),
    unitPrice: NumberInt("90"),
    id: NumberInt("3"),
    createtime: ISODate("2019-12-13T15:41:04.549Z"),
    updatetime: ISODate("2019-12-13T15:41:59.918Z"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for messages
// ----------------------------
db.getCollection("messages").drop();
db.createCollection("messages");
db.getCollection("messages").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of messages
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("messages").insert([ {
    _id: ObjectId("5df3b181fd9ba0ab4722c1bf"),
    userId: NumberInt("4"),
    goodsId: NumberInt("2"),
    content: "some quesetion",
    id: NumberInt("1"),
    state: NumberInt("1"),
    createtime: ISODate("2019-12-13T15:42:57.195Z"),
    updatetime: ISODate("2019-12-13T15:43:19.353Z"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for orders
// ----------------------------
db.getCollection("orders").drop();
db.createCollection("orders");
db.getCollection("orders").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of orders
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("orders").insert([ {
    _id: ObjectId("5df3adb4e25217a9ef2c6341"),
    userId: NumberInt("4"),
    goodsDetailId: NumberInt("1"),
    goodsNum: NumberInt("1"),
    amount: NumberInt("1"),
    state: NumberInt("3"),
    id: NumberInt("3"),
    createtime: ISODate("2019-12-13T15:26:44.766Z"),
    updatetime: ISODate("2019-12-14T03:46:03.295Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("orders").insert([ {
    _id: ObjectId("5df3b128fd9ba0ab4722c1bd"),
    userId: NumberInt("4"),
    goodsDetailId: NumberInt("3"),
    goodsNum: NumberInt("4"),
    amount: NumberInt("360"),
    state: NumberInt("3"),
    id: NumberInt("4"),
    createtime: ISODate("2019-12-13T15:41:28.285Z"),
    updatetime: ISODate("2019-12-13T15:42:32.023Z"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for replies
// ----------------------------
db.getCollection("replies").drop();
db.createCollection("replies");
db.getCollection("replies").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of replies
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("replies").insert([ {
    _id: ObjectId("5df3b197fd9ba0ab4722c1c0"),
    messageId: NumberInt("1"),
    content: "resona message",
    createtime: ISODate("2019-12-13T15:43:19.349Z"),
    id: NumberInt("1"),
    updatetime: ISODate("2019-12-13T15:43:19.349Z"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for types
// ----------------------------
db.getCollection("types").drop();
db.createCollection("types");
db.getCollection("types").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of types
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("types").insert([ {
    _id: ObjectId("5df3ad37e25217a9ef2c633e"),
    name: "WeGame",
    id: NumberInt("1"),
    createtime: ISODate("2019-12-13T15:24:39.597Z"),
    updatetime: ISODate("2019-12-13T15:24:39.597Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("types").insert([ {
    _id: ObjectId("5df3b0edfd9ba0ab4722c1b9"),
    name: "OtherGame",
    id: NumberInt("2"),
    createtime: ISODate("2019-12-13T15:40:29.073Z"),
    updatetime: ISODate("2019-12-13T15:40:29.073Z"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for users
// ----------------------------
db.getCollection("users").drop();
db.createCollection("users");
db.getCollection("users").createIndex({
    id: NumberInt("1")
}, {
    name: "id_1",
    background: true,
    unique: true
});
db.getCollection("users").createIndex({
    email: NumberInt("1")
}, {
    name: "email_1",
    background: true,
    unique: true
});
db.getCollection("users").createIndex({
    nickname: NumberInt("1")
}, {
    name: "nickname_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of users
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("game-mall");
db.getCollection("users").insert([ {
    _id: ObjectId("5df3644a27d5c6a21dcf41b8"),
    email: "yu_meng_cheng@163.com",
    pwd: "$2a$10$.TEnOGaigMFELjwZyOAdQ.fuNTsmhIW8YiIgMiNkAi1PhRGUDvXzK",
    nickname: "admin",
    recipient: "admin",
    address: "yu_meng_cheng",
    phone: 17879838199,
    id: NumberInt("4"),
    sex: NumberInt("1"),
    headimg: "http://tvax4.sinaimg.cn/crop.0.0.480.480.180/768c39d5ly8fjje1d0teej20dc0dcq35.jpg",
    createtime: ISODate("2019-12-13T10:13:30.082Z"),
    updatetime: ISODate("2019-12-13T15:38:55.549Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("5df3b0c3fd9ba0ab4722c1b8"),
    email: "YU_mengcheng@163.com",
    pwd: "$2a$10$ABIeP2CC4BDa8IbvdCNqQOjsmKf98uzErdkCJJTH24fb.AQKgGPTO",
    nickname: "admin123",
    recipient: "admin",
    address: "admin",
    phone: 17879838199,
    id: NumberInt("5"),
    sex: NumberInt("1"),
    headimg: "http://tvax4.sinaimg.cn/crop.0.0.480.480.180/768c39d5ly8fjje1d0teej20dc0dcq35.jpg",
    createtime: ISODate("2019-12-13T15:39:47.751Z"),
    updatetime: ISODate("2019-12-13T15:39:47.751Z"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();
