const db = require("../models/index.js");
let notifications = db.notifications;
let users = db.users;

//! IMPLEMENTAR FILTROS

const { ErrorHandler } = require("../utils/error.js");

exports.getAllUserNotifs = async (req, res, next) => {
  try {
    let foundUser = await users.findOne({
      where: { id: req.loggedUserId },
      raw: true
    });
    console.log(foundUser);
    let everyNotification = await notifications.findAll({
      where: {
        UserId: req.loggedUserId,
      },
      raw: true,
    });
    res.status(200).json({ user: {username: foundUser.username, name: foundUser.name}, notifications: everyNotification });
  } catch (err) {
    next(err);
  }
};

exports.checkNotificationAsRead = async (req, res, next) => {
    if (!req.params.id){
        throw new ErrorHandler(400, 'There is not an id of a notification to be assigned as read.')
    }
    try {
        notifications.update({readState: true},
            {
                where: {
                    id: req.params.id
                }
            }
        )
        res.status(200).json({message: `Notification (id: ${req.params.id}) was successfully marked as read.`});
    } catch (err) {
        next(err)
    }
}

exports.createNotification = async (userId, message, type) => {
  let notification = await notifications.create({
    id: userId,
    message: message,
    type: type,
  });
  console.log("OK");
};
