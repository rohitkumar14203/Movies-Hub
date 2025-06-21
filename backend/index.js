import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
connectDB();
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: "https://movies-hub-navy-omega.vercel.app", //http://localhost:5173
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("I am at Your Service Lord 🐱‍👤");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);

const _dirname = path.resolve();
console.log(_dirname);
app.use("/upload", express.static(path.join(_dirname + "/upload")));

app.listen(port, () => {
  console.log(`server is up baby...`);
});
