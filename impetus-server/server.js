import express from "express";
import passport from "passport";
import { PORT } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import dilemmasRoutes from "./routes/dilemmasRoutes.js";
import initializePassport from "./config/passport.js";
import connectDB from "./config/database.js";

initializePassport();

const app = express();
app.use(express.json());
app.use(passport.initialize());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dilemmas", dilemmasRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
