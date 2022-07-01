import express from 'express';
import controller from '../controllers/posts';

const router = express.Router();

router.get('/', controller.getWallPosts);

export default router;