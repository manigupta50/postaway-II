import { customErrorHandler } from "../../middlewares/errorHandler.js";
import CommentRepository from "./comment.repository.js";

export default class CommentController {

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  // Controller for creating a comment
  async add(req, res, next) {
    try {
      const postId = req.params.postId;
      const commentData = req.body;
      const comment = await this.commentRepository.add(req.cookies.userId, postId, commentData);
      if(comment.success) {
        return res.json({ success: comment.success, msg: comment.msg, details: comment.comment });
      }
      return res.json({ success: comment.success, msg: comment.msg });
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };

  // Controller for updating a comment
  async update(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const commentData = req.body;
      const comment = await this.commentRepository.update(req.cookies.userId, commentId, commentData);
      if (comment.success) {
        return res.json({ success: comment.success, msg: comment.msg, details: comment.comment });
      }
      return res.json({ success: comment.success, msg: comment.msg });
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };

  // Controller for deleting a comment
  async delete(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const userId = req.cookies.userId;
      const comment = await this.commentRepository.delete(commentId, userId);
      return res.json({ success: comment.success, msg: comment.msg });
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };

  // Controller for getting all the comments of a post
  async getAll(req, res) {
    try {
      const postId = req.params.postId;
      const comments = await this.commentRepository.getAll(postId);
      return res.status(200).json({ comments: comments });
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };

}



