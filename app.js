const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const indexRouter = require("./routes/index.routes");
const fileRouter = require("./routes/file.routes");

const cookieParser = require("cookie-parser");
//to use the .env variable
const dotenv = require("dotenv");
dotenv.config();

// database connection
const connectToDB = require("./config/db");
connectToDB();

// inbuilt middleware routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/file", fileRouter);

// cookies middleware
app.use(cookieParser());

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
