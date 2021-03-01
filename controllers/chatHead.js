const mongoose = require("mongoose");
var md5 = require("md5");

const User = mongoose.model("User");
const ChatHead = mongoose.model("ChatHead");
const Group = mongoose.model("Group");
const log = require("../helper/logger");
const user = require("./userControl");
const Chat = mongoose.model("Chat");
const Broadcast = mongoose.model("Broadcast");

module.exports = {
  addHead: (headData) => {
    return new Promise(function (resolve, reject) {
      if (headData.isGroup == true) {
        User.find(
          {
            mobileNumber: {
              $in: headData.participents,
            },
          },
          { _id: 1 }
        ).then((resData) => {
          var payload = {
            name: headData.name,
            sender: headData.sender,
            participants: resData,
          };
          var data = new Group(payload);

          headData["groupId"] = data._id;
          headData["isGroup"] = true;

          var head = new ChatHead(headData);
          data["chatHead"] = head._id;
          head
            .save()
            .then((resHead) => {
              data
                .save()
                .then((resGroup) => {
                  console.log(resGroup);
                  resolve(resGroup);
                })
                .catch((error) => {
                  log.error("Add head Error :", error);
                  reject(error);
                });
            })
            .catch((error) => {
              log.error("Add head Error :", error);
              reject(error);
            });
        });
      } else {
        User.findOne({ mobileNumber: headData.mobileNumber }).then(
          (payload) => {
            if (payload) {
              headData["receiver"] = payload._id;
              ChatHead.findOne({
                $or: [
                  {
                    $and: [
                      {
                        sender: headData.sender,
                      },
                      {
                        receiver: payload._id,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        receiver: headData.sender,
                      },
                      {
                        sender: payload._id,
                      },
                    ],
                  },
                ],
              }).then((data) => {
                if (data) {
                  resolve(data);
                } else {
                  let encrypt = headData.sender + payload._id;
                  let mdhash = md5(encrypt);
                  headData["chatHead"] = mdhash;
                  var head = new ChatHead(headData);
                  head
                    .save()
                    .then((data) => {
                      resolve(data);
                    })
                    .catch((error) => {
                      log.error("Add head Error :", error);
                      reject(error);
                    });
                }
              });
            }
          }
        );
      }
    });
  },

  getAllOfHead: (userId) => {
    return new Promise(function (resolve, reject) {
      console.log("+++++++++++++++++++++++++++++++++");
      ChatHead.aggregate([
        {
          $match: {
            $or: [
              {
                sender: mongoose.Types.ObjectId(userId),
              },
              {
                receiver: mongoose.Types.ObjectId(userId),
              },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "sender_info",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "receiver",
            foreignField: "_id",
            as: "receiver_info",
          },
        },
        {
          $lookup: {
            from: "chats",
            localField: "_id",
            foreignField: "chatHead",
            as: "chat_info",
          },
        },
        {
          $unwind: "$chat_info",
        },
        {
          $unwind: "$sender_info",
        },
        {
          $unwind: "$receiver_info",
        },
        {
          $sort: {
            "chat_info.chatHead": -1,
          },
        },
        {
          $group: {
            _id: "$chat_info.chatHead",
            lastMessage: {
              $last: "$chat_info.message",
            },
            lastMessageChatTime: {
              $last: "$chat_info.createdAt",
            },
            sender_info: {
              $first: "$sender_info",
            },
            receiver_info: {
              $first: "$receiver_info",
            },
            isGroup: {
              $first: "$isGroup",
            },
            isBroadcast: {
              $first: "$isBroadcast",
            },
          },
        },
      ])
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },

  getGroupHead: (userId) => {
    return new Promise(function (resolve, reject) {
      Group.aggregate([
        {
          $unwind: "$participants",
        },
        {
          $match: {
            $or: [
              {
                "participants._id": mongoose.Types.ObjectId(userId),
              },
              {
                sender: userId,
              },
            ],
          },
        },
        {
          $group: {
            _id: "$_id",
            chatHeadId: {
              $last: "$chatHead",
            },
            name: {
              $first: "$name",
            },
            isGroup: {
              $first: "$isGroup",
            },
            isBroadcast: {
              $first: "$isBroadcast",
            },
          },
        },
      ])
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },

  getBroadcastHead: (userId) => {
    return new Promise(function (resolve, reject) {
      Broadcast.aggregate([
        {
          $match: {
            $or: [
              {
                sender: userId,
              },
            ],
          },
        },
        {
          $group: {
            _id: "$_id",
            name: {$last: "$name"},
            isBroadcast: {$last: "$isBroadcast"},
            isGroup: {$last: "$isGroup"},
          },
        },
      ])
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};

// getAllOfHead: (userId) => {
//     log.debug("getAllfriends", userId);
//     return new Promise(function (resolve, reject) {
//       ChatHead.find({
//         $or: [
//           {
//             sender: userId.findId,
//           },
//           {
//             receiver: userId.findId,
//           },
//         ],
//       })
//         .then((res) => {
//           var frnd = [];
//           res.forEach((ele) => {
//               frnd.push(ele._id);
//           });
//           Chat.find({ chatHead : {$in : frnd} }).sort({_id:-1}).limit(1).populate("sentBy").populate("receivedBy").then((resData)=>{
//             resolve(resData);
//           })
//           .catch((err) => reject(err));
//         })
//         .catch((err) => reject(err));
//     });

// },

// getAllOfHead: (headData) =>{
//     log.debug('getAllOfHead', headData);
//     let id = headData.findId;
//     return new Promise(function (resolve, reject) {
//         ChatHead.find({
//             $or: [{
//                 "sender": id
//             },
//             {
//                 "receiver": id
//             }]
//         }).populate('sender').populate('receiver').then((data) => {
//             if (data) {
//                 data.forEach(ele => {
//                     console.log(ele.receiver)
//                     if (id == ele.receiver._id) {
//                         let dummy = new ChatHead();
//                         dummy = {
//                             _id: ele.sender._id,
//                             mobileNumber: ele.sender.mobileNumber,
//                             email: ele.sender.email,
//                             name: ele.sender.name,
//                             avatar: ele.sender.avatar,
//                             designation: ele.sender.designation,
//                             isGroup: ele.sender.isGroup,
//                             groupId: ele.sender.groupId
//                         }
//                         ele.sender = ele.receiver;
//                         ele.receiver = dummy;
//                     }
//                     Chat.find({
//                         "chatHead": ele._id
//                     }).sort({_id:-1}).limit(1).then((lastMsg) => {
//                         if(lastMsg){
//                             console.log("last msg======", lastMsg)

//                             .lastMsg = lastMsg.message;

//                         }
//                     })

//                 })

//                 resolve(data);
//             } else {
//                 resolve([]);
//             }
//         }).catch(error => {
//             log.error('Get all Of Head Error : ', error);
//             reject(error);
//         });
//     });
// }
