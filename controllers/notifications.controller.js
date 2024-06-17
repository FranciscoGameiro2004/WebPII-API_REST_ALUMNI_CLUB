const db = require("../models/index.js");
let notifications = db.notifications;
let users = db.users;

//! IMPLEMENTAR FILTROS

const { ErrorHandler } = require("../utils/error.js");

exports.getAllUserNotifs = async (req, res, next) => {
  try {
    let conditions = { UserId: req.loggedUserId };

    if (req.query.readState){
      conditions.readState = req.query.readState
    }

    if (req.query.hasOwnProperty("readState")) {
      conditions.readState = req.query.readState;
    }

    let foundUser = await users.findOne({
      where: { id: req.loggedUserId },
      raw: true,
    });
    console.log(foundUser);
    let everyNotification = await notifications.findAll({
      where: conditions,
      raw: true,
    });
    res
      .status(200)
      .json({
        user: { username: foundUser.username, name: foundUser.name },
        notifications: everyNotification,
      });
  } catch (err) {
    next(err);
  }
};

exports.checkNotificationAsRead = async (req, res, next) => {
  if (!req.params.id) {
    throw new ErrorHandler(
      400,
      "There is not an id of a notification to be assigned as read."
    );
  }
  try {
    const targetNotif = await notifications.findOne({
      where: { id: req.params.id, UserId: req.loggedUserId },
      raw: true,
    });
    if (!targetNotif) {
      throw new ErrorHandler(404, "No notification was found.");
    }
    console.log("ok", targetNotif.readState);
    console.log(targetNotif);
    if (targetNotif.readState) {
      throw new ErrorHandler(
        409,
        "The notification was already marked as read."
      );
    }
    await notifications.update(
      { readState: true },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res
      .status(200)
      .json({
        message: `Notification (id: ${req.params.id}) was successfully marked as read.`,
      });
  } catch (err) {
    next(err);
  }
};


