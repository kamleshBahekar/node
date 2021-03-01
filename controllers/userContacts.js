const mongoose = require("mongoose");

const User = mongoose.model("User");
const UserContacts = mongoose.model("UserContacts");

module.exports = {
    registeredContacts: (mobileNumber, userId) => {
        return new Promise((resolve, reject) => {
            UserContacts.findOneAndDelete({
                    userId: userId
                })
                .then((deleteRes) => {
                    var mobArr = [];
                    mobileNumber.forEach((element) => {
                        mobArr.push(element.mobNo);
                    });
                    User.find({
                            mobileNumber: {
                                $in: mobArr
                            }
                        })
                        .then((resData) => {
                            var notReg = [];
                            var reg = [];
                            var avatar;
                            var id;
                            mobileNumber.forEach((element) => {
                                let flag = false;
                                resData.forEach((ele) => {
                                    if (element.mobNo == ele.mobileNumber) {
                                        flag = true;
                                        avatar = ele.avatar ? ele.avatar : "";
                                        id = ele._id;
                                    }
                                });
                                if (flag == true) {
                                    reg.push({
                                        _id: id,
                                        mobileNumber: element.mobNo,
                                        name: element.name,
                                        avatar: avatar,
                                        isResgistered: true,
                                    });
                                } else {
                                    notReg.push({
                                        name: element.name,
                                        mobileNumber: element.mobNo,
                                        isResgistered: false,
                                    });
                                }
                            });
                            
                            var obj = new UserContacts({
                                userId: userId,
                                regestered: reg,
                                notRegestered: notReg,
                            });
                            obj
                                .save()
                                .then((resData) => {
                                    resolve(resData);
                                })
                                .catch((err) => {
                                    console.log("err", err);
                                    reject(err);
                                });
                        })
                        .catch((err) => {
                            console.log("err", err);
                            reject(err);
                        });
                })
                .catch((err) => {
                    console.log("err", err);
                    reject(err);
                });
        });
    },

    getContacts: (userId) => {
        return new Promise((resolve, reject) => {
            UserContacts.find({
                    userId: userId
                })
                .then((resData) => {
                    resolve(resData);
                })
                .catch((err) => {
                    console.log("err", err);
                    reject(err);
                });
        });
    },
}