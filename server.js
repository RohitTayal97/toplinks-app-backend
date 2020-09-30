require("dotenv").config();
const express = require("express");
// const path = require("path");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const socketio = require("socket.io");
const authRoutes = require("./routes/auth");
const passportInit = require("./passportInit");
const app = express();
const server = require("http").createServer(app);

app.use(express.json());
app.use(passport.initialize());
passportInit();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

const io = socketio(server);
app.set("io", io);

app.use("/auth", authRoutes);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}!`));
