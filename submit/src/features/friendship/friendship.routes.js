import express from "express";
import FriendshipController from "./friendship.controller.js";

const router = express.Router();

const friendshipController = new FriendshipController();

// Routes for friendship actions
router.route("/get-friends/:userId").get((req, res) => {
    friendshipController.getFriends(req, res)
});

router.route("/get-pending-requests").get((req, res) => {
    friendshipController.getPendingRequests(req, res) 
});

router.route("/toggle-friendship/:friendId").get((req, res) => {
    friendshipController.toggleFriendship(req, res) 
});

router.route("/response-to-request/:friendId").get((req, res) => {
    friendshipController.friendReqRes(req, res) 
});

export default router;