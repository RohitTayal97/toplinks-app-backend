const express = require("express");
const router = express.Router();
const passport = require("passport");

const addSocketIdtoSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

router.get("/", addSocketIdtoSession, passport.authenticate("twitter"));

router.get("/callback", passport.authenticate("twitter"), (req, res) => {
  console.log("##################req", req);
  console.log("##################user", req.user);
  const io = req.app.get("io");
  const user = {
    name: req.user.username,
  };
  io.in(req.session.socketId).emit("authdone", user);
});

module.exports = router;
