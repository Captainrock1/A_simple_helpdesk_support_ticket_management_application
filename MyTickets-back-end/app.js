var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cors = require("cors");

var cookieParser = require("cookie-parser");
var logger = require("morgan");

var session = require("express-session");

var flash = require("connect-flash");

var indexRouter = require("./routes/index");

var app = express();

//set port
var corsOptions = {
  origin: "http://localhost:8080",
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Link to website: http://localhost:${PORT}/`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
