import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

import { userSchema } from "./user.schema.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import { compareHashedPassword, hashPassword } from "../../utils/hashPassword.js";

const UserModel = mongoose.model('User', userSchema);

export default class UserRepository {

    // Repository for signing up
    async signUp(userData) {
        try {
            const email = userData.email;
            const user = await UserModel.findOne({ email });
            if(user) return null;
            const newUser = new UserModel(userData, { loginTokens: [] } );
            await newUser.save();
            return newUser;
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

    // Repository for signing in
    async signIn(userData) {
        try {
            const email = userData.email;
            const password = userData.password;
            const emailFind = await UserModel.findOne({ email });
            if(!emailFind) {
                return { success: false, error: { msg: "user not found", statusCode: 404 } };
            } else {
                const user = await compareHashedPassword(password, emailFind.password);
                if(!user) {
                    return { success: false, error: { msg: "Incorrect Password", statusCode: 400 } };
                }
                const token = jwt.sign(
                    { userId: emailFind._id, userEmail: email },
                    "ninja",
                    { expiresIn: "1h" }
                );
                await UserModel.findOneAndUpdate({ email }, { $push: {"loginTokens": token } }, {safe: true, upsert: true, new: true });
                return { success: true, msg: "Logged in successfully", details: emailFind, token: token };
            }
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

    // Repository for updating the password
    async updatePassword(id, newPassword, next) {
        try {
            const hashedPassword = await hashPassword(newPassword);
            const userId = new ObjectId(id);
            let user = await UserModel.findOne( { _id: userId });
            if(!user) {
                return { success: false, error: { msg: "user not found", statusCode: 404 } };
            } else {
                user.password = hashedPassword;
                await user.save();
                return { success: true, error: { msg: user, statusCode: 201 } };
            }
        } catch(err) {
            console.log(err);
            return { success: false, error: { msg: err, statusCode: 400 } };
        }
    };

    // Repository for fetching the details
    async getDetails(userId) {
        try {
            const details = await UserModel.findById(userId).select('-password').select('-loginTokens');
            if(details) {
                return { success: true, msg: 'User found.', details: details }; 
            }
            return { success: false, msg: 'User not found.' };
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

    // Repository for fetching all the details
    async getAllDetails() {
        try {
            const allUserDetails = await UserModel.find().select('-password').select('-loginTokens');
            return allUserDetails;
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

    // Repository for updating the details
    async updateDetails(userId, userData) {
        try {
            const update = await UserModel.findOneAndUpdate({ _id: userId }, { userData });
            if(update) {
                return { success: true, msg: 'Updated successfully.', details: update };
            } else {
                return { success: false, msg: 'Update failed.' };
            }
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

    // Repository for logging out
    async logout(userId, token) {
        try {
            const removeToken = await UserModel.updateOne({ _id: userId }, { $pull: { "loginTokens": token } });
            if(removeToken.modifiedCount > 0) {
                return { success: true, msg: 'Token removed from DB.' };
            } else {
                return { success: false, msg: 'Token removal from DB failed.' };
            }
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

    // Repository for logging out from all the devices
    async logoutAllDevices(userId) {
        try {
            const removeToken = await UserModel.updateOne({ _id: userId }, { $set: { "loginTokens": [] } });
            if(removeToken.modifiedCount > 0) {
                return { success: true, msg: 'Token removed from DB.' };
            } else {
                return { success: false, msg: 'Token removal from DB failed.' };
            }
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

};