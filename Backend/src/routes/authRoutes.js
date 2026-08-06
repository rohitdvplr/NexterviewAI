import express from "express";
import authController from "../controllers/authController.js";
import authUser from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

router.get("/get-me", authUser, authController.getMe); 



export default router; 