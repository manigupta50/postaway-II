import express from "express";
import OTPController from "./otp.controller.js";

const router = express.Router();

const otpController = new OTPController();

// Routes for OTP actions
router.route("/send").post((req, res) => {
    otpController.send(req, res)
});

router.route("/verify").post((req, res) => {
    otpController.verify(req, res) 
});

router.route("/reset-password").post((req, res) => {
    otpController.resetPassword(req, res) 
});

export default router;