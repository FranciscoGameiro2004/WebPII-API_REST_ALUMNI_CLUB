exports.createNotification = async (userId, message, type) => {
    try {
      const db = require("../../models/index.js");
      let notifications = db.notifications;
      let users = db.users;
      console.log("--------------CREATING NOTIFICATION--------------");
      let notification = await notifications.create({
        UserId: userId,
        message: message,
        type: type,
      });
      console.log("OK");
      return true;
    } catch (error) {
      console.log(error.message)
      return error.message;
    }
  };