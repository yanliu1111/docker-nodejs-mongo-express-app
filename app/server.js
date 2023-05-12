import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import bodyParser from "body-parser";
let app = express();

const db = await mongoose.connect(
  "mongodb://admin:password@127.0.0.1:27016/my-db?authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const UserSchema = new db.Schema({
  userid: Number,
  name: String,
  email: String,
  interests: String,
});
const User = db.model("User", UserSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/profile-picture", function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, { "Content-Type": "image/jpg" });
  res.end(img, "binary");
});

let databaseName = "my-db";
let query = { userid: 1 };

app.post("/update-profile", function (req, res) {
  let userObj = req.body;
  console.log("connected to the mongodb line32");

  userObj["userid"] = 1;
  User.updateOne(query, userObj, { upsert: true }).then(() => {
    console.log("successfully updated the profile");
    res.send(userObj);
  });
});

app.get("/get-profile", function (req, res) {
  let response = res;
  console.log("successfully connected to line58");
  User.findOne(query).then((result) => {
    console.log("successfully retrieved the profile line60");
    response.send(result);
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
