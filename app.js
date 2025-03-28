const express = require("express");
const { Sequelize } = require("sequelize");
const Student = require("./models/Student"); // Import Student model
const app = express();

// Test Sequelize connection
(async () => {
  try {
    await Student.sequelize.authenticate();
    console.log(
      "Connection to the MySQL database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the MySQL database:", error);
  }
})();
const flash = require("connect-flash");
const session = require("express-session");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

const passport = require("passport");
// Passport Config
require("./config/passport")(passport);

const indexRouter = require("./routes/index");
const students = require("./routes/students");

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// DB Config
const db = require("./config/secret").mongoURI;

const sequelize = new Sequelize("StudentDB", "admin", "n4qh7mXTPn2656mR03m8", {
  host: "student-admission-prod.cboje8x81jqo.us-east-1.rds.amazonaws.com",
  dialect: "mysql",
});

// Connect to MySQL
sequelize
  .authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch((err) => console.log("Unable to connect to the database:", err));

// EJS
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", indexRouter);
app.use("/students", students);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
