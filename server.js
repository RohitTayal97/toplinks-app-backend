require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const cors = require("cors");
const socketio = require("socket.io");
const authRoutes = require("./routes/auth");
const passportInit = require("./passportInit");
const app = express();
const server = require("http").createServer(app);

mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to mongo db");
  }
);

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
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true,
  })
);

const io = socketio(server);
app.set("io", io);

app.use("/auth", authRoutes);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}!`));
