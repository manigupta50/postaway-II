import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.js";

const router = express.Router();

const userController = new UserController();

// Routes for user actions
router.route("/signup").post((req, res) => {
    userController.signUp(req, res)
});

router.route("/signin").post((req, res) => {
    userController.signIn(req, res) 
});

router.route("/logout").get(jwtAuth, (req, res) => {
    userController.logout(req, res)
});

router.route("/logout-all-devices").get(jwtAuth, (req, res) => {
    userController.logoutAllDevices(req, res)
});

router.route("/update/password").post(jwtAuth, (req, res, next) => {
    userController.updatePassword(req, res, next)
});

router.route("/get-details/:userId").get(jwtAuth, (req, res) => {
    userController.getDetails(req, res)
});

router.route("/get-all-details").get(jwtAuth, (req, res) => {
    userController.getAllDetails(req, res)
});

router.route("/update-details/:userId").put(jwtAuth, (req, res) => {
    userController.updateDetails(req, res)
});

export default router;
