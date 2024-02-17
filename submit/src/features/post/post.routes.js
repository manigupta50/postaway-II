import express from 'express';
import jwtAuth from '../../middlewares/jwtAuth.js';
import PostController from './post.controller.js';
import imageUpload from '../../middlewares/fileUploadMiddleware.js';

const router = express.Router();

const postController = new PostController();

// Routes for CRUD operations on posts
router.route('/').post(jwtAuth, imageUpload.single('imageUrl'), (req, res) => {
    postController.newPost(req, res);
});
router.route('/all').get(jwtAuth, (req, res) => {
    postController.getAllPost(req, res) 
});
router.route('/').get(jwtAuth, (req, res) => {
    postController.usersPost(req, res)
});
router.route('/:postId').get((req, res) => {
    postController.getOnePost(req, res)
});
router.route('/:postId').put(jwtAuth, imageUpload.single('imageUrl'), (req, res) => {
    postController.updatePost(req, res)
});
router.route('/:postId').delete(jwtAuth, (req, res) => {
    postController.deletePost(req, res)
});

export default router;
