import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js"; //importing postroute
import userRoutes from "./routes/user.js"; //importing userroute
dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true })); //parses the post request and acceopting larget files
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); //approving the all whe webstie which are using this api
app.use("/posts", postRoutes); //posts request
app.use("/user", userRoutes); //user request
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, //here just ignore extra arguments because its just to remove warinings
  })
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Listening to port-4000 and connected to database");
    });
  })
  .catch((e) => console.log(e));
