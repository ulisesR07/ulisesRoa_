const express = require("express");
const session = require("express-session");
const passport = require("passport");

const { MONGO_URI, SECRET } = require("../config/globals");

const app = express();


const mongoStore = require("connect-mongo");
const advancedOptionsMongo = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


const routers = require("../routes/index");
const routesConfig = require("../routes/routes.config");
const ChatWebsocket = require("../routes/modules/websocket");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");


app.use(
  session({
    store: mongoStore.create({
      mongoUrl: MONGO_URI,
      MongoOptions: advancedOptionsMongo,
    }),
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 6000000,
    },
  })
);


require("../middleware/auth.config")(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(routesConfig(routers()));
ChatWebsocket(io);

module.exports = server;
