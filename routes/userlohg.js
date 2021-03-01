// import * as usersController from "../controllers/user";
const router = require("express").Router();
const usersController = require("../controllers/userControl");
const log = require("../helper/logger");
const response = require("../helper/response");
const token = require("../helper/tokens");
const otpHelper = require("../helper/otp");
const sms = require("../helper/sms");
const config = require("../config.json");

// router.post("/login", (req, res) => {
//   log.debug("/api/user/login");
//   usersController
//     .getLogin(req.body)
//     .then((userData) => {
//       const data = {
//         _id: userData._id,
//         mobileNumber: userData.mobileNumber,
//         email: userData.email,
//         name: userData.name,
//         avatar: userData.avatar,
//         designation: userData.designation,
//       };
//       console.log(data);
//       var otp = otpHelper.generateOTP();
//       usersController
//         .update(data._id, { otp: otp })
//         .then((generatedOtp) => {
//           sms(data.mobileNumber, otp)
//             .then((resOtp) => {
//               response.successResponse(res, 200, data);
//             })
//             .catch((error) => {
//               log.error(error.code);
//               response.errorResponse(res, 405);
//             });
//         })
//         .catch((error) => {
//           log.error(error.code);
//           response.errorResponse(res, parseInt(error.code));
//         });
//     })
//     .catch((error) => {
//       log.error(error.code);
//       response.errorResponse(res, parseInt(error.code));
//     });
// });

// router.post("/add", (req, res) => {
//   log.debug("/api/user/login");
//   usersController
//     .addUser(req.body)
//     .then((userData) => {
//       response.successResponse(res, 200, userData);
//     })
//     .catch((error) => {
//       log.error(error.code);
//       response.errorResponse(res, parseInt(error.code));
//     });
// });

// router.post("/verifyOTP", (req, res) => {
//   console.log("/api/user/otp");
//   usersController
//     .verifyOtp(req.body)
//     .then((userData) => {
//       if (userData) {
//         const data = {
//           _id: userData._id,
//           mobileNumber: userData.mobileNumber,
//           email: userData.email,
//           name: userData.name,
//           avatar: userData.avatar,
//           designation: userData.designation,
//         };
//         const genToken = token.encrypt(data);
//         response.successResponse(res, 200, {
//           userData,
//           genToken,
//         });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       response.errorResponse(res, 401);
//     });
// });

// router.put("/updateUser/:id", (req, res) => {
//   console.log(req.params.id);
//   usersController
//     .update(req.params.id, req.body)
//     .then((userData) => {
//       response.successResponse(res, 200, userData);
//     })
//     .catch((error) => {
//       response.errorResponse(res, parseInt(error.code));
//     });
// });

// router.get("/check/:mobileNumber", (req, res) => {
//   log.debug("api/user/check");
//   usersController
//     .ckeckUser(req.params.mobileNumber)
//     .then((chatData) => {
//       response.successResponse(res, 200, chatData);
//     })
//     .catch((error) => {
//       log.error(error.code);
//       response.errorResponse(res, 404);
//     });
// });

router.get("/profile/:userId", (req, res) => {
  log.debug("/api/user/login");
  usersController
    .getProfile()
    .then((userData) => {
      response.successResponse(res, 200, userData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });
});

// router.get("/", (req, res) => {
//   log.debug("/api/user/login");
//   usersController
//     .getAllUsers()
//     .then((userData) => {
//       response.successResponse(res, 200, userData);
//     })
//     .catch((error) => {
//       log.error(error.code);
//       response.errorResponse(res, parseInt(error.code));
//     });
// });

// router.put("/updateToken/:id", (req, res) => {
//   let data = {
//     deviceToken: req.body.deviceToken,
//   };
//   console.log(req.params.id);
//   usersController
//     .updateToken(req.params.id, data)
//     .then((userData) => {
//       response.successResponse(res, 200, userData);
//     })
//     .catch((error) => {
//       response.errorResponse(res, parseInt(error.code));
//     });
// });

// router.put("/payment/add/:id", (req, res) => {
//   log.debug("/api/status/addStatus");
//   let data = {
//     payment: req.body.payment,
//     subscription: true,
//   };
//   usersController
//     .updatePayment(req.params.id, data)
//     .then((resData) => {
//       response.successResponse(res, 200, resData);
//     })
//     .catch((error) => {
//       response.errorResponse(res, parseInt(error.code));
//     });
// });

// router.put("/update/wallet/by/:id", (req, res) => {
//   log.debug("/api/status/addStatus");
//   usersController
//     .updateWallet(req.params.id, req.body.amount)
//     .then((resData) => {
//       response.successResponse(res, 200, resData);
//     })
//     .catch((error) => {
//       response.errorResponse(res, parseInt(error.code));
//     });
// });

// router.delete("/delete/by/:id", (req, res) => {
//   log.debug("/api/status/deleteUser");
//   usersController
//     .deleteUser(req.params.id)
//     .then((resData) => {
//       response.successResponse(res, 200, resData);
//     })
//     .catch((error) => {
//       response.errorResponse(res, parseInt(error.code));
//     });
// });

// router.get("/last/month/users/count", (req, res) => {
//   console.log("/last/month/users");
//   usersController
//     .registeredUsers()
//     .then((resData) => {
//       response.successResponse(res, 200, resData);
//     })
//     .catch((err) => {
//       response.errorResponse(res, parseInt(err.code));
//     });
// });

// router.post("/users/as/last/", (req, res) => {
//   usersController
//     .lastUsers(req.body)
//     .then((resData) => {
//       response.successResponse(res, 200, resData);
//     })
//     .catch((err) => {
//       response.errorResponse(res, parseInt(err.code));
//     });
// });

// router.get("/admin/notify/all/:message", (req, res) => {
//   usersController
//     .notifyAll(req.params.message)
//     .then((resData) => {
//       response.successResponse(res, 200, resData);
//     })
//     .catch((err) => {
//       response.errorResponse(res, parseInt(err.code));
//     });
// });

module.exports = router;
