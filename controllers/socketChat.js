let express = require("express");
const https = require("https");
//const http = require('http').createServer();
const http = require("http");
const app = express();
const mongoose = require('mongoose');
const Chat = mongoose.model("Chat");

const User = mongoose.model("User");
const ChatHead = mongoose.model("ChatHead");
const Group = mongoose.model("Group");
const Broadcast = mongoose.model("Broadcast");
var fbadmin = require("firebase-admin");
const broadCastController = require('./broadcast');


var server;

server = http.createServer({}, app);
server.listen(8889); //listen on port 8889

const io = require("socket.io").listen(server, {
  pingTimeout: 3000,
  pingInterval: 3000,
});
console.log("io connected");

const userData = {};
const socketIds = {};
const socketMessageIds = {};
let userCopy = {};

module.exports = (async () => {

  sendNotify: (tokens, body, title) => {
    const message = {
      notification: {
        title: title,
        body: body,
      },
    };
    const options = {
      priority: "high"
    };
    fbadmin
      .messaging()
      .sendToDevice(tokens, message, options)
      .then((response) => {
        console.log("response", response);
      });
  };

  console.log("🚀 ~ file: socketChat.js ~ line 32 ~ io.on ~ connection")
  io.on("connection", async (socket) => {

    socket.on("connected", async (data) => {
      try {
        socketIds[data.userId] = socket.id
        socket.emit("connected", {
          "ok": socket.id
        });
      } catch (error) {
        socket.emit("connectionFailed", 0);
        console.log("get chatHeads---++_+_+-->", error);
      }
    });

    socket.on("getChatHeads", async (data) => {
      try {
        let {
          userId
        } = data;
        const chatHeadsres = await ChatHead.aggregate([{
            $match: {
              $or: [{
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
              "updatedAt": -1,
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
        socket.emit("receiveHeads", chatHeadsres);
      } catch (error) {
        socket.emit("receiveHeads", 0);
        console.log("get chatHeads---++_+_+-->", error);
      }
    });

    socket.on("sendMsg", async (data) => {
      try {
        var chat = new Chat(data);
        const chatRes = await chat.save();
        io.emit("receiveMsg", chatRes);
        const headRes = await ChatHead.findByIdAndUpdate(data.chatHead, {
          lastMsg: data.message
        }, {
          $new: true
        })
        if (data.isGroup) {
          Group.findOne({
              _id: mongoose.Types.ObjectId(req.body.groupId)
            })
            .then((resData) => {
              User.find({
                  _id: {
                    $in: resData.participants
                  }
                }, {
                  deviceToken: 1
                })
                .then((data) => {
                  let registrationTokens =[]
                  console.log(data);
                  data.forEach((ele) => {
                    registrationTokens.push(ele.deviceToken);
                  });

                  sendNotify(registrationTokens, data.body, data.title)

                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          User.findOne({
              _id: req.body.receivedBy
            }).then((userRes) => {
              sendNotify(userRes.deviceToken, data.body, data.title)
            })
            .catch((error) => {
              log.error(error.code);
              response.errorResponse(res, parseInt(error.code));
            });
        }
      } catch (error) {
        socket.to(socketIds[chatRes.receivedBy]).emit("receiveMsg", 0);
        console.log("socket sendMsg-->", error);
      }
    });


    socket.on("sendBroadcast", async (data) => {
      try {
        var broadcast = await Broadcast.findById({_id: data.broadcastId});
        var broadcastChat = await broadCastController.putChat(data.message, data.broadcastId)

        var chatObj = [];
        var headObj = [];
        Array.from(broadcast.chatHeads).forEach(ele => {
          chatObj.push({message: data.message, sentBy:data.sender,
                    chatHead:ele});
          headObj.push(ele);
        })
        var addChat = await broadCastController.addBroadcastChat(chatObj)
        var updatedHeads = Broadcast.updateMany({_id: {$in: headObj}}, {lastMsg: data.message}, {$new: true})
        io.emit("receiveBroadcast", headObj);



        
      } catch (error) {
        socket.to(socketIds[chatRes.receivedBy]).emit("receiveBroadcast", 0);
        console.log("socket sendMsg-->", error);
      }
    });

    socket.on("getChat", async (data) => {
      try {
        const getChatres = await Chat.find({
          chatHead: data.chatHeadId
        }, ).sort({
          _id: 1
        }).limit(20)
        socket.emit("receiveChat", getChatres);
      } catch (error) {
        socket.emit("receiveChat", 0);
        console.log("socket sendMsg-->", error);
      }
    });

    socket.on("getHistory", async (data) => {
      try {
        const getChatres = await Chat.find({
          $and: [{
              chatHead: data.chatHeadId
            },
            {
              _id: {
                $lt: mongoose.Types.ObjectId(data.messageId)
              }
            }
          ]
        }).sort({
          _id: 1
        }).limit(20)
        socket.emit("receiveHistory", getChatres);
      } catch (error) {
        socket.emit("receiveHistory", 0);
        console.log("socket sendMsg-->", error);
      }
    });
  })
});